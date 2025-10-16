import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export interface PrescriptionPDFData {
  prescription: {
    code: string;
    patient: {
      fullName: string;
      dateOfBirth: string;
      gender: string;
      phone: string;
      address?: string;
    };
    doctor: {
      account: {
        fullName: string;
      };
      specialty: string;
      licenseNumber: string;
    };
    diagnosis: string;
    notes?: string;
    items: Array<{
      medication: {
        name: string;
        genericName?: string;
        category: string;
        unit: string;
      };
      dosage: string;
      frequency: string;
      duration: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      instructions: string;
    }>;
    totalAmount: number;
    createdAt: string;
    qrCode?: string;
    printedAt?: string;
  };
  clinicInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
}

export class PrescriptionPDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private currentY: number;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 20;
    this.currentY = this.margin;
  }

  async generatePrescriptionPDF(data: PrescriptionPDFData): Promise<Blob> {
    // Reset position
    this.currentY = this.margin;

    // Header
    this.addHeader(data.clinicInfo);
    
    // Prescription info
    this.addPrescriptionInfo(data.prescription);
    
    // Patient and doctor info
    this.addPatientDoctorInfo(data.prescription);
    
    // Diagnosis
    this.addDiagnosis(data.prescription);
    
    // Notes
    if (data.prescription.notes) {
      this.addNotes(data.prescription.notes);
    }
    
    // Medications
    this.addMedications(data.prescription.items);
    
    // Total
    this.addTotal(data.prescription.totalAmount);
    
    // QR Code
    if (data.prescription.qrCode) {
      await this.addQRCode(data.prescription.qrCode);
    }
    
    // Footer
    this.addFooter(data.prescription);

    return this.doc.output('blob');
  }

  private addHeader(clinicInfo: PrescriptionPDFData['clinicInfo']) {
    // Clinic name
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(clinicInfo.name, this.pageWidth / 2, this.currentY, { align: 'center' });
    this.currentY += 15;

    // Clinic info
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(clinicInfo.address, this.pageWidth / 2, this.currentY, { align: 'center' });
    this.currentY += 5;
    this.doc.text(`ĐT: ${clinicInfo.phone} | Email: ${clinicInfo.email}`, this.pageWidth / 2, this.currentY, { align: 'center' });
    this.currentY += 20;

    // Title
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('ĐƠN THUỐC', this.pageWidth / 2, this.currentY, { align: 'center' });
    this.currentY += 15;
  }

  private addPrescriptionInfo(prescription: PrescriptionPDFData['prescription']) {
    const rightX = this.pageWidth - this.margin;
    
    // Prescription code and date
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Mã đơn: ${prescription.code}`, rightX - 60, this.currentY, { align: 'right' });
    this.currentY += 5;
    this.doc.text(`Ngày: ${this.formatDate(prescription.createdAt)}`, rightX - 60, this.currentY, { align: 'right' });
    this.currentY += 10;
  }

  private addPatientDoctorInfo(prescription: PrescriptionPDFData['prescription']) {
    const leftX = this.margin;
    const rightX = this.pageWidth / 2 + 10;

    // Patient info
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('THÔNG TIN BỆNH NHÂN:', leftX, this.currentY);
    this.currentY += 8;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Họ tên: ${prescription.patient.fullName}`, leftX, this.currentY);
    this.currentY += 5;
    this.doc.text(`Ngày sinh: ${this.formatDate(prescription.patient.dateOfBirth)}`, leftX, this.currentY);
    this.currentY += 5;
    this.doc.text(`Giới tính: ${prescription.patient.gender === 'MALE' ? 'Nam' : 'Nữ'}`, leftX, this.currentY);
    this.currentY += 5;
    this.doc.text(`SĐT: ${prescription.patient.phone}`, leftX, this.currentY);
    this.currentY += 5;
    if (prescription.patient.address) {
      this.doc.text(`Địa chỉ: ${prescription.patient.address}`, leftX, this.currentY);
      this.currentY += 5;
    }

    // Doctor info
    this.currentY += 5;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('THÔNG TIN BÁC SĨ:', rightX, this.currentY);
    this.currentY += 8;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Bác sĩ: ${prescription.doctor.account.fullName}`, rightX, this.currentY);
    this.currentY += 5;
    this.doc.text(`Chuyên khoa: ${prescription.doctor.specialty}`, rightX, this.currentY);
    this.currentY += 5;
    this.doc.text(`Số chứng chỉ: ${prescription.doctor.licenseNumber}`, rightX, this.currentY);
    this.currentY += 15;
  }

  private addDiagnosis(prescription: PrescriptionPDFData['prescription']) {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('CHẨN ĐOÁN:', this.margin, this.currentY);
    this.currentY += 8;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    const diagnosisLines = this.doc.splitTextToSize(prescription.diagnosis, this.pageWidth - 2 * this.margin);
    this.doc.text(diagnosisLines, this.margin, this.currentY);
    this.currentY += diagnosisLines.length * 5 + 10;
  }

  private addNotes(notes: string) {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('GHI CHÚ:', this.margin, this.currentY);
    this.currentY += 8;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    const notesLines = this.doc.splitTextToSize(notes, this.pageWidth - 2 * this.margin);
    this.doc.text(notesLines, this.margin, this.currentY);
    this.currentY += notesLines.length * 5 + 10;
  }

  private addMedications(items: PrescriptionPDFData['prescription']['items']) {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('ĐƠN THUỐC:', this.margin, this.currentY);
    this.currentY += 8;

    items.forEach((item, index) => {
      // Check if we need a new page
      if (this.currentY > this.pageHeight - 100) {
        this.doc.addPage();
        this.currentY = this.margin;
      }

      // Medication name
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${index + 1}. ${item.medication.name}`, this.margin, this.currentY);
      this.currentY += 5;

      if (item.medication.genericName) {
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'normal');
        this.doc.text(`(${item.medication.genericName})`, this.margin + 10, this.currentY);
        this.currentY += 5;
      }

      // Medication details
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`Liều lượng: ${item.dosage}`, this.margin + 10, this.currentY);
      this.doc.text(`Tần suất: ${item.frequency}`, this.margin + 80, this.currentY);
      this.doc.text(`Thời gian: ${item.duration}`, this.margin + 140, this.currentY);
      this.currentY += 5;

      this.doc.text(`Số lượng: ${item.quantity} ${item.medication.unit}`, this.margin + 10, this.currentY);
      this.doc.text(`Đơn giá: ${item.unitPrice.toLocaleString('vi-VN')} VNĐ`, this.margin + 80, this.currentY);
      this.doc.text(`Thành tiền: ${item.totalPrice.toLocaleString('vi-VN')} VNĐ`, this.margin + 140, this.currentY);
      this.currentY += 5;

      if (item.instructions) {
        this.doc.text(`Hướng dẫn: ${item.instructions}`, this.margin + 10, this.currentY);
        this.currentY += 5;
      }

      this.currentY += 5;
    });
  }

  private addTotal(totalAmount: number) {
    this.currentY += 10;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`TỔNG CỘNG: ${totalAmount.toLocaleString('vi-VN')} VNĐ`, this.pageWidth - this.margin, this.currentY, { align: 'right' });
    this.currentY += 20;
  }

  private async addQRCode(qrCode: string) {
    try {
      const qrDataURL = await QRCode.toDataURL(qrCode, {
        width: 100,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      const qrSize = 50;
      const qrX = this.pageWidth - this.margin - qrSize;
      const qrY = this.currentY;

      this.doc.addImage(qrDataURL, 'PNG', qrX, qrY, qrSize, qrSize);
      
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`Mã xác thực: ${qrCode}`, qrX, qrY + qrSize + 10);
      
      this.currentY += qrSize + 20;
    } catch (error) {
      console.error('Lỗi tạo QR code:', error);
    }
  }

  private addFooter(prescription: PrescriptionPDFData['prescription']) {
    this.currentY += 20;
    
    // Signature line
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Bác sĩ ký tên', this.margin, this.currentY);
    this.doc.text('Ngày ký', this.pageWidth - this.margin - 50, this.currentY);
    this.currentY += 20;

    // Print info
    if (prescription.printedAt) {
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`In lúc: ${this.formatDateTime(prescription.printedAt)}`, this.pageWidth / 2, this.currentY, { align: 'center' });
    }
  }

  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// Utility functions
export const generateQRCode = async (data: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (error) {
    console.error('Lỗi tạo QR code:', error);
    throw error;
  }
};

export const downloadPDF = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const printPDF = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.contentWindow?.print();
  document.body.removeChild(iframe);
  URL.revokeObjectURL(url);
};
