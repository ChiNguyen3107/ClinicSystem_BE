/**
 * Format utilities for patient data
 */

// Format date of birth to Vietnamese format
export const formatDateOfBirth = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

// Format phone number to Vietnamese format
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as Vietnamese phone number
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

// Format gender to Vietnamese
export const formatGender = (gender: string): string => {
  const genderMap: Record<string, string> = {
    'MALE': 'Nam',
    'FEMALE': 'Nữ',
    'OTHER': 'Khác'
  };
  return genderMap[gender] || gender;
};

// Format status to Vietnamese
export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'ACTIVE': 'Hoạt động',
    'INACTIVE': 'Không hoạt động'
  };
  return statusMap[status] || status;
};

// Format currency to Vietnamese format
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Format date time to Vietnamese format
export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth: string): number => {
  try {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch {
    return 0;
  }
};

// Generate patient code
export const generatePatientCode = (): string => {
  const timestamp = Date.now().toString().slice(-8);
  return `BN${timestamp}`;
};
