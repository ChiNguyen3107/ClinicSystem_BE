import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Cpu, 
  Wifi, 
  WifiOff, 
  Battery, 
  BatteryLow, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Activity,
  Settings,
  RefreshCw,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';

interface IoTDevice {
  id: string;
  name: string;
  type: 'blood_pressure' | 'glucose_meter' | 'thermometer' | 'pulse_oximeter' | 'weight_scale' | 'ecg_monitor';
  status: 'online' | 'offline' | 'error' | 'maintenance';
  batteryLevel: number;
  lastSync: Date;
  location: string;
  patientId?: string;
  patientName?: string;
  dataPoints: number;
  alerts: number;
  firmware: string;
  signalStrength: number;
}

interface DeviceData {
  deviceId: string;
  timestamp: Date;
  value: number;
  unit: string;
  type: string;
  isAnomaly: boolean;
}

const DeviceList: React.FC = () => {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  // Mock data
  useEffect(() => {
    const mockDevices: IoTDevice[] = [
      {
        id: 'device-001',
        name: 'Máy đo huyết áp Omron',
        type: 'blood_pressure',
        status: 'online',
        batteryLevel: 85,
        lastSync: new Date(Date.now() - 5 * 60 * 1000),
        location: 'Phòng khám A',
        patientId: 'patient-001',
        patientName: 'Nguyễn Văn A',
        dataPoints: 156,
        alerts: 2,
        firmware: 'v2.1.3',
        signalStrength: 85
      },
      {
        id: 'device-002',
        name: 'Máy đo đường huyết Accu-Chek',
        type: 'glucose_meter',
        status: 'online',
        batteryLevel: 45,
        lastSync: new Date(Date.now() - 2 * 60 * 1000),
        location: 'Phòng khám B',
        patientId: 'patient-002',
        patientName: 'Trần Thị B',
        dataPoints: 89,
        alerts: 0,
        firmware: 'v1.8.2',
        signalStrength: 72
      },
      {
        id: 'device-003',
        name: 'Nhiệt kế điện tử Braun',
        type: 'thermometer',
        status: 'offline',
        batteryLevel: 15,
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
        location: 'Phòng khám C',
        patientId: 'patient-003',
        patientName: 'Lê Văn C',
        dataPoints: 23,
        alerts: 1,
        firmware: 'v1.5.1',
        signalStrength: 0
      },
      {
        id: 'device-004',
        name: 'Máy đo SpO2 Nonin',
        type: 'pulse_oximeter',
        status: 'error',
        batteryLevel: 90,
        lastSync: new Date(Date.now() - 30 * 60 * 1000),
        location: 'Phòng khám D',
        patientId: 'patient-004',
        patientName: 'Phạm Thị D',
        dataPoints: 67,
        alerts: 3,
        firmware: 'v3.0.1',
        signalStrength: 45
      },
      {
        id: 'device-005',
        name: 'Cân điện tử Tanita',
        type: 'weight_scale',
        status: 'maintenance',
        batteryLevel: 100,
        lastSync: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        location: 'Phòng khám E',
        patientId: 'patient-005',
        patientName: 'Hoàng Văn E',
        dataPoints: 45,
        alerts: 0,
        firmware: 'v2.3.0',
        signalStrength: 0
      },
      {
        id: 'device-006',
        name: 'Máy ECG Philips',
        type: 'ecg_monitor',
        status: 'online',
        batteryLevel: 78,
        lastSync: new Date(Date.now() - 1 * 60 * 1000),
        location: 'Phòng khám F',
        patientId: 'patient-006',
        patientName: 'Võ Thị F',
        dataPoints: 234,
        alerts: 1,
        firmware: 'v4.2.1',
        signalStrength: 92
      }
    ];

    setDevices(mockDevices);
  }, []);

  const getDeviceTypeLabel = (type: string) => {
    const labels = {
      blood_pressure: 'Huyết áp',
      glucose_meter: 'Đường huyết',
      thermometer: 'Nhiệt độ',
      pulse_oximeter: 'SpO2',
      weight_scale: 'Cân nặng',
      ecg_monitor: 'ECG'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      online: { variant: 'default' as const, label: 'Trực tuyến', icon: CheckCircle },
      offline: { variant: 'secondary' as const, label: 'Ngoại tuyến', icon: WifiOff },
      error: { variant: 'destructive' as const, label: 'Lỗi', icon: AlertTriangle },
      maintenance: { variant: 'outline' as const, label: 'Bảo trì', icon: Settings }
    };

    const config = variants[status as keyof typeof variants];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getBatteryIcon = (level: number) => {
    if (level > 50) return <Battery className="h-4 w-4 text-green-500" />;
    if (level > 20) return <Battery className="h-4 w-4 text-yellow-500" />;
    return <BatteryLow className="h-4 w-4 text-red-500" />;
  };

  const getSignalIcon = (strength: number) => {
    if (strength > 80) return <Wifi className="h-4 w-4 text-green-500" />;
    if (strength > 50) return <Wifi className="h-4 w-4 text-yellow-500" />;
    if (strength > 0) return <Wifi className="h-4 w-4 text-red-500" />;
    return <WifiOff className="h-4 w-4 text-gray-400" />;
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
    
    // Update last sync time
    setDevices(prev => prev.map(device => ({
      ...device,
      lastSync: new Date()
    })));
  };

  const handleSyncDevice = async (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, lastSync: new Date() }
        : device
    ));
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.patientName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || device.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const totalAlerts = devices.reduce((sum, d) => sum + d.alerts, 0);
  const lowBatteryDevices = devices.filter(d => d.batteryLevel < 20).length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Thiết bị trực tuyến</p>
                <p className="text-2xl font-bold">{onlineDevices}/{devices.length}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cảnh báo</p>
                <p className="text-2xl font-bold text-red-500">{totalAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pin yếu</p>
                <p className="text-2xl font-bold text-yellow-500">{lowBatteryDevices}</p>
              </div>
              <BatteryLow className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đồng bộ cuối</p>
                <p className="text-sm font-bold">
                  {Math.min(...devices.map(d => Date.now() - d.lastSync.getTime())) < 5 * 60 * 1000 
                    ? 'Vừa xong' 
                    : 'Cần đồng bộ'
                  }
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Danh sách thiết bị IoT
              </CardTitle>
              <CardDescription>
                Quản lý và giám sát các thiết bị y tế kết nối
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncAll}
                disabled={isSyncing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                Đồng bộ tất cả
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Xuất dữ liệu
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm thiết bị hoặc bệnh nhân..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                Tất cả
              </Button>
              <Button
                variant={filterStatus === 'online' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('online')}
              >
                Trực tuyến
              </Button>
              <Button
                variant={filterStatus === 'offline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('offline')}
              >
                Ngoại tuyến
              </Button>
              <Button
                variant={filterStatus === 'error' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('error')}
              >
                Lỗi
              </Button>
            </div>
          </div>

          {/* Devices Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thiết bị</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Pin</TableHead>
                  <TableHead>Tín hiệu</TableHead>
                  <TableHead>Bệnh nhân</TableHead>
                  <TableHead>Đồng bộ cuối</TableHead>
                  <TableHead>Cảnh báo</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-sm text-muted-foreground">{device.location}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getDeviceTypeLabel(device.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(device.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getBatteryIcon(device.batteryLevel)}
                        <span className="text-sm">{device.batteryLevel}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getSignalIcon(device.signalStrength)}
                        <span className="text-sm">{device.signalStrength}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {device.patientName ? (
                        <div>
                          <p className="font-medium">{device.patientName}</p>
                          <p className="text-sm text-muted-foreground">ID: {device.patientId}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Chưa gán</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {Math.floor((Date.now() - device.lastSync.getTime()) / 60000)} phút trước
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {device.alerts > 0 ? (
                        <Badge variant="destructive">{device.alerts}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSyncDevice(device.id)}
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedDevice(
                            selectedDevice === device.id ? null : device.id
                          )}
                        >
                          {selectedDevice === device.id ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Device Details */}
      {selectedDevice && (
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết thiết bị</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Firmware</p>
                <p className="text-lg font-semibold">
                  {devices.find(d => d.id === selectedDevice)?.firmware}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Điểm dữ liệu</p>
                <p className="text-lg font-semibold">
                  {devices.find(d => d.id === selectedDevice)?.dataPoints}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cảnh báo</p>
                <p className="text-lg font-semibold text-red-500">
                  {devices.find(d => d.id === selectedDevice)?.alerts}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tín hiệu</p>
                <p className="text-lg font-semibold">
                  {devices.find(d => d.id === selectedDevice)?.signalStrength}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { DeviceList };
