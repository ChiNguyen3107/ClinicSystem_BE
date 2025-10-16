import { http, HttpResponse } from 'msw';
import type { Patient, PatientListResponse, PatientDetail } from '@/types/patient';
import type { Doctor, DoctorListResponse, DoctorStats, CreateDoctorRequest } from '@/types/doctor';
import type { Schedule, WeeklySchedule } from '@/types/schedule';
import type { Appointment, AppointmentStatus, AppointmentStats } from '@/types/appointment';

// Mock data
const mockPatients: Patient[] = [
  {
    id: 1,
    code: 'BN001',
    name: 'Nguyễn Văn An',
    gender: 'MALE',
    dateOfBirth: '1990-05-15',
    phone: '0123456789',
    email: 'an.nguyen@email.com',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    note: 'Bệnh nhân có tiền sử dị ứng thuốc',
    status: 'ACTIVE',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
  },
  {
    id: 2,
    code: 'BN002',
    name: 'Trần Thị Bình',
    gender: 'FEMALE',
    dateOfBirth: '1985-12-03',
    phone: '0987654321',
    email: 'binh.tran@email.com',
    address: '456 Đường XYZ, Quận 2, TP.HCM',
    note: '',
    status: 'ACTIVE',
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
  },
  {
    id: 3,
    code: 'BN003',
    name: 'Lê Văn Cường',
    gender: 'MALE',
    dateOfBirth: '1992-08-20',
    phone: '0369258147',
    email: 'cuong.le@email.com',
    address: '789 Đường DEF, Quận 3, TP.HCM',
    note: 'Bệnh nhân cần theo dõi huyết áp',
    status: 'ACTIVE',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
  {
    id: 4,
    code: 'BN004',
    name: 'Phạm Thị Dung',
    gender: 'FEMALE',
    dateOfBirth: '1988-03-10',
    phone: '0741852963',
    email: 'dung.pham@email.com',
    address: '321 Đường GHI, Quận 4, TP.HCM',
    note: '',
    status: 'ACTIVE',
    createdAt: '2024-01-18T11:30:00Z',
    updatedAt: '2024-01-18T11:30:00Z',
  },
  {
    id: 5,
    code: 'BN005',
    name: 'Hoàng Văn Em',
    gender: 'MALE',
    dateOfBirth: '1995-11-25',
    phone: '0852741963',
    email: 'em.hoang@email.com',
    address: '654 Đường JKL, Quận 5, TP.HCM',
    note: 'Bệnh nhân có tiền sử bệnh tim',
    status: 'ACTIVE',
    createdAt: '2024-01-19T14:20:00Z',
    updatedAt: '2024-01-19T14:20:00Z',
  },
  {
    id: 6,
    code: 'BN006',
    name: 'Võ Thị Phương',
    gender: 'FEMALE',
    dateOfBirth: '1991-07-12',
    phone: '0963852741',
    email: 'phuong.vo@email.com',
    address: '987 Đường MNO, Quận 6, TP.HCM',
    note: '',
    status: 'ACTIVE',
    createdAt: '2024-01-20T15:45:00Z',
    updatedAt: '2024-01-20T15:45:00Z',
  },
  {
    id: 7,
    code: 'BN007',
    name: 'Đặng Văn Giang',
    gender: 'MALE',
    dateOfBirth: '1987-09-08',
    phone: '0147258369',
    email: 'giang.dang@email.com',
    address: '147 Đường PQR, Quận 7, TP.HCM',
    note: 'Bệnh nhân cần kiểm tra định kỳ',
    status: 'ACTIVE',
    createdAt: '2024-01-21T16:10:00Z',
    updatedAt: '2024-01-21T16:10:00Z',
  },
  {
    id: 8,
    code: 'BN008',
    name: 'Bùi Thị Hoa',
    gender: 'FEMALE',
    dateOfBirth: '1993-04-18',
    phone: '0638520741',
    email: 'hoa.bui@email.com',
    address: '258 Đường STU, Quận 8, TP.HCM',
    note: '',
    status: 'ACTIVE',
    createdAt: '2024-01-22T17:25:00Z',
    updatedAt: '2024-01-22T17:25:00Z',
  },
  {
    id: 9,
    code: 'BN009',
    name: 'Ngô Văn Ích',
    gender: 'MALE',
    dateOfBirth: '1989-01-30',
    phone: '0852741963',
    email: 'ich.ngo@email.com',
    address: '369 Đường VWX, Quận 9, TP.HCM',
    note: 'Bệnh nhân có tiền sử tiểu đường',
    status: 'ACTIVE',
    createdAt: '2024-01-23T18:40:00Z',
    updatedAt: '2024-01-23T18:40:00Z',
  },
  {
    id: 10,
    code: 'BN010',
    name: 'Lý Thị Kim',
    gender: 'FEMALE',
    dateOfBirth: '1994-06-14',
    phone: '0741852963',
    email: 'kim.ly@email.com',
    address: '741 Đường YZA, Quận 10, TP.HCM',
    note: '',
    status: 'ACTIVE',
    createdAt: '2024-01-24T19:55:00Z',
    updatedAt: '2024-01-24T19:55:00Z',
  },
  {
    id: 11,
    code: 'BN011',
    name: 'Đinh Văn Lâm',
    gender: 'MALE',
    dateOfBirth: '1986-10-22',
    phone: '0963852741',
    email: 'lam.dinh@email.com',
    address: '852 Đường BCD, Quận 11, TP.HCM',
    note: 'Bệnh nhân cần theo dõi cân nặng',
    status: 'ACTIVE',
    createdAt: '2024-01-25T20:15:00Z',
    updatedAt: '2024-01-25T20:15:00Z',
  },
  {
    id: 12,
    code: 'BN012',
    name: 'Tôn Thị Mai',
    gender: 'FEMALE',
    dateOfBirth: '1990-02-28',
    phone: '0147258369',
    email: 'mai.ton@email.com',
    address: '963 Đường EFG, Quận 12, TP.HCM',
    note: '',
    status: 'ACTIVE',
    createdAt: '2024-01-26T21:30:00Z',
    updatedAt: '2024-01-26T21:30:00Z',
  },
  {
    id: 13,
    code: 'BN013',
    name: 'Phan Văn Nam',
    gender: 'MALE',
    dateOfBirth: '1988-12-05',
    phone: '0638520741',
    email: 'nam.phan@email.com',
    address: '159 Đường HIJ, Quận Bình Thạnh, TP.HCM',
    note: 'Bệnh nhân có tiền sử dị ứng thực phẩm',
    status: 'ACTIVE',
    createdAt: '2024-01-27T22:45:00Z',
    updatedAt: '2024-01-27T22:45:00Z',
  },
  {
    id: 14,
    code: 'BN014',
    name: 'Vũ Thị Oanh',
    gender: 'FEMALE',
    dateOfBirth: '1992-05-17',
    phone: '0852741963',
    email: 'oanh.vu@email.com',
    address: '357 Đường KLM, Quận Tân Bình, TP.HCM',
    note: '',
    status: 'ACTIVE',
    createdAt: '2024-01-28T23:00:00Z',
    updatedAt: '2024-01-28T23:00:00Z',
  },
  {
    id: 15,
    code: 'BN015',
    name: 'Trịnh Văn Phúc',
    gender: 'MALE',
    dateOfBirth: '1987-08-09',
    phone: '0741852963',
    email: 'phuc.trinh@email.com',
    address: '468 Đường NOP, Quận Tân Phú, TP.HCM',
    note: 'Bệnh nhân cần kiểm tra tim mạch',
    status: 'ACTIVE',
    createdAt: '2024-01-29T08:15:00Z',
    updatedAt: '2024-01-29T08:15:00Z',
  },
  {
    id: 16,
    code: 'BN016',
    name: 'Hồ Thị Quỳnh',
    gender: 'FEMALE',
    dateOfBirth: '1991-11-13',
    phone: '0963852741',
    email: 'quynh.ho@email.com',
    address: '579 Đường QRS, Quận Phú Nhuận, TP.HCM',
    note: '',
    status: 'ACTIVE',
    createdAt: '2024-01-30T09:30:00Z',
    updatedAt: '2024-01-30T09:30:00Z',
  },
  {
    id: 17,
    code: 'BN017',
    name: 'Cao Văn Rồng',
    gender: 'MALE',
    dateOfBirth: '1989-03-26',
    phone: '0147258369',
    email: 'rong.cao@email.com',
    address: '680 Đường TUV, Quận Gò Vấp, TP.HCM',
    note: 'Bệnh nhân có tiền sử bệnh phổi',
    status: 'ACTIVE',
    createdAt: '2024-01-31T10:45:00Z',
    updatedAt: '2024-01-31T10:45:00Z',
  },
  {
    id: 18,
    code: 'BN018',
    name: 'Lưu Thị Sương',
    gender: 'FEMALE',
    dateOfBirth: '1993-09-04',
    phone: '0638520741',
    email: 'suong.luu@email.com',
    address: '791 Đường WXY, Quận Thủ Đức, TP.HCM',
    note: '',
    status: 'ACTIVE',
    createdAt: '2024-02-01T11:00:00Z',
    updatedAt: '2024-02-01T11:00:00Z',
  },
  {
    id: 19,
    code: 'BN019',
    name: 'Đỗ Văn Tài',
    gender: 'MALE',
    dateOfBirth: '1985-07-21',
    phone: '0852741963',
    email: 'tai.do@email.com',
    address: '802 Đường ZAB, Quận Bình Tân, TP.HCM',
    note: 'Bệnh nhân cần theo dõi huyết áp và đường huyết',
    status: 'ACTIVE',
    createdAt: '2024-02-02T12:15:00Z',
    updatedAt: '2024-02-02T12:15:00Z',
  },
  {
    id: 20,
    code: 'BN020',
    name: 'Chu Thị Uyên',
    gender: 'FEMALE',
    dateOfBirth: '1994-12-11',
    phone: '0741852963',
    email: 'uyen.chu@email.com',
    address: '913 Đường CDE, Quận Hóc Môn, TP.HCM',
    note: '',
    status: 'ACTIVE',
    createdAt: '2024-02-03T13:30:00Z',
    updatedAt: '2024-02-03T13:30:00Z',
  },
  {
    id: 21,
    code: 'BN021',
    name: 'Lương Văn Vinh',
    gender: 'MALE',
    dateOfBirth: '1990-04-07',
    phone: '0963852741',
    email: 'vinh.luong@email.com',
    address: '024 Đường FGH, Quận Củ Chi, TP.HCM',
    note: 'Bệnh nhân có tiền sử dị ứng thuốc kháng sinh',
    status: 'ACTIVE',
    createdAt: '2024-02-04T14:45:00Z',
    updatedAt: '2024-02-04T14:45:00Z',
  },
  {
    id: 22,
    code: 'BN022',
    name: 'Tạ Thị Xuân',
    gender: 'FEMALE',
    dateOfBirth: '1988-01-19',
    phone: '0147258369',
    email: 'xuan.ta@email.com',
    address: '135 Đường IJK, Quận Nhà Bè, TP.HCM',
    note: '',
    status: 'ACTIVE',
    createdAt: '2024-02-05T15:00:00Z',
    updatedAt: '2024-02-05T15:00:00Z',
  },
  {
    id: 23,
    code: 'BN023',
    name: 'Võ Văn Yên',
    gender: 'MALE',
    dateOfBirth: '1992-06-02',
    phone: '0638520741',
    email: 'yen.vo@email.com',
    address: '246 Đường LMN, Quận Cần Giờ, TP.HCM',
    note: 'Bệnh nhân cần kiểm tra thị lực',
    status: 'ACTIVE',
    createdAt: '2024-02-06T16:15:00Z',
    updatedAt: '2024-02-06T16:15:00Z',
  },
  {
    id: 24,
    code: 'BN024',
    name: 'Nguyễn Thị Zin',
    gender: 'FEMALE',
    dateOfBirth: '1991-10-16',
    phone: '0852741963',
    email: 'zin.nguyen@email.com',
    address: '357 Đường OPQ, Quận Bình Chánh, TP.HCM',
    note: '',
    status: 'ACTIVE',
    createdAt: '2024-02-07T17:30:00Z',
    updatedAt: '2024-02-07T17:30:00Z',
  },
  {
    id: 25,
    code: 'BN025',
    name: 'Phạm Văn Anh',
    gender: 'MALE',
    dateOfBirth: '1987-05-23',
    phone: '0741852963',
    email: 'anh.pham@email.com',
    address: '468 Đường RST, Quận Long An',
    note: 'Bệnh nhân có tiền sử bệnh gan',
    status: 'ACTIVE',
    createdAt: '2024-02-08T18:45:00Z',
    updatedAt: '2024-02-08T18:45:00Z',
  },
  {
    id: 26,
    code: 'BN026',
    name: 'Lê Thị Bích',
    gender: 'FEMALE',
    dateOfBirth: '1993-08-14',
    phone: '0963852741',
    email: 'bich.le@email.com',
    address: '579 Đường UVW, Quận Tiền Giang',
    note: '',
    status: 'ACTIVE',
    createdAt: '2024-02-09T19:00:00Z',
    updatedAt: '2024-02-09T19:00:00Z',
  },
  {
    id: 27,
    code: 'BN027',
    name: 'Trần Văn Cường',
    gender: 'MALE',
    dateOfBirth: '1989-12-01',
    phone: '0147258369',
    email: 'cuong.tran@email.com',
    address: '680 Đường XYZ, Quận Bến Tre',
    note: 'Bệnh nhân cần theo dõi cholesterol',
    status: 'ACTIVE',
    createdAt: '2024-02-10T20:15:00Z',
    updatedAt: '2024-02-10T20:15:00Z',
  },
  {
    id: 28,
    code: 'BN028',
    name: 'Hoàng Thị Dung',
    gender: 'FEMALE',
    dateOfBirth: '1990-03-18',
    phone: '0638520741',
    email: 'dung.hoang@email.com',
    address: '791 Đường ABC, Quận Vĩnh Long',
    note: '',
    status: 'ACTIVE',
    createdAt: '2024-02-11T21:30:00Z',
    updatedAt: '2024-02-11T21:30:00Z',
  },
  {
    id: 29,
    code: 'BN029',
    name: 'Vũ Văn Em',
    gender: 'MALE',
    dateOfBirth: '1986-11-09',
    phone: '0852741963',
    email: 'em.vu@email.com',
    address: '802 Đường DEF, Quận Đồng Tháp',
    note: 'Bệnh nhân có tiền sử bệnh thận',
    status: 'ACTIVE',
    createdAt: '2024-02-12T22:45:00Z',
    updatedAt: '2024-02-12T22:45:00Z',
  },
  {
    id: 30,
    code: 'BN030',
    name: 'Đặng Thị Phương',
    gender: 'FEMALE',
    dateOfBirth: '1994-07-25',
    phone: '0741852963',
    email: 'phuong.dang@email.com',
    address: '913 Đường GHI, Quận An Giang',
    note: '',
    status: 'ACTIVE',
    createdAt: '2024-02-13T23:00:00Z',
    updatedAt: '2024-02-13T23:00:00Z',
  },
];

// Mock doctors data
const mockDoctors: Doctor[] = [
  {
    id: '1',
    userId: 'user-1',
    fullName: 'BS. Nguyễn Văn Bác',
    email: 'bac.nguyen@clinic.com',
    phone: '0123456789',
    gender: 'MALE',
    dateOfBirth: '1980-05-15',
    specialty: 'Tim mạch',
    licenseNo: 'BS001',
    room: 'Phòng 101',
    bio: 'Bác sĩ chuyên khoa tim mạch với 15 năm kinh nghiệm',
    status: 'ACTIVE',
    avatar: '',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
  },
  {
    id: '2',
    userId: 'user-2',
    fullName: 'BS. Trần Thị Sĩ',
    email: 'si.tran@clinic.com',
    phone: '0987654321',
    gender: 'FEMALE',
    dateOfBirth: '1985-12-03',
    specialty: 'Nhi khoa',
    licenseNo: 'BS002',
    room: 'Phòng 102',
    bio: 'Bác sĩ nhi khoa chuyên điều trị các bệnh lý ở trẻ em',
    status: 'ACTIVE',
    avatar: '',
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
  },
  {
    id: '3',
    userId: 'user-3',
    fullName: 'BS. Lê Văn Cường',
    email: 'cuong.le@clinic.com',
    phone: '0369258147',
    gender: 'MALE',
    dateOfBirth: '1975-08-20',
    specialty: 'Ngoại khoa',
    licenseNo: 'BS003',
    room: 'Phòng 103',
    bio: 'Bác sĩ ngoại khoa với chuyên môn cao trong phẫu thuật',
    status: 'ACTIVE',
    avatar: '',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
  {
    id: '4',
    userId: 'user-4',
    fullName: 'BS. Phạm Thị Dung',
    email: 'dung.pham@clinic.com',
    phone: '0741852963',
    gender: 'FEMALE',
    dateOfBirth: '1982-03-10',
    specialty: 'Sản phụ khoa',
    licenseNo: 'BS004',
    room: 'Phòng 104',
    bio: 'Bác sĩ sản phụ khoa chuyên chăm sóc sức khỏe phụ nữ',
    status: 'ACTIVE',
    avatar: '',
    createdAt: '2024-01-18T11:30:00Z',
    updatedAt: '2024-01-18T11:30:00Z',
  },
  {
    id: '5',
    userId: 'user-5',
    fullName: 'BS. Hoàng Văn Em',
    email: 'em.hoang@clinic.com',
    phone: '0852741963',
    gender: 'MALE',
    dateOfBirth: '1978-11-25',
    specialty: 'Thần kinh',
    licenseNo: 'BS005',
    room: 'Phòng 105',
    bio: 'Bác sĩ thần kinh chuyên điều trị các bệnh lý não bộ',
    status: 'INACTIVE',
    avatar: '',
    createdAt: '2024-01-19T14:20:00Z',
    updatedAt: '2024-01-19T14:20:00Z',
  },
];

// Mock schedules data
const mockSchedules: Schedule[] = [
  {
    id: '1',
    doctorId: '1',
    dayOfWeek: 1, // Monday
    startTime: '08:00',
    endTime: '12:00',
    room: 'Phòng 101',
    isActive: true,
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
  },
  {
    id: '2',
    doctorId: '1',
    dayOfWeek: 1, // Monday
    startTime: '14:00',
    endTime: '18:00',
    room: 'Phòng 101',
    isActive: true,
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
  },
  {
    id: '3',
    doctorId: '1',
    dayOfWeek: 3, // Wednesday
    startTime: '08:00',
    endTime: '12:00',
    room: 'Phòng 101',
    isActive: true,
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
  },
  {
    id: '4',
    doctorId: '2',
    dayOfWeek: 2, // Tuesday
    startTime: '08:00',
    endTime: '17:00',
    room: 'Phòng 102',
    isActive: true,
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
  },
  {
    id: '5',
    doctorId: '2',
    dayOfWeek: 4, // Thursday
    startTime: '08:00',
    endTime: '17:00',
    room: 'Phòng 102',
    isActive: true,
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
  },
];

// Mock appointments data
const mockAppointments: Appointment[] = [
  {
    id: '1',
    code: 'LH001',
    patientId: '1',
    patientName: 'Nguyễn Văn An',
    patientPhone: '0123456789',
    doctorId: '1',
    doctorName: 'BS. Nguyễn Văn Bác',
    doctorSpecialty: 'Tim mạch',
    roomId: '1',
    roomName: 'Phòng 101',
    appointmentDate: '2024-02-15',
    startTime: '09:00',
    endTime: '09:30',
    duration: 30,
    status: AppointmentStatus.CONFIRMED,
    reason: 'Khám tim mạch định kỳ',
    notes: 'Bệnh nhân có tiền sử huyết áp cao',
    createdAt: '2024-02-01T08:30:00Z',
    updatedAt: '2024-02-01T08:30:00Z',
  },
  {
    id: '2',
    code: 'LH002',
    patientId: '2',
    patientName: 'Trần Thị Bình',
    patientPhone: '0987654321',
    doctorId: '2',
    doctorName: 'BS. Trần Thị Sĩ',
    doctorSpecialty: 'Nhi khoa',
    roomId: '2',
    roomName: 'Phòng 102',
    appointmentDate: '2024-02-15',
    startTime: '10:00',
    endTime: '10:45',
    duration: 45,
    status: AppointmentStatus.PENDING,
    reason: 'Khám sức khỏe cho trẻ em',
    notes: '',
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z',
  },
  {
    id: '3',
    code: 'LH003',
    patientId: '3',
    patientName: 'Lê Văn Cường',
    patientPhone: '0369258147',
    doctorId: '3',
    doctorName: 'BS. Lê Văn Cường',
    doctorSpecialty: 'Ngoại khoa',
    roomId: '3',
    roomName: 'Phòng 103',
    appointmentDate: '2024-02-16',
    startTime: '14:00',
    endTime: '15:00',
    duration: 60,
    status: AppointmentStatus.COMPLETED,
    reason: 'Tư vấn phẫu thuật',
    notes: 'Bệnh nhân cần phẫu thuật nội soi',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
  {
    id: '4',
    code: 'LH004',
    patientId: '4',
    patientName: 'Phạm Thị Dung',
    patientPhone: '0741852963',
    doctorId: '4',
    doctorName: 'BS. Phạm Thị Dung',
    doctorSpecialty: 'Sản phụ khoa',
    roomId: '4',
    roomName: 'Phòng 104',
    appointmentDate: '2024-02-16',
    startTime: '08:30',
    endTime: '09:00',
    duration: 30,
    status: AppointmentStatus.CANCELLED,
    reason: 'Khám phụ khoa',
    notes: '',
    cancellationReason: 'Bệnh nhân hủy lịch do công việc',
    createdAt: '2024-02-01T11:30:00Z',
    updatedAt: '2024-02-01T11:30:00Z',
  },
  {
    id: '5',
    code: 'LH005',
    patientId: '5',
    patientName: 'Hoàng Văn Em',
    patientPhone: '0852741963',
    doctorId: '1',
    doctorName: 'BS. Nguyễn Văn Bác',
    doctorSpecialty: 'Tim mạch',
    roomId: '1',
    roomName: 'Phòng 101',
    appointmentDate: '2024-02-17',
    startTime: '11:00',
    endTime: '11:30',
    duration: 30,
    status: AppointmentStatus.NO_SHOW,
    reason: 'Khám tim mạch',
    notes: 'Bệnh nhân có tiền sử bệnh tim',
    createdAt: '2024-02-01T14:20:00Z',
    updatedAt: '2024-02-01T14:20:00Z',
  },
  {
    id: '6',
    code: 'LH006',
    patientId: '6',
    patientName: 'Võ Thị Phương',
    patientPhone: '0963852741',
    doctorId: '2',
    doctorName: 'BS. Trần Thị Sĩ',
    doctorSpecialty: 'Nhi khoa',
    roomId: '2',
    roomName: 'Phòng 102',
    appointmentDate: '2024-02-18',
    startTime: '15:00',
    endTime: '15:45',
    duration: 45,
    status: AppointmentStatus.CONFIRMED,
    reason: 'Tiêm chủng cho trẻ',
    notes: '',
    createdAt: '2024-02-01T15:45:00Z',
    updatedAt: '2024-02-01T15:45:00Z',
  },
  {
    id: '7',
    code: 'LH007',
    patientId: '7',
    patientName: 'Đặng Văn Giang',
    patientPhone: '0147258369',
    doctorId: '3',
    doctorName: 'BS. Lê Văn Cường',
    doctorSpecialty: 'Ngoại khoa',
    roomId: '3',
    roomName: 'Phòng 103',
    appointmentDate: '2024-02-19',
    startTime: '09:30',
    endTime: '10:30',
    duration: 60,
    status: AppointmentStatus.PENDING,
    reason: 'Khám ngoại khoa',
    notes: 'Bệnh nhân cần kiểm tra định kỳ',
    createdAt: '2024-02-01T16:10:00Z',
    updatedAt: '2024-02-01T16:10:00Z',
  },
  {
    id: '8',
    code: 'LH008',
    patientId: '8',
    patientName: 'Bùi Thị Hoa',
    patientPhone: '0638520741',
    doctorId: '4',
    doctorName: 'BS. Phạm Thị Dung',
    doctorSpecialty: 'Sản phụ khoa',
    roomId: '4',
    roomName: 'Phòng 104',
    appointmentDate: '2024-02-20',
    startTime: '13:00',
    endTime: '13:30',
    duration: 30,
    status: AppointmentStatus.CONFIRMED,
    reason: 'Khám sản phụ khoa',
    notes: '',
    createdAt: '2024-02-01T17:25:00Z',
    updatedAt: '2024-02-01T17:25:00Z',
  },
  {
    id: '9',
    code: 'LH009',
    patientId: '9',
    patientName: 'Ngô Văn Ích',
    patientPhone: '0852741963',
    doctorId: '1',
    doctorName: 'BS. Nguyễn Văn Bác',
    doctorSpecialty: 'Tim mạch',
    roomId: '1',
    roomName: 'Phòng 101',
    appointmentDate: '2024-02-21',
    startTime: '16:00',
    endTime: '16:30',
    duration: 30,
    status: AppointmentStatus.PENDING,
    reason: 'Khám tim mạch',
    notes: 'Bệnh nhân có tiền sử tiểu đường',
    createdAt: '2024-02-01T18:40:00Z',
    updatedAt: '2024-02-01T18:40:00Z',
  },
  {
    id: '10',
    code: 'LH010',
    patientId: '10',
    patientName: 'Lý Thị Kim',
    patientPhone: '0741852963',
    doctorId: '2',
    doctorName: 'BS. Trần Thị Sĩ',
    doctorSpecialty: 'Nhi khoa',
    roomId: '2',
    roomName: 'Phòng 102',
    appointmentDate: '2024-02-22',
    startTime: '10:30',
    endTime: '11:15',
    duration: 45,
    status: AppointmentStatus.CONFIRMED,
    reason: 'Khám sức khỏe trẻ em',
    notes: '',
    createdAt: '2024-02-01T19:55:00Z',
    updatedAt: '2024-02-01T19:55:00Z',
  },
];

// Generate appointment code
const generateAppointmentCode = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  return `LH${timestamp}`;
};

// Generate patient code
const generatePatientCode = (): string => {
  const timestamp = Date.now().toString().slice(-8);
  return `BN${timestamp}`;
};

// Mock API handlers
export const handlers = [
  // GET /patients - List patients with pagination and search
  http.get('/api/patients', ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword') || '';
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');
    const sort = url.searchParams.get('sort') || 'createdAt';
    const direction = url.searchParams.get('direction') || 'DESC';

    // Filter by keyword
    let filteredPatients = mockPatients;
    if (keyword) {
      filteredPatients = mockPatients.filter(patient =>
        patient.name.toLowerCase().includes(keyword.toLowerCase()) ||
        patient.code.toLowerCase().includes(keyword.toLowerCase()) ||
        patient.phone.includes(keyword)
      );
    }

    // Sort
    filteredPatients.sort((a, b) => {
      let aValue = a[sort as keyof Patient];
      let bValue = b[sort as keyof Patient];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (direction === 'ASC') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Pagination
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = filteredPatients.slice(startIndex, endIndex);
    const totalElements = filteredPatients.length;
    const totalPages = Math.ceil(totalElements / size);

    const response: PatientListResponse = {
      content,
      totalElements,
      totalPages,
      size,
      number: page,
      first: page === 0,
      last: page >= totalPages - 1,
    };

    return HttpResponse.json(response);
  }),

  // GET /patients/:id - Get patient by ID
  http.get('/api/patients/:id', ({ params }) => {
    const id = parseInt(params.id as string);
    const patient = mockPatients.find(p => p.id === id);
    
    if (!patient) {
      return HttpResponse.json(
        { message: 'Không tìm thấy bệnh nhân' },
        { status: 404 }
      );
    }

    // Mock detailed patient data
    const patientDetail: PatientDetail = {
      ...patient,
      changeLogs: [
        {
          id: 1,
          field: 'name',
          oldValue: 'Nguyễn Văn A',
          newValue: patient.name,
          changedAt: '2024-01-15T08:30:00Z',
          changedBy: 'admin',
        },
      ],
      visits: [
        {
          id: 1,
          visitDate: '2024-01-20T09:00:00Z',
          doctorName: 'BS. Nguyễn Văn Bác',
          diagnosis: 'Cảm cúm thông thường',
          status: 'COMPLETED',
        },
        {
          id: 2,
          visitDate: '2024-02-01T14:30:00Z',
          doctorName: 'BS. Trần Thị Sĩ',
          diagnosis: 'Khám sức khỏe định kỳ',
          status: 'PENDING',
        },
      ],
      prescriptions: [
        {
          id: 1,
          prescriptionDate: '2024-01-20T09:30:00Z',
          doctorName: 'BS. Nguyễn Văn Bác',
          medications: ['Paracetamol 500mg', 'Vitamin C'],
          status: 'COMPLETED',
        },
      ],
      billings: [
        {
          id: 1,
          billingDate: '2024-01-20T10:00:00Z',
          totalAmount: 150000,
          status: 'PAID',
          services: ['Khám bệnh', 'Thuốc'],
        },
      ],
    };

    return HttpResponse.json(patientDetail);
  }),

  // GET /patients/code/:code - Get patient by code
  http.get('/api/patients/code/:code', ({ params }) => {
    const code = params.code as string;
    const patient = mockPatients.find(p => p.code === code);
    
    if (!patient) {
      return HttpResponse.json(
        { message: 'Không tìm thấy bệnh nhân' },
        { status: 404 }
      );
    }

    return HttpResponse.json(patient);
  }),

  // POST /patients - Create new patient
  http.post('/api/patients', async ({ request }) => {
    const data = await request.json() as any;
    
    const newPatient: Patient = {
      id: Math.max(...mockPatients.map(p => p.id)) + 1,
      code: generatePatientCode(),
      name: data.name,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      phone: data.phone,
      email: data.email,
      address: data.address,
      note: data.note,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockPatients.push(newPatient);
    return HttpResponse.json(newPatient, { status: 201 });
  }),

  // PUT /patients/:id - Update patient
  http.put('/api/patients/:id', async ({ params, request }) => {
    const id = parseInt(params.id as string);
    const data = await request.json() as any;
    
    const patientIndex = mockPatients.findIndex(p => p.id === id);
    if (patientIndex === -1) {
      return HttpResponse.json(
        { message: 'Không tìm thấy bệnh nhân' },
        { status: 404 }
      );
    }

    const updatedPatient: Patient = {
      ...mockPatients[patientIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    mockPatients[patientIndex] = updatedPatient;
    return HttpResponse.json(updatedPatient);
  }),

  // DELETE /patients/:id - Delete patient
  http.delete('/api/patients/:id', ({ params }) => {
    const id = parseInt(params.id as string);
    const patientIndex = mockPatients.findIndex(p => p.id === id);
    
    if (patientIndex === -1) {
      return HttpResponse.json(
        { message: 'Không tìm thấy bệnh nhân' },
        { status: 404 }
      );
    }

    // Mock check for constraints
    const patient = mockPatients[patientIndex];
    if (patient.id <= 5) { // Simulate patients with visits that can't be deleted
      return HttpResponse.json(
        { message: 'Không thể xóa bệnh nhân này vì đã có lịch khám' },
        { status: 400 }
      );
    }

    mockPatients.splice(patientIndex, 1);
    return HttpResponse.json({ message: 'Xóa bệnh nhân thành công' });
  }),

  // GET /patients/:id/can-delete - Check if patient can be deleted
  http.get('/api/patients/:id/can-delete', ({ params }) => {
    const id = parseInt(params.id as string);
    const patient = mockPatients.find(p => p.id === id);
    
    if (!patient) {
      return HttpResponse.json(
        { canDelete: false, reason: 'Không tìm thấy bệnh nhân' },
        { status: 404 }
      );
    }

    // Mock constraint check
    if (patient.id <= 5) {
      return HttpResponse.json({
        canDelete: false,
        reason: 'Không thể xóa bệnh nhân này vì đã có lịch khám'
      });
    }

    return HttpResponse.json({ canDelete: true });
  }),

  // Doctor API handlers
  // GET /doctors - List doctors with filters
  http.get('/api/doctors', ({ request }) => {
    const url = new URL(request.url);
    const specialty = url.searchParams.get('specialty');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');

    // Filter doctors
    let filteredDoctors = mockDoctors;
    
    if (specialty) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
    }
    
    if (status) {
      filteredDoctors = filteredDoctors.filter(doctor => doctor.status === status);
    }
    
    if (search) {
      filteredDoctors = filteredDoctors.filter(doctor =>
        doctor.fullName.toLowerCase().includes(search.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(search.toLowerCase()) ||
        doctor.licenseNo.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = filteredDoctors.slice(startIndex, endIndex);
    const totalElements = filteredDoctors.length;
    const totalPages = Math.ceil(totalElements / size);

    const response: DoctorListResponse = {
      content,
      totalElements,
      totalPages,
      size,
      number: page,
    };

    return HttpResponse.json(response);
  }),

  // GET /doctors/:id - Get doctor by ID
  http.get('/api/doctors/:id', ({ params }) => {
    const id = params.id as string;
    const doctor = mockDoctors.find(d => d.id === id);
    
    if (!doctor) {
      return HttpResponse.json(
        { message: 'Không tìm thấy bác sĩ' },
        { status: 404 }
      );
    }

    return HttpResponse.json(doctor);
  }),

  // POST /doctors - Create new doctor
  http.post('/api/doctors', async ({ request }) => {
    const data = await request.json() as CreateDoctorRequest;
    
    const newDoctor: Doctor = {
      id: (Math.max(...mockDoctors.map(d => parseInt(d.id))) + 1).toString(),
      userId: `user-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      specialty: data.specialty,
      licenseNo: data.licenseNo,
      room: data.room,
      bio: data.bio,
      status: 'ACTIVE',
      avatar: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDoctors.push(newDoctor);
    return HttpResponse.json(newDoctor, { status: 201 });
  }),

  // PUT /doctors/:id - Update doctor
  http.put('/api/doctors/:id', async ({ params, request }) => {
    const id = params.id as string;
    const data = await request.json() as any;
    
    const doctorIndex = mockDoctors.findIndex(d => d.id === id);
    if (doctorIndex === -1) {
      return HttpResponse.json(
        { message: 'Không tìm thấy bác sĩ' },
        { status: 404 }
      );
    }

    const updatedDoctor: Doctor = {
      ...mockDoctors[doctorIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    mockDoctors[doctorIndex] = updatedDoctor;
    return HttpResponse.json(updatedDoctor);
  }),

  // DELETE /doctors/:id - Delete doctor
  http.delete('/api/doctors/:id', ({ params }) => {
    const id = params.id as string;
    const doctorIndex = mockDoctors.findIndex(d => d.id === id);
    
    if (doctorIndex === -1) {
      return HttpResponse.json(
        { message: 'Không tìm thấy bác sĩ' },
        { status: 404 }
      );
    }

    mockDoctors.splice(doctorIndex, 1);
    return HttpResponse.json({ message: 'Xóa bác sĩ thành công' });
  }),

  // POST /doctors/:id/reset-password - Reset doctor password
  http.post('/api/doctors/:id/reset-password', ({ params }) => {
    const id = params.id as string;
    const doctor = mockDoctors.find(d => d.id === id);
    
    if (!doctor) {
      return HttpResponse.json(
        { message: 'Không tìm thấy bác sĩ' },
        { status: 404 }
      );
    }

    return HttpResponse.json({ message: 'Reset mật khẩu thành công' });
  }),

  // GET /doctors/:id/stats - Get doctor stats
  http.get('/api/doctors/:id/stats', ({ params }) => {
    const id = params.id as string;
    const doctor = mockDoctors.find(d => d.id === id);
    
    if (!doctor) {
      return HttpResponse.json(
        { message: 'Không tìm thấy bác sĩ' },
        { status: 404 }
      );
    }

    const stats: DoctorStats = {
      totalAppointments: Math.floor(Math.random() * 100) + 50,
      completedAppointments: Math.floor(Math.random() * 80) + 40,
      upcomingAppointments: Math.floor(Math.random() * 20) + 5,
      averageRating: 4.5 + Math.random() * 0.5,
      totalPatients: Math.floor(Math.random() * 200) + 100,
    };

    return HttpResponse.json(stats);
  }),

  // GET /doctors/specialties - Get specialties
  http.get('/api/doctors/specialties', () => {
    const specialties = [
      'Tim mạch',
      'Nhi khoa',
      'Ngoại khoa',
      'Sản phụ khoa',
      'Thần kinh',
      'Da liễu',
      'Mắt',
      'Tai mũi họng',
      'Nội tiết',
      'Tiêu hóa',
      'Hô hấp',
      'Ung bướu',
      'Xương khớp',
      'Tâm thần',
      'Y học cổ truyền'
    ];
    return HttpResponse.json(specialties);
  }),

  // Doctor Schedule API handlers
  // GET /doctor-schedules - Get doctor schedules
  http.get('/api/doctor-schedules', ({ request }) => {
    const url = new URL(request.url);
    const doctorId = url.searchParams.get('doctorId');
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const dayOfWeek = url.searchParams.get('dayOfWeek');

    let filteredSchedules = mockSchedules;
    
    if (doctorId) {
      filteredSchedules = filteredSchedules.filter(s => s.doctorId === doctorId);
    }
    
    if (dayOfWeek !== null) {
      filteredSchedules = filteredSchedules.filter(s => s.dayOfWeek === parseInt(dayOfWeek!));
    }

    return HttpResponse.json(filteredSchedules);
  }),

  // POST /doctor-schedules - Create schedule
  http.post('/api/doctor-schedules', async ({ request }) => {
    const data = await request.json() as any;
    
    const newSchedule: Schedule = {
      id: (Math.max(...mockSchedules.map(s => parseInt(s.id))) + 1).toString(),
      doctorId: data.doctorId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      room: data.room,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockSchedules.push(newSchedule);
    return HttpResponse.json(newSchedule, { status: 201 });
  }),

  // PUT /doctor-schedules/:id - Update schedule
  http.put('/api/doctor-schedules/:id', async ({ params, request }) => {
    const id = params.id as string;
    const data = await request.json() as any;
    
    const scheduleIndex = mockSchedules.findIndex(s => s.id === id);
    if (scheduleIndex === -1) {
      return HttpResponse.json(
        { message: 'Không tìm thấy lịch làm việc' },
        { status: 404 }
      );
    }

    const updatedSchedule: Schedule = {
      ...mockSchedules[scheduleIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    mockSchedules[scheduleIndex] = updatedSchedule;
    return HttpResponse.json(updatedSchedule);
  }),

  // DELETE /doctor-schedules/:id - Delete schedule
  http.delete('/api/doctor-schedules/:id', ({ params }) => {
    const id = params.id as string;
    const scheduleIndex = mockSchedules.findIndex(s => s.id === id);
    
    if (scheduleIndex === -1) {
      return HttpResponse.json(
        { message: 'Không tìm thấy lịch làm việc' },
        { status: 404 }
      );
    }

    mockSchedules.splice(scheduleIndex, 1);
    return HttpResponse.json({ message: 'Xóa lịch làm việc thành công' });
  }),

  // PATCH /doctor-schedules/:id/toggle - Toggle schedule status
  http.patch('/api/doctor-schedules/:id/toggle', ({ params }) => {
    const id = params.id as string;
    const scheduleIndex = mockSchedules.findIndex(s => s.id === id);
    
    if (scheduleIndex === -1) {
      return HttpResponse.json(
        { message: 'Không tìm thấy lịch làm việc' },
        { status: 404 }
      );
    }

    const updatedSchedule: Schedule = {
      ...mockSchedules[scheduleIndex],
      isActive: !mockSchedules[scheduleIndex].isActive,
      updatedAt: new Date().toISOString(),
    };

    mockSchedules[scheduleIndex] = updatedSchedule;
    return HttpResponse.json(updatedSchedule);
  }),

  // Appointment API handlers
  // GET /appointments - List appointments with filters
  http.get('/api/appointments', ({ request }) => {
    const url = new URL(request.url);
    const doctorId = url.searchParams.get('doctorId');
    const status = url.searchParams.get('status');
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');
    const patientName = url.searchParams.get('patientName');
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');

    // Filter appointments
    let filteredAppointments = mockAppointments;
    
    if (doctorId) {
      filteredAppointments = filteredAppointments.filter(apt => apt.doctorId === doctorId);
    }
    
    if (status) {
      filteredAppointments = filteredAppointments.filter(apt => apt.status === status);
    }
    
    if (dateFrom) {
      filteredAppointments = filteredAppointments.filter(apt => apt.appointmentDate >= dateFrom);
    }
    
    if (dateTo) {
      filteredAppointments = filteredAppointments.filter(apt => apt.appointmentDate <= dateTo);
    }
    
    if (patientName) {
      filteredAppointments = filteredAppointments.filter(apt =>
        apt.patientName.toLowerCase().includes(patientName.toLowerCase())
      );
    }

    // Sort by appointment date and time
    filteredAppointments.sort((a, b) => {
      const dateA = new Date(`${a.appointmentDate} ${a.startTime}`);
      const dateB = new Date(`${b.appointmentDate} ${b.startTime}`);
      return dateA.getTime() - dateB.getTime();
    });

    // Pagination
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = filteredAppointments.slice(startIndex, endIndex);
    const totalElements = filteredAppointments.length;
    const totalPages = Math.ceil(totalElements / size);

    const response = {
      content,
      totalElements,
      totalPages,
      size,
      number: page,
      first: page === 0,
      last: page >= totalPages - 1,
    };

    return HttpResponse.json(response);
  }),

  // GET /appointments/:id - Get appointment by ID
  http.get('/api/appointments/:id', ({ params }) => {
    const id = params.id as string;
    const appointment = mockAppointments.find(apt => apt.id === id);
    
    if (!appointment) {
      return HttpResponse.json(
        { message: 'Không tìm thấy lịch hẹn' },
        { status: 404 }
      );
    }

    return HttpResponse.json(appointment);
  }),

  // POST /appointments - Create new appointment
  http.post('/api/appointments', async ({ request }) => {
    const data = await request.json() as any;
    
    const newAppointment: Appointment = {
      id: (Math.max(...mockAppointments.map(apt => parseInt(apt.id))) + 1).toString(),
      code: generateAppointmentCode(),
      patientId: data.patientId,
      patientName: mockPatients.find(p => p.id.toString() === data.patientId)?.name || 'Unknown',
      patientPhone: mockPatients.find(p => p.id.toString() === data.patientId)?.phone || '',
      doctorId: data.doctorId,
      doctorName: mockDoctors.find(d => d.id === data.doctorId)?.fullName || 'Unknown',
      doctorSpecialty: mockDoctors.find(d => d.id === data.doctorId)?.specialty || 'Unknown',
      roomId: data.roomId,
      roomName: `Phòng ${data.roomId}`,
      appointmentDate: data.appointmentDate,
      startTime: data.startTime,
      endTime: calculateEndTime(data.startTime, data.duration),
      duration: data.duration,
      status: AppointmentStatus.PENDING,
      reason: data.reason,
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockAppointments.push(newAppointment);
    return HttpResponse.json(newAppointment, { status: 201 });
  }),

  // PUT /appointments/:id - Update appointment
  http.put('/api/appointments/:id', async ({ params, request }) => {
    const id = params.id as string;
    const data = await request.json() as any;
    
    const appointmentIndex = mockAppointments.findIndex(apt => apt.id === id);
    if (appointmentIndex === -1) {
      return HttpResponse.json(
        { message: 'Không tìm thấy lịch hẹn' },
        { status: 404 }
      );
    }

    const updatedAppointment: Appointment = {
      ...mockAppointments[appointmentIndex],
      ...data,
      endTime: data.startTime ? calculateEndTime(data.startTime, data.duration || mockAppointments[appointmentIndex].duration) : mockAppointments[appointmentIndex].endTime,
      updatedAt: new Date().toISOString(),
    };

    mockAppointments[appointmentIndex] = updatedAppointment;
    return HttpResponse.json(updatedAppointment);
  }),

  // DELETE /appointments/:id - Delete appointment
  http.delete('/api/appointments/:id', ({ params }) => {
    const id = params.id as string;
    const appointmentIndex = mockAppointments.findIndex(apt => apt.id === id);
    
    if (appointmentIndex === -1) {
      return HttpResponse.json(
        { message: 'Không tìm thấy lịch hẹn' },
        { status: 404 }
      );
    }

    mockAppointments.splice(appointmentIndex, 1);
    return HttpResponse.json({ message: 'Xóa lịch hẹn thành công' });
  }),

  // GET /appointments/doctor/:doctorId - Get appointments by doctor
  http.get('/api/appointments/doctor/:doctorId', ({ params, request }) => {
    const doctorId = params.doctorId as string;
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');
    const patientName = url.searchParams.get('patientName');
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');

    let filteredAppointments = mockAppointments.filter(apt => apt.doctorId === doctorId);
    
    if (status) {
      filteredAppointments = filteredAppointments.filter(apt => apt.status === status);
    }
    
    if (dateFrom) {
      filteredAppointments = filteredAppointments.filter(apt => apt.appointmentDate >= dateFrom);
    }
    
    if (dateTo) {
      filteredAppointments = filteredAppointments.filter(apt => apt.appointmentDate <= dateTo);
    }
    
    if (patientName) {
      filteredAppointments = filteredAppointments.filter(apt =>
        apt.patientName.toLowerCase().includes(patientName.toLowerCase())
      );
    }

    // Pagination
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = filteredAppointments.slice(startIndex, endIndex);
    const totalElements = filteredAppointments.length;
    const totalPages = Math.ceil(totalElements / size);

    const response = {
      content,
      totalElements,
      totalPages,
      size,
      number: page,
      first: page === 0,
      last: page >= totalPages - 1,
    };

    return HttpResponse.json(response);
  }),

  // GET /appointments/patient/:patientId - Get appointments by patient
  http.get('/api/appointments/patient/:patientId', ({ params, request }) => {
    const patientId = params.patientId as string;
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');

    let filteredAppointments = mockAppointments.filter(apt => apt.patientId === patientId);
    
    if (status) {
      filteredAppointments = filteredAppointments.filter(apt => apt.status === status);
    }
    
    if (dateFrom) {
      filteredAppointments = filteredAppointments.filter(apt => apt.appointmentDate >= dateFrom);
    }
    
    if (dateTo) {
      filteredAppointments = filteredAppointments.filter(apt => apt.appointmentDate <= dateTo);
    }

    // Pagination
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = filteredAppointments.slice(startIndex, endIndex);
    const totalElements = filteredAppointments.length;
    const totalPages = Math.ceil(totalElements / size);

    const response = {
      content,
      totalElements,
      totalPages,
      size,
      number: page,
      first: page === 0,
      last: page >= totalPages - 1,
    };

    return HttpResponse.json(response);
  }),

  // GET /appointments/status/:status - Get appointments by status
  http.get('/api/appointments/status/:status', ({ params, request }) => {
    const status = params.status as AppointmentStatus;
    const url = new URL(request.url);
    const doctorId = url.searchParams.get('doctorId');
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');
    const patientName = url.searchParams.get('patientName');
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');

    let filteredAppointments = mockAppointments.filter(apt => apt.status === status);
    
    if (doctorId) {
      filteredAppointments = filteredAppointments.filter(apt => apt.doctorId === doctorId);
    }
    
    if (dateFrom) {
      filteredAppointments = filteredAppointments.filter(apt => apt.appointmentDate >= dateFrom);
    }
    
    if (dateTo) {
      filteredAppointments = filteredAppointments.filter(apt => apt.appointmentDate <= dateTo);
    }
    
    if (patientName) {
      filteredAppointments = filteredAppointments.filter(apt =>
        apt.patientName.toLowerCase().includes(patientName.toLowerCase())
      );
    }

    // Pagination
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = filteredAppointments.slice(startIndex, endIndex);
    const totalElements = filteredAppointments.length;
    const totalPages = Math.ceil(totalElements / size);

    const response = {
      content,
      totalElements,
      totalPages,
      size,
      number: page,
      first: page === 0,
      last: page >= totalPages - 1,
    };

    return HttpResponse.json(response);
  }),

  // GET /appointments/stats - Get appointment statistics
  http.get('/api/appointments/stats', () => {
    const today = new Date().toISOString().split('T')[0];
    const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const stats: AppointmentStats = {
      total: mockAppointments.length,
      pending: mockAppointments.filter(apt => apt.status === AppointmentStatus.PENDING).length,
      confirmed: mockAppointments.filter(apt => apt.status === AppointmentStatus.CONFIRMED).length,
      cancelled: mockAppointments.filter(apt => apt.status === AppointmentStatus.CANCELLED).length,
      completed: mockAppointments.filter(apt => apt.status === AppointmentStatus.COMPLETED).length,
      noShow: mockAppointments.filter(apt => apt.status === AppointmentStatus.NO_SHOW).length,
      todayCount: mockAppointments.filter(apt => apt.appointmentDate === today).length,
      weekCount: mockAppointments.filter(apt => apt.appointmentDate >= weekStart).length,
      monthCount: mockAppointments.filter(apt => apt.appointmentDate >= monthStart).length,
    };

    return HttpResponse.json(stats);
  }),

  // POST /appointments/check-conflicts - Check appointment conflicts
  http.post('/api/appointments/check-conflicts', async ({ request }) => {
    const data = await request.json() as any;
    
    const conflicts = mockAppointments.filter(apt => {
      if (apt.doctorId !== data.doctorId) return false;
      if (apt.appointmentDate !== data.appointmentDate) return false;
      if (data.excludeId && apt.id === data.excludeId) return false;
      
      const aptStart = new Date(`${apt.appointmentDate} ${apt.startTime}`);
      const aptEnd = new Date(`${apt.appointmentDate} ${apt.endTime}`);
      const newStart = new Date(`${data.appointmentDate} ${data.startTime}`);
      const newEnd = new Date(`${data.appointmentDate} ${data.startTime}`);
      newEnd.setMinutes(newEnd.getMinutes() + data.duration);
      
      return (newStart < aptEnd && newEnd > aptStart);
    });

    return HttpResponse.json({
      hasConflict: conflicts.length > 0,
      conflicts
    });
  }),

  // GET /appointments/date-range - Get appointments by date range
  http.get('/api/appointments/date-range', ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const doctorId = url.searchParams.get('doctorId');

    let filteredAppointments = mockAppointments;
    
    if (startDate) {
      filteredAppointments = filteredAppointments.filter(apt => apt.appointmentDate >= startDate);
    }
    
    if (endDate) {
      filteredAppointments = filteredAppointments.filter(apt => apt.appointmentDate <= endDate);
    }
    
    if (doctorId) {
      filteredAppointments = filteredAppointments.filter(apt => apt.doctorId === doctorId);
    }

    return HttpResponse.json(filteredAppointments);
  }),
];

// Helper function to calculate end time
function calculateEndTime(startTime: string, duration: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startMinutes = hours * 60 + minutes;
  const endMinutes = startMinutes + duration;
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
}
