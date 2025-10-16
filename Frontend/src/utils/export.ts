import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  RevenueData, 
  PatientData, 
  AppointmentData, 
  ServiceData,
  ExportOptions 
} from '@/types/report';

export class ExportService {
  static async exportToExcel(
    data: RevenueData | PatientData | AppointmentData | ServiceData,
    options: ExportOptions
  ): Promise<Blob> {
    const workbook = XLSX.utils.book_new();
    
    // Create summary sheet
    const summaryData = this.createSummarySheet(data, options);
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Tổng quan');
    
    // Create detailed sheets based on data type
    if ('trends' in data) {
      // Revenue or Patient data with trends
      const trendsSheet = XLSX.utils.json_to_sheet(data.trends);
      XLSX.utils.book_append_sheet(workbook, trendsSheet, 'Xu hướng');
    }
    
    if ('byDoctor' in data) {
      // Revenue or Appointment data with doctor breakdown
      const doctorSheet = XLSX.utils.json_to_sheet(data.byDoctor);
      XLSX.utils.book_append_sheet(workbook, doctorSheet, 'Theo bác sĩ');
    }
    
    if ('byService' in data) {
      // Revenue or Service data with service breakdown
      const serviceSheet = XLSX.utils.json_to_sheet(data.byService);
      XLSX.utils.book_append_sheet(workbook, serviceSheet, 'Theo dịch vụ');
    }
    
    if ('byAge' in data) {
      // Patient data with demographics
      const ageSheet = XLSX.utils.json_to_sheet(data.byAge);
      XLSX.utils.book_append_sheet(workbook, ageSheet, 'Theo độ tuổi');
      
      const genderSheet = XLSX.utils.json_to_sheet(data.byGender);
      XLSX.utils.book_append_sheet(workbook, genderSheet, 'Theo giới tính');
      
      const locationSheet = XLSX.utils.json_to_sheet(data.byLocation);
      XLSX.utils.book_append_sheet(workbook, locationSheet, 'Theo địa phương');
    }
    
    if ('cancelReasons' in data) {
      // Appointment data with cancel reasons
      const cancelSheet = XLSX.utils.json_to_sheet(data.cancelReasons);
      XLSX.utils.book_append_sheet(workbook, cancelSheet, 'Lý do hủy');
    }
    
    if ('inventory' in data) {
      // Service data with inventory
      const inventorySheet = XLSX.utils.json_to_sheet(data.inventory);
      XLSX.utils.book_append_sheet(workbook, inventorySheet, 'Tồn kho');
    }
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array' 
    });
    
    return new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }
  
  static async exportToPDF(
    data: RevenueData | PatientData | AppointmentData | ServiceData,
    options: ExportOptions,
    chartElements?: HTMLElement[]
  ): Promise<Blob> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;
    
    // Add title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BÁO CÁO PHÒNG KHÁM', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    // Add date range
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const dateRange = `${options.dateRange.from.toLocaleDateString('vi-VN')} - ${options.dateRange.to.toLocaleDateString('vi-VN')}`;
    pdf.text(`Thời gian: ${dateRange}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;
    
    // Add summary data
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TỔNG QUAN', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    // Add summary based on data type
    if ('total' in data) {
      pdf.text(`Tổng: ${data.total.toLocaleString('vi-VN')}`, 20, yPosition);
      yPosition += 7;
    }
    
    if ('completionRate' in data) {
      pdf.text(`Tỷ lệ hoàn thành: ${data.completionRate.toFixed(1)}%`, 20, yPosition);
      yPosition += 7;
    }
    
    if ('newPatients' in data) {
      pdf.text(`Bệnh nhân mới: ${data.newPatients}`, 20, yPosition);
      yPosition += 7;
      pdf.text(`Bệnh nhân tái khám: ${data.returningPatients}`, 20, yPosition);
      yPosition += 7;
    }
    
    // Add charts if available
    if (options.includeCharts && chartElements) {
      for (const chartElement of chartElements) {
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = 20;
        }
        
        try {
          const canvas = await html2canvas(chartElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
          });
          
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pageWidth - 40;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          if (yPosition + imgHeight > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
        } catch (error) {
          console.error('Error capturing chart:', error);
        }
      }
    }
    
    // Add detailed data tables
    yPosition += 10;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CHI TIẾT', 20, yPosition);
    yPosition += 10;
    
    // Add data tables based on type
    if ('byDoctor' in data && data.byDoctor.length > 0) {
      this.addDataTable(pdf, data.byDoctor, 'Theo bác sĩ', yPosition, pageWidth);
      yPosition += 50;
    }
    
    if ('byService' in data && data.byService.length > 0) {
      this.addDataTable(pdf, data.byService, 'Theo dịch vụ', yPosition, pageWidth);
      yPosition += 50;
    }
    
    if ('byAge' in data && data.byAge.length > 0) {
      this.addDataTable(pdf, data.byAge, 'Theo độ tuổi', yPosition, pageWidth);
      yPosition += 50;
    }
    
    return pdf.output('blob');
  }
  
  private static createSummarySheet(
    data: RevenueData | PatientData | AppointmentData | ServiceData,
    options: ExportOptions
  ): any[][] {
    const summary: any[][] = [
      ['BÁO CÁO PHÒNG KHÁM'],
      [`Thời gian: ${options.dateRange.from.toLocaleDateString('vi-VN')} - ${options.dateRange.to.toLocaleDateString('vi-VN')}`],
      [''],
    ];
    
    // Add summary based on data type
    if ('total' in data) {
      summary.push(['Tổng', data.total]);
    }
    
    if ('completionRate' in data) {
      summary.push(['Tỷ lệ hoàn thành (%)', data.completionRate.toFixed(1)]);
    }
    
    if ('newPatients' in data) {
      summary.push(['Bệnh nhân mới', data.newPatients]);
      summary.push(['Bệnh nhân tái khám', data.returningPatients]);
    }
    
    if ('averageWaitingTime' in data) {
      summary.push(['Thời gian chờ trung bình (phút)', data.averageWaitingTime]);
    }
    
    return summary;
  }
  
  private static addDataTable(
    pdf: jsPDF,
    data: any[],
    title: string,
    yPosition: number,
    pageWidth: number
  ): void {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, 20, yPosition);
    yPosition += 7;
    
    pdf.setFont('helvetica', 'normal');
    
    // Add table headers and data
    const headers = Object.keys(data[0] || {});
    const colWidth = (pageWidth - 40) / headers.length;
    
    // Headers
    headers.forEach((header, index) => {
      pdf.text(header, 20 + index * colWidth, yPosition);
    });
    yPosition += 5;
    
    // Data rows
    data.slice(0, 10).forEach((row) => {
      headers.forEach((header, index) => {
        const value = row[header];
        const text = typeof value === 'number' ? value.toLocaleString('vi-VN') : String(value);
        pdf.text(text, 20 + index * colWidth, yPosition);
      });
      yPosition += 5;
    });
  }
  
  static async exportReport(
    data: RevenueData | PatientData | AppointmentData | ServiceData,
    options: ExportOptions,
    chartElements?: HTMLElement[]
  ): Promise<Blob> {
    if (options.format === 'excel') {
      return this.exportToExcel(data, options);
    } else {
      return this.exportToPDF(data, options, chartElements);
    }
  }
  
  static downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}