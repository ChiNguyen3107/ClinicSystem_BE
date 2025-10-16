import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Stethoscope, 
  Pill, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  diagnosis?: {
    confidence: number;
    conditions: Array<{
      name: string;
      probability: number;
      symptoms: string[];
    }>;
  };
  medication?: {
    name: string;
    dosage: string;
    interactions: string[];
  };
}

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Xin chào! Tôi là AI Assistant của phòng khám. Tôi có thể giúp bạn gợi ý chẩn đoán, tư vấn thuốc và lịch hẹn thông minh.',
      timestamp: new Date(),
      suggestions: [
        'Phân tích triệu chứng',
        'Gợi ý chẩn đoán',
        'Tư vấn thuốc',
        'Lịch hẹn thông minh'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { icon: Stethoscope, label: 'Phân tích triệu chứng', prompt: 'Bệnh nhân có triệu chứng: ' },
    { icon: Pill, label: 'Tư vấn thuốc', prompt: 'Tư vấn thuốc cho bệnh: ' },
    { icon: Calendar, label: 'Lịch hẹn thông minh', prompt: 'Lịch hẹn phù hợp cho: ' },
    { icon: Sparkles, label: 'Gợi ý chẩn đoán', prompt: 'Gợi ý chẩn đoán cho: ' }
  ];

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(content);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): Message => {
    const responses = [
      {
        content: 'Dựa trên triệu chứng bạn mô tả, tôi gợi ý các khả năng sau:',
        diagnosis: {
          confidence: 0.85,
          conditions: [
            {
              name: 'Cảm cúm thông thường',
              probability: 0.7,
              symptoms: ['Sốt', 'Ho', 'Nghẹt mũi']
            },
            {
              name: 'Viêm họng',
              probability: 0.6,
              symptoms: ['Đau họng', 'Khó nuốt', 'Sốt nhẹ']
            }
          ]
        }
      },
      {
        content: 'Đây là gợi ý thuốc phù hợp:',
        medication: {
          name: 'Paracetamol 500mg',
          dosage: '2 viên/ngày, sau ăn',
          interactions: ['Không dùng chung với rượu', 'Thận trọng với bệnh gan']
        }
      },
      {
        content: 'Tôi đã phân tích và đưa ra gợi ý chẩn đoán dựa trên triệu chứng.',
        suggestions: [
          'Xem chi tiết chẩn đoán',
          'Tư vấn thuốc',
          'Đặt lịch hẹn',
          'Hỏi thêm thông tin'
        ]
      }
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: randomResponse.content,
      timestamp: new Date(),
      ...randomResponse
    };
  };

  const handleQuickAction = (prompt: string) => {
    setInputValue(prompt);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 h-auto p-3"
            onClick={() => handleQuickAction(action.prompt)}
          >
            <action.icon className="h-4 w-4" />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Chat Interface */}
      <Card className="h-96">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm">AI Assistant</CardTitle>
              <CardDescription className="text-xs">
                {isTyping ? 'Đang suy nghĩ...' : 'Sẵn sàng hỗ trợ'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea ref={scrollAreaRef} className="h-64 px-4">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[80%] space-y-2 ${
                      message.type === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : message.type === 'system'
                          ? 'bg-muted'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>

                    {/* Diagnosis Results */}
                    {message.diagnosis && (
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Stethoscope className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Gợi ý chẩn đoán</span>
                            <Badge variant="secondary">
                              {Math.round(message.diagnosis.confidence * 100)}% tin cậy
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {message.diagnosis.conditions.map((condition, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-sm">{condition.name}</span>
                                <Badge variant="outline">
                                  {Math.round(condition.probability * 100)}%
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Medication Advice */}
                    {message.medication && (
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Pill className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Tư vấn thuốc</span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm">
                              <strong>{message.medication.name}</strong>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Liều dùng: {message.medication.dosage}
                            </p>
                            {message.medication.interactions.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-orange-600">
                                  Lưu ý tương tác:
                                </p>
                                <ul className="text-xs text-muted-foreground">
                                  {message.medication.interactions.map((interaction, idx) => (
                                    <li key={idx}>• {interaction}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => handleSendMessage(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        AI đang suy nghĩ...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator />

          {/* Input Area */}
          <div className="p-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập câu hỏi hoặc triệu chứng..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                disabled={isTyping}
              />
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ChatPanel };
