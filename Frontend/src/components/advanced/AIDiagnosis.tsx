import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  FileText,
  Stethoscope
} from 'lucide-react';

interface Symptom {
  id: string;
  name: string;
  severity: number;
  duration: string;
  notes?: string;
}

interface Diagnosis {
  id: string;
  condition: string;
  confidence: number;
  probability: number;
  symptoms: string[];
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high';
}

interface DiagnosisHistory {
  id: string;
  date: string;
  symptoms: Symptom[];
  diagnosis: Diagnosis[];
  finalDiagnosis?: string;
  doctorNotes?: string;
}

const AIDiagnosis: React.FC = () => {
  const [currentSymptoms, setCurrentSymptoms] = useState<Symptom[]>([]);
  const [symptomInput, setSymptomInput] = useState('');
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<Diagnosis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisHistory, setDiagnosisHistory] = useState<DiagnosisHistory[]>([
    {
      id: '1',
      date: '2024-01-15',
      symptoms: [
        { id: '1', name: 'Sốt cao', severity: 8, duration: '3 ngày', notes: 'Sốt 39°C' },
        { id: '2', name: 'Đau đầu', severity: 6, duration: '2 ngày' }
      ],
      diagnosis: [
        {
          id: '1',
          condition: 'Cúm A',
          confidence: 85,
          probability: 75,
          symptoms: ['Sốt cao', 'Đau đầu'],
          recommendations: ['Nghỉ ngơi', 'Uống nhiều nước', 'Thuốc hạ sốt'],
          urgency: 'medium'
        }
      ],
      finalDiagnosis: 'Cúm A',
      doctorNotes: 'Bệnh nhân cần nghỉ ngơi và theo dõi'
    }
  ]);

  const addSymptom = () => {
    if (symptomInput.trim()) {
      const newSymptom: Symptom = {
        id: Date.now().toString(),
        name: symptomInput,
        severity,
        duration,
        notes
      };
      setCurrentSymptoms([...currentSymptoms, newSymptom]);
      setSymptomInput('');
      setSeverity(5);
      setDuration('');
      setNotes('');
    }
  };

  const removeSymptom = (id: string) => {
    setCurrentSymptoms(currentSymptoms.filter(s => s.id !== id));
  };

  const analyzeSymptoms = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockSuggestions: Diagnosis[] = [
        {
          id: '1',
          condition: 'Cảm cúm thông thường',
          confidence: 78,
          probability: 65,
          symptoms: currentSymptoms.map(s => s.name),
          recommendations: [
            'Nghỉ ngơi đầy đủ',
            'Uống nhiều nước',
            'Sử dụng thuốc giảm đau nếu cần',
            'Theo dõi nhiệt độ cơ thể'
          ],
          urgency: 'low'
        },
        {
          id: '2',
          condition: 'Viêm họng cấp',
          confidence: 65,
          probability: 45,
          symptoms: currentSymptoms.map(s => s.name),
          recommendations: [
            'Súc miệng nước muối',
            'Uống nước ấm',
            'Tránh đồ lạnh',
            'Khám bác sĩ nếu không cải thiện'
          ],
          urgency: 'medium'
        }
      ];
      
      setAiSuggestions(mockSuggestions);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">Nhập triệu chứng</TabsTrigger>
          <TabsTrigger value="analysis">Phân tích AI</TabsTrigger>
          <TabsTrigger value="history">Lịch sử chẩn đoán</TabsTrigger>
        </TabsList>

        {/* Symptom Input Tab */}
        <TabsContent value="input" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-blue-500" />
                Nhập triệu chứng
              </CardTitle>
              <CardDescription>
                Mô tả chi tiết các triệu chứng để AI có thể đưa ra gợi ý chẩn đoán chính xác
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Triệu chứng</label>
                  <Input
                    placeholder="Ví dụ: Sốt cao, đau đầu, ho khan..."
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mức độ nghiêm trọng: {severity}/10</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={severity}
                    onChange={(e) => setSeverity(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Thời gian</label>
                  <Input
                    placeholder="Ví dụ: 2 ngày, 1 tuần..."
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ghi chú thêm</label>
                  <Input
                    placeholder="Thông tin bổ sung..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={addSymptom} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Thêm triệu chứng
              </Button>
            </CardContent>
          </Card>

          {/* Current Symptoms List */}
          {currentSymptoms.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Triệu chứng hiện tại</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentSymptoms.map((symptom) => (
                    <div key={symptom.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{symptom.name}</div>
                        <div className="text-sm text-gray-600">
                          Mức độ: {symptom.severity}/10 | Thời gian: {symptom.duration}
                          {symptom.notes && ` | ${symptom.notes}`}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSymptom(symptom.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <Button 
                    onClick={analyzeSymptoms} 
                    disabled={isAnalyzing}
                    className="w-full"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        AI đang phân tích...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Phân tích với AI
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          {aiSuggestions.length > 0 ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    Gợi ý chẩn đoán từ AI
                  </CardTitle>
                  <CardDescription>
                    Dựa trên các triệu chứng đã nhập, AI đưa ra các khả năng chẩn đoán
                  </CardDescription>
                </CardHeader>
              </Card>

              {aiSuggestions.map((suggestion) => (
                <Card key={suggestion.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{suggestion.condition}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getUrgencyColor(suggestion.urgency)}>
                          {getUrgencyLabel(suggestion.urgency)}
                        </Badge>
                        <Badge variant="outline">
                          {suggestion.confidence}% tin cậy
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-2">Độ tin cậy</div>
                        <Progress value={suggestion.confidence} className="h-2" />
                        <div className="text-xs text-gray-600 mt-1">{suggestion.confidence}%</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">Xác suất</div>
                        <Progress value={suggestion.probability} className="h-2" />
                        <div className="text-xs text-gray-600 mt-1">{suggestion.probability}%</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Triệu chứng liên quan</div>
                      <div className="flex flex-wrap gap-1">
                        {suggestion.symptoms.map((symptom, index) => (
                          <Badge key={index} variant="secondary">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Khuyến nghị</div>
                      <ul className="space-y-1">
                        {suggestion.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Chưa có phân tích</h3>
                <p className="text-gray-600">
                  Vui lòng nhập triệu chứng và thực hiện phân tích AI
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Diagnosis History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                Lịch sử chẩn đoán
              </CardTitle>
              <CardDescription>
                Xem lại các lần chẩn đoán trước đó và kết quả
              </CardDescription>
            </CardHeader>
          </Card>

          {diagnosisHistory.length > 0 ? (
            <div className="space-y-4">
              {diagnosisHistory.map((history) => (
                <Card key={history.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {history.finalDiagnosis || 'Chẩn đoán chưa hoàn thành'}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{history.date}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Triệu chứng</div>
                      <div className="flex flex-wrap gap-1">
                        {history.symptoms.map((symptom) => (
                          <Badge key={symptom.id} variant="outline">
                            {symptom.name} ({symptom.severity}/10)
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {history.diagnosis.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">Gợi ý AI</div>
                        <div className="space-y-2">
                          {history.diagnosis.map((diag) => (
                            <div key={diag.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span>{diag.condition}</span>
                              <Badge variant="outline">{diag.confidence}%</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {history.doctorNotes && (
                      <div>
                        <div className="text-sm font-medium mb-2">Ghi chú bác sĩ</div>
                        <p className="text-sm text-gray-600">{history.doctorNotes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Chưa có lịch sử</h3>
                <p className="text-gray-600">
                  Lịch sử chẩn đoán sẽ được lưu tự động sau mỗi lần phân tích
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIDiagnosis;
