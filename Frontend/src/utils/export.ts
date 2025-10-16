import * as XLSX from 'xlsx';
import { formatCurrency } from './currency';
import type { Billing, BillingStatistics, BillingExportOptions } from '@/types';

/**
 * Export billing data to Excel
 */
export async function exportBillingsToExcel(
  billings: Billing[],
  filename = 'billings.xlsx'
): Promise<void> {
  const worksheet = XLSX.utils.json_to_sheet(
    billings.map(billing => ({
      'Mã hóa đơn': billing.code,
      'Tên bệnh nhân': billing.patientName,
      'Ngày tạo': new Date(billing.createdAt).toLocaleDateString('vi-VN'),
      'Tổng tiền': billing.total,
      'Trạng thái': billing.status,
      'Phương thức thanh toán': billing.paymentMethod,
      'Ghi chú': billing.notes || ''
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Hóa đơn');
  
  XLSX.writeFile(workbook, filename);
}

/**
 * Export billing statistics to Excel
 */
export async function exportBillingStatsToExcel(
  stats: BillingStatistics,
  filename = 'billing-statistics.xlsx'
): Promise<void> {
  const workbook = XLSX.utils.book_new();

  // Tổng quan
  const overviewData = [
    ['Tổng doanh thu', formatCurrency(stats.totalRevenue)],
    ['Tổng số hóa đơn', stats.totalBills],
    ['Giá trị trung bình', formatCurrency(stats.averageBillValue)]
  ];
  const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Tổng quan');

  // Doanh thu theo phương thức
  const methodData = [
    ['Phương thức', 'Doanh thu'],
    ...Object.entries(stats.revenueByMethod).map(([method, revenue]) => [
      method,
      formatCurrency(revenue)
    ])
  ];
  const methodSheet = XLSX.utils.aoa_to_sheet(methodData);
  XLSX.utils.book_append_sheet(workbook, methodSheet, 'Theo phương thức');

  // Doanh thu theo thời gian
  const dailyData = [
    ['Ngày', 'Doanh thu'],
    ...stats.revenueByPeriod.daily.map(item => [
      item.date,
      formatCurrency(item.revenue)
    ])
  ];
  const dailySheet = XLSX.utils.aoa_to_sheet(dailyData);
  XLSX.utils.book_append_sheet(workbook, dailySheet, 'Doanh thu hàng ngày');

  XLSX.writeFile(workbook, filename);
}

/**
 * Generate PDF content for billing
 */
export function generateBillingPDFContent(billing: Billing): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Hóa đơn ${billing.code}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .billing-info { margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table th { background-color: #f2f2f2; }
        .total-section { margin-top: 20px; text-align: right; }
        .total-row { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>HÓA ĐƠN DỊCH VỤ Y TẾ</h1>
        <p>Mã hóa đơn: ${billing.code}</p>
      </div>
      
      <div class="billing-info">
        <p><strong>Bệnh nhân:</strong> ${billing.patientName}</p>
        <p><strong>Ngày tạo:</strong> ${new Date(billing.createdAt).toLocaleDateString('vi-VN')}</p>
        <p><strong>Trạng thái:</strong> ${billing.status}</p>
      </div>

      <h3>Dịch vụ</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Tên dịch vụ</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${billing.services.map(service => `
            <tr>
              <td>${service.serviceName}</td>
              <td>${service.quantity}</td>
              <td>${formatCurrency(service.unitPrice)}</td>
              <td>${formatCurrency(service.totalPrice)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h3>Thuốc</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Tên thuốc</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${billing.medications.map(medication => `
            <tr>
              <td>${medication.medicationName}</td>
              <td>${medication.quantity}</td>
              <td>${formatCurrency(medication.unitPrice)}</td>
              <td>${formatCurrency(medication.totalPrice)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="total-section">
        <p>Tổng tiền dịch vụ: ${formatCurrency(billing.subtotal)}</p>
        ${billing.discountAmount > 0 ? `<p>Giảm giá: ${formatCurrency(billing.discountAmount)}</p>` : ''}
        <p>VAT (${billing.vatRate}%): ${formatCurrency(billing.vatAmount)}</p>
        <p class="total-row">Tổng cộng: ${formatCurrency(billing.total)}</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Download file from blob
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Format date for export
 */
export function formatDateForExport(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Format date and time for export
 */
export function formatDateTimeForExport(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}
