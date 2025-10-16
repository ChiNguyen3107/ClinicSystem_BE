import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from './useWebSocket';

export interface LiveDataPoint {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface LiveChartData {
  id: string;
  name: string;
  data: LiveDataPoint[];
  color?: string;
  type?: 'line' | 'bar' | 'area';
}

export interface LiveCounter {
  id: string;
  label: string;
  value: number;
  previousValue?: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  format?: 'number' | 'currency' | 'percentage';
}

export interface LiveTableRow {
  id: string;
  data: Record<string, any>;
  timestamp: Date;
  status?: 'new' | 'updated' | 'removed';
}

export interface LiveTable {
  id: string;
  columns: Array<{
    key: string;
    label: string;
    type?: 'text' | 'number' | 'date' | 'status';
  }>;
  rows: LiveTableRow[];
  maxRows?: number;
}

interface UseLiveDataOptions {
  chartChannels?: string[];
  counterChannels?: string[];
  tableChannels?: string[];
  updateInterval?: number;
  maxDataPoints?: number;
}

interface UseLiveDataReturn {
  charts: Record<string, LiveChartData>;
  counters: Record<string, LiveCounter>;
  tables: Record<string, LiveTable>;
  isConnected: boolean;
  lastUpdate: Date | null;
  error: string | null;
  subscribe: (channel: string, type: 'chart' | 'counter' | 'table') => void;
  unsubscribe: (channel: string) => void;
  clearData: (channel: string) => void;
}

export const useLiveData = (options: UseLiveDataOptions = {}): UseLiveDataReturn => {
  const {
    chartChannels = [],
    counterChannels = [],
    tableChannels = [],
    updateInterval = 1000,
    maxDataPoints = 100
  } = options;

  const [charts, setCharts] = useState<Record<string, LiveChartData>>({});
  const [counters, setCounters] = useState<Record<string, LiveCounter>>({});
  const [tables, setTables] = useState<Record<string, LiveTable>>({});
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const subscriptionsRef = useRef<Set<string>>(new Set());

  // WebSocket connection
  const { isConnected, sendMessage, lastMessage } = useWebSocket({
    url: process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws/live-data',
    onMessage: (message) => {
      handleLiveDataMessage(message);
    },
    onConnect: () => {
      // Subscribe to all channels
      [...chartChannels, ...counterChannels, ...tableChannels].forEach(channel => {
        subscribe(channel, 'chart');
      });
    }
  });

  const handleLiveDataMessage = useCallback((message: any) => {
    try {
      const { type, channel, data } = message;

      switch (type) {
        case 'chart_update':
          setCharts(prev => {
            const currentChart = prev[channel] || {
              id: channel,
              name: data.name || channel,
              data: [],
              color: data.color,
              type: data.type || 'line'
            };

            const newDataPoint: LiveDataPoint = {
              timestamp: new Date(data.timestamp || Date.now()),
              value: data.value,
              label: data.label
            };

            const updatedData = [...currentChart.data, newDataPoint]
              .slice(-maxDataPoints);

            return {
              ...prev,
              [channel]: {
                ...currentChart,
                data: updatedData
              }
            };
          });
          break;

        case 'counter_update':
          setCounters(prev => {
            const currentCounter = prev[channel];
            const newValue = data.value;
            const previousValue = currentCounter?.value;

            return {
              ...prev,
              [channel]: {
                id: channel,
                label: data.label || channel,
                value: newValue,
                previousValue,
                change: previousValue ? newValue - previousValue : 0,
                changeType: previousValue 
                  ? newValue > previousValue ? 'increase' : newValue < previousValue ? 'decrease' : 'neutral'
                  : 'neutral',
                format: data.format || 'number'
              }
            };
          });
          break;

        case 'table_update':
          setTables(prev => {
            const currentTable = prev[channel] || {
              id: channel,
              columns: data.columns || [],
              rows: [],
              maxRows: data.maxRows || 50
            };

            const newRow: LiveTableRow = {
              id: data.id || Math.random().toString(36).substr(2, 9),
              data: data.data,
              timestamp: new Date(data.timestamp || Date.now()),
              status: data.status || 'new'
            };

            const updatedRows = [newRow, ...currentTable.rows]
              .slice(0, currentTable.maxRows);

            return {
              ...prev,
              [channel]: {
                ...currentTable,
                rows: updatedRows
              }
            };
          });
          break;

        default:
          console.log('Unknown live data message type:', type);
      }

      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error handling live data message:', err);
      setError('Có lỗi xảy ra khi xử lý dữ liệu real-time');
    }
  }, [maxDataPoints]);

  const subscribe = useCallback((channel: string, type: 'chart' | 'counter' | 'table') => {
    if (subscriptionsRef.current.has(channel)) return;

    subscriptionsRef.current.add(channel);
    sendMessage({
      type: 'subscribe',
      channel,
      dataType: type
    });
  }, [sendMessage]);

  const unsubscribe = useCallback((channel: string) => {
    subscriptionsRef.current.delete(channel);
    sendMessage({
      type: 'unsubscribe',
      channel
    });
  }, [sendMessage]);

  const clearData = useCallback((channel: string) => {
    setCharts(prev => {
      const updated = { ...prev };
      delete updated[channel];
      return updated;
    });
    setCounters(prev => {
      const updated = { ...prev };
      delete updated[channel];
      return updated;
    });
    setTables(prev => {
      const updated = { ...prev };
      delete updated[channel];
      return updated;
    });
  }, []);

  // Auto-subscribe to channels on mount
  useEffect(() => {
    chartChannels.forEach(channel => subscribe(channel, 'chart'));
    counterChannels.forEach(channel => subscribe(channel, 'counter'));
    tableChannels.forEach(channel => subscribe(channel, 'table'));
  }, [chartChannels, counterChannels, tableChannels, subscribe]);

  // Cleanup subscriptions on unmount
  useEffect(() => {
    return () => {
      subscriptionsRef.current.forEach(channel => {
        unsubscribe(channel);
      });
    };
  }, [unsubscribe]);

  return {
    charts,
    counters,
    tables,
    isConnected,
    lastUpdate,
    error,
    subscribe,
    unsubscribe,
    clearData
  };
};
