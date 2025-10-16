import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Pill, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  Shield,
  Clock,
  FileText,
  Database
} from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
}

interface Interaction {
  id: string;
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  description: string;
  mechanism: string;
  clinicalEffects: string[];
  management: string[];
  alternatives: string[];
}

interface DrugInteraction {
  medication1: string;
  medication2: string;
  interaction: Interaction;
  riskLevel: number;
}

const MedicationInteractions: React.FC = () => {
  const [currentMedications, setCurrentMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Paracetamol',
      genericName: 'Acetaminophen',
      dosage: '500mg',
      frequency: '3 lần/ngày',
      startDate: '2024-01-10'
    },
    {
      id: '2',
      name: 'Ibuprofen',
      genericName: 'Ibuprofen',
      dosage: '400mg',
      frequency: '2 lần/ngày',
      startDate: '2024-01-12'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<DrugInteraction[]>([
    {
      medication1: 'Paracetamol',
      medication2: 'Warfarin',
      riskLevel: 8,
      interaction: {
        id: '1',
        severity: 'major',
        description: 'Tăng nguy cơ chảy máu',
        mechanism: 'Paracetamol có thể ức chế chuyển hóa Warfarin',
        clinicalEffects: [
          'Tăng thời gian prothrombin',
          'Nguy cơ chảy máu tăng',
          'Cần theo dõi INR thường xuyên'
        ],
        management: [
          'Theo dõi INR mỗi tuần',
          'Điều chỉnh liều Warfarin nếu cần',
          'Báo cáo bác sĩ ngay khi có dấu hiệu chảy máu'
        ],
        alternatives: [
          'Aspirin liều thấp',
          'Clopidogrel',
          'Dabigatran'
        ]
      }
    }
  ]);

  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: ''
  });

  const addMedication = () => {
    if (newMedication.name.trim()) {
      const medication: Medication = {
        id: Date.now().toString(),
        name: newMedication.name,
        genericName: newMedication.name, // Simplified
        dosage: newMedication.dosage,
        frequency: newMedication.frequency,
        startDate: newMedication.startDate
      };
      setCurrentMedications([...currentMedications, medication]);
      setNewMedication({ name: '', dosage: '', frequency: '', startDate: '' });
      checkInteractions();
    }
  };

  const removeMedication = (id: string) => {
    setCurrentMedications(currentMedications.filter(m => m.id !== id));
    checkInteractions();
  };

  const searchMedications = () => {
    // Mock search results
    const mockResults = [
      { id: '1', name: 'Aspirin', genericName: 'Acetylsalicylic acid', category: 'NSAID' },
      { id: '2', name: 'Warfarin', genericName: 'Warfarin sodium', category: 'Anticoagulant' },
      { id: '3', name: 'Metformin', genericName: 'Metformin HCl', category: 'Antidiabetic' },
      { id: '4', name: 'Lisinopril', genericName: 'Lisinopril', category: 'ACE Inhibitor' }
    ];
    setSearchResults(mockResults.filter(med => 
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  };

  const checkInteractions = () => {
    // Mock interaction checking
    const newInteractions: DrugInteraction[] = [];
    
    for (let i = 0; i < currentMedications.length; i++) {
      for (let j = i + 1; j < currentMedications.length; j++) {
        const med1 = currentMedications[i];
        const med2 = currentMedications[j];
        
        // Check for known interactions
        if ((med1.name === 'Paracetamol' && med2.name === 'Warfarin') ||
            (med1.name === 'Warfarin' && med2.name === 'Paracetamol')) {
          newInteractions.push({
            medication1: med1.name,
            medication2: med2.name,
            riskLevel: 8,
            interaction: {
              id: Date.now().toString(),
              severity: 'major',
              description: 'Tăng nguy cơ chảy máu',
              mechanism: 'Tương tác dược động học',
              clinicalEffects: ['Tăng thời gian đông máu', 'Nguy cơ chảy máu'],
              management: ['Theo dõi INR', 'Điều chỉnh liều'],
              alternatives: ['Aspirin', 'Clopidogrel']
            }
          });
        }
      }
    }
    
    setInteractions(newInteractions);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'contraindicated': return 'bg-red-100 text-red-800 border-red-200';
      case 'major': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'minor': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'contraindicated': return 'Chống chỉ định';
      case 'major': return 'Nghiêm trọng';
      case 'moderate': return 'Trung bình';
      case 'minor': return 'Nhẹ';
      default: return 'Không xác định';
    }
  };

  const getRiskLevel = (level: number) => {
    if (level >= 8) return { color: 'text-red-600', label: 'Cao' };
    if (level >= 5) return { color: 'text-orange-600', label: 'Trung bình' };
    if (level >= 3) return { color: 'text-yellow-600', label: 'Thấp' };
    return { color: 'text-green-600', label: 'Rất thấp' };
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="medications" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="medications">Thuốc hiện tại</TabsTrigger>
          <TabsTrigger value="checker">Kiểm tra tương tác</TabsTrigger>
          <TabsTrigger value="database">Cơ sở dữ liệu</TabsTrigger>
          <TabsTrigger value="alerts">Cảnh báo</TabsTrigger>
        </TabsList>

        {/* Current Medications Tab */}
        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-blue-500" />
                Danh sách thuốc hiện tại
              </CardTitle>
              <CardDescription>
                Quản lý danh sách thuốc bệnh nhân đang sử dụng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Medication */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50">
                <Input
                  placeholder="Tên thuốc"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                />
                <Input
                  placeholder="Liều lượng"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                />
                <Input
                  placeholder="Tần suất"
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                />
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={newMedication.startDate}
                    onChange={(e) => setNewMedication({...newMedication, startDate: e.target.value})}
                  />
                  <Button onClick={addMedication} size="sm">
                    <Pill className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Current Medications List */}
              <div className="space-y-2">
                {currentMedications.map((medication) => (
                  <div key={medication.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{medication.name}</div>
                      <div className="text-sm text-gray-600">
                        {medication.dosage} - {medication.frequency} | Bắt đầu: {medication.startDate}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedication(medication.id)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interaction Checker Tab */}
        <TabsContent value="checker" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-500" />
                Kiểm tra tương tác thuốc
              </CardTitle>
              <CardDescription>
                Phân tích tương tác giữa các thuốc trong danh sách
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button onClick={checkInteractions} className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Kiểm tra tương tác
                </Button>
              </div>

              {interactions.length > 0 ? (
                <div className="space-y-4">
                  {interactions.map((interaction, index) => (
                    <Alert key={index} className="border-l-4 border-l-orange-500">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {interaction.medication1} + {interaction.medication2}
                            </span>
                            <Badge className={getSeverityColor(interaction.interaction.severity)}>
                              {getSeverityLabel(interaction.interaction.severity)}
                            </Badge>
                            <Badge variant="outline" className={getRiskLevel(interaction.riskLevel).color}>
                              Rủi ro: {getRiskLevel(interaction.riskLevel).label}
                            </Badge>
                          </div>
                          <p className="text-sm">{interaction.interaction.description}</p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Không có tương tác</h3>
                  <p className="text-gray-600">
                    Không phát hiện tương tác nghiêm trọng giữa các thuốc
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Interaction Analysis */}
          {interactions.length > 0 && (
            <div className="space-y-4">
              {interactions.map((interaction, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {interaction.medication1} + {interaction.medication2}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Cơ chế tương tác</div>
                      <p className="text-sm text-gray-600">{interaction.interaction.mechanism}</p>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Tác dụng lâm sàng</div>
                      <ul className="space-y-1">
                        {interaction.interaction.clinicalEffects.map((effect, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            {effect}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Quản lý</div>
                      <ul className="space-y-1">
                        {interaction.interaction.management.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Thuốc thay thế</div>
                      <div className="flex flex-wrap gap-1">
                        {interaction.interaction.alternatives.map((alt, idx) => (
                          <Badge key={idx} variant="secondary">
                            {alt}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Database Tab */}
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-500" />
                Cơ sở dữ liệu thuốc
              </CardTitle>
              <CardDescription>
                Tìm kiếm thông tin thuốc và tương tác
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Tìm kiếm thuốc..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={searchMedications}>
                  <Search className="h-4 w-4 mr-2" />
                  Tìm kiếm
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{result.name}</div>
                        <div className="text-sm text-gray-600">
                          {result.genericName} - {result.category}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Thêm
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Cảnh báo tương tác
              </CardTitle>
              <CardDescription>
                Các cảnh báo quan trọng về tương tác thuốc
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription>
                    <div className="font-medium text-red-800">Cảnh báo nghiêm trọng</div>
                    <p className="text-red-700">
                      Phát hiện tương tác nguy hiểm giữa Paracetamol và Warfarin. 
                      Cần theo dõi INR và điều chỉnh liều.
                    </p>
                  </AlertDescription>
                </Alert>

                <Alert className="border-yellow-200 bg-yellow-50">
                  <Info className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    <div className="font-medium text-yellow-800">Lưu ý</div>
                    <p className="text-yellow-700">
                      Một số thuốc có thể cần điều chỉnh liều khi sử dụng cùng nhau.
                    </p>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationInteractions;
