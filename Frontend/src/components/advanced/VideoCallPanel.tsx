import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Share, 
  Monitor,
  FileText,
  Camera,
  Settings,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface CallParticipant {
  id: string;
  name: string;
  role: 'doctor' | 'patient' | 'nurse';
  isVideoOn: boolean;
  isAudioOn: boolean;
  isSharing: boolean;
  avatar?: string;
}

interface CallSession {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  startTime: Date;
  duration: number;
  status: 'waiting' | 'active' | 'ended';
  participants: CallParticipant[];
}

const VideoCallPanel: React.FC = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [currentSession, setCurrentSession] = useState<CallSession | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);

  // Mock participants
  const mockParticipants: CallParticipant[] = [
    {
      id: '1',
      name: 'Dr. Nguyễn Văn A',
      role: 'doctor',
      isVideoOn: true,
      isAudioOn: true,
      isSharing: false,
      avatar: '/avatars/doctor1.jpg'
    },
    {
      id: '2',
      name: 'Bệnh nhân Trần Thị B',
      role: 'patient',
      isVideoOn: true,
      isAudioOn: true,
      isSharing: false
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    setIsInCall(true);
    setCurrentSession({
      id: 'call-001',
      patientId: 'patient-001',
      patientName: 'Trần Thị B',
      doctorId: 'doctor-001',
      doctorName: 'Dr. Nguyễn Văn A',
      startTime: new Date(),
      duration: 0,
      status: 'active',
      participants: mockParticipants
    });
  };

  const handleEndCall = () => {
    setIsInCall(false);
    setIsVideoOn(false);
    setIsAudioOn(false);
    setIsSharing(false);
    setCallDuration(0);
    setCurrentSession(null);
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const handleToggleAudio = () => {
    setIsAudioOn(!isAudioOn);
  };

  const handleToggleShare = () => {
    setIsSharing(!isSharing);
  };

  const upcomingCalls = [
    {
      id: '1',
      patientName: 'Nguyễn Thị C',
      doctorName: 'Dr. Lê Văn D',
      scheduledTime: '14:30',
      duration: 30,
      type: 'Follow-up'
    },
    {
      id: '2',
      patientName: 'Phạm Văn E',
      doctorName: 'Dr. Trần Thị F',
      scheduledTime: '15:00',
      duration: 45,
      type: 'Consultation'
    }
  ];

  const recentCalls = [
    {
      id: '1',
      patientName: 'Hoàng Thị G',
      doctorName: 'Dr. Võ Văn H',
      duration: 25,
      status: 'completed',
      date: '2024-01-15'
    },
    {
      id: '2',
      patientName: 'Đặng Văn I',
      doctorName: 'Dr. Bùi Thị K',
      duration: 40,
      status: 'missed',
      date: '2024-01-14'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Current Call Status */}
      {isInCall && currentSession ? (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <CardTitle className="text-green-800">Cuộc gọi đang diễn ra</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {formatDuration(callDuration)}
              </Badge>
            </div>
            <CardDescription className="text-green-700">
              Bệnh nhân: {currentSession.patientName} | Bác sĩ: {currentSession.doctorName}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-500" />
              Telemedicine
            </CardTitle>
            <CardDescription>
              Khám từ xa với video call, chia sẻ màn hình và ePrescription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sẵn sàng khám từ xa</h3>
              <p className="text-muted-foreground mb-4">
                Bắt đầu cuộc gọi video với bệnh nhân
              </p>
              <Button onClick={handleStartCall} className="bg-green-600 hover:bg-green-700">
                <Video className="h-4 w-4 mr-2" />
                Bắt đầu cuộc gọi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Call Interface */}
      {isInCall && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Video Call</span>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-mono">{formatDuration(callDuration)}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Main Video */}
              <div className="relative bg-black rounded-lg aspect-video">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Avatar className="h-16 w-16 mx-auto mb-2">
                      <AvatarFallback>
                        <Video className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm">
                      {isVideoOn ? 'Video đang bật' : 'Video đã tắt'}
                    </p>
                  </div>
                </div>
                {!isVideoOn && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="destructive">
                      <VideoOff className="h-3 w-3 mr-1" />
                      Video tắt
                    </Badge>
                  </div>
                )}
              </div>

              {/* Secondary Video */}
              <div className="relative bg-gray-900 rounded-lg aspect-video">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Avatar className="h-12 w-12 mx-auto mb-2">
                      <AvatarFallback>B</AvatarFallback>
                    </Avatar>
                    <p className="text-xs">Bệnh nhân</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Screen Share */}
            {isSharing && (
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="h-4 w-4" />
                  <span className="text-sm font-medium">Đang chia sẻ màn hình</span>
                </div>
                <div className="bg-white rounded border-2 border-dashed border-gray-300 h-32 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Monitor className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Màn hình được chia sẻ</p>
                  </div>
                </div>
              </div>
            )}

            {/* Call Controls */}
            <div className="flex justify-center gap-2">
              <Button
                variant={isAudioOn ? "default" : "destructive"}
                size="sm"
                onClick={handleToggleAudio}
              >
                {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              <Button
                variant={isVideoOn ? "default" : "destructive"}
                size="sm"
                onClick={handleToggleVideo}
              >
                {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button
                variant={isSharing ? "default" : "outline"}
                size="sm"
                onClick={handleToggleShare}
              >
                <Share className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={handleEndCall}>
                <PhoneOff className="h-4 w-4" />
              </Button>
            </div>

            {/* Participants */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Người tham gia
              </h4>
              <div className="space-y-2">
                {mockParticipants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{participant.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {participant.role === 'doctor' ? 'Bác sĩ' : 'Bệnh nhân'}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      {participant.isVideoOn ? (
                        <Video className="h-3 w-3 text-green-500" />
                      ) : (
                        <VideoOff className="h-3 w-3 text-red-500" />
                      )}
                      {participant.isAudioOn ? (
                        <Mic className="h-3 w-3 text-green-500" />
                      ) : (
                        <MicOff className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Calls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Cuộc gọi sắp tới
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingCalls.map((call) => (
              <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{call.patientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{call.patientName}</p>
                    <p className="text-sm text-muted-foreground">{call.doctorName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{call.scheduledTime}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{call.type}</Badge>
                    <span className="text-sm text-muted-foreground">{call.duration} phút</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Calls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Cuộc gọi gần đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCalls.map((call) => (
              <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{call.patientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{call.patientName}</p>
                    <p className="text-sm text-muted-foreground">{call.doctorName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    {call.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">{formatDuration(call.duration)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{call.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ePrescription Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            ePrescription
          </CardTitle>
          <CardDescription>
            Tạo đơn thuốc điện tử trong cuộc gọi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Tạo đơn thuốc
            </Button>
            <Button variant="outline" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Chụp ảnh kết quả
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { VideoCallPanel };
