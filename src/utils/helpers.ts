import {
  format,
  parseISO,
  differenceInDays,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from "date-fns";

// Currency formatting
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("PKR", "Rs.");
};

export const formatCurrencyShort = (amount: number): string => {
  if (amount >= 1000000) {
    return `Rs. ${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 100000) {
    return `Rs. ${(amount / 1000).toFixed(0)}K`;
  } else if (amount >= 1000) {
    return `Rs. ${(amount / 1000).toFixed(1)}K`;
  }
  return `Rs. ${amount}`;
};

// Date formatting
export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), "dd/MM/yyyy");
  } catch {
    return dateString;
  }
};

export const formatDateLong = (dateString: string): string => {
  try {
    return format(parseISO(dateString), "dd MMM yyyy");
  } catch {
    return dateString;
  }
};

export const formatMonth = (monthString: string): string => {
  try {
    return format(parseISO(`${monthString}-01`), "MMMM yyyy");
  } catch {
    return monthString;
  }
};

export const formatMonthShort = (monthString: string): string => {
  try {
    return format(parseISO(`${monthString}-01`), "MMM yyyy");
  } catch {
    return monthString;
  }
};

export const getDaysOverdue = (dueDate: string): number => {
  try {
    return differenceInDays(new Date(), parseISO(dueDate));
  } catch {
    return 0;
  }
};

// Phone formatting
export const formatPhone = (phone: string): string => {
  return phone.replace(/(\d{4})(\d{7})/, "$1-$2");
};

// CNIC formatting
export const formatCNIC = (cnic: string): string => {
  return cnic.replace(/(\d{5})(\d{7})(\d{1})/, "$1-$2-$3");
};

// Status helpers
export const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    active: "success",
    inactive: "secondary",
    checkout: "warning",
    available: "success",
    full: "danger",
    maintenance: "warning",
    paid: "success",
    pending: "warning",
    overdue: "danger",
    partial: "info",
    approved: "success",
    rejected: "danger",
    sent: "success",
    failed: "danger",
  };
  return colors[status] || "secondary";
};

export const getStatusLabel = (status: string): string => {
  const labels: { [key: string]: string } = {
    active: "Active",
    inactive: "Inactive",
    checkout: "Checked Out",
    available: "Available",
    full: "Full",
    maintenance: "Under Maintenance",
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue",
    partial: "Partial",
    approved: "Approved",
    rejected: "Rejected",
    sent: "Sent",
    failed: "Failed",
  };
  return labels[status] || status;
};

// Generate receipt number
export const generateReceiptNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RCP-${timestamp}-${random}`;
};

// Generate ID
export const generateId = (prefix: string): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}${timestamp}`;
};

// Search helper
export const searchInObject = (
  obj: Record<string, unknown>,
  searchTerm: string
): boolean => {
  const term = searchTerm.toLowerCase();
  return Object.values(obj).some((value) => {
    if (typeof value === "string") {
      return value.toLowerCase().includes(term);
    }
    if (typeof value === "number") {
      return value.toString().includes(term);
    }
    return false;
  });
};

// Date range helpers
export const isInDateRange = (
  date: string,
  startDate: string,
  endDate: string
): boolean => {
  try {
    const d = parseISO(date);
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    return isWithinInterval(d, { start, end });
  } catch {
    return false;
  }
};

export const getMonthDateRange = (monthString: string) => {
  const date = parseISO(`${monthString}-01`);
  return {
    start: format(startOfMonth(date), "yyyy-MM-dd"),
    end: format(endOfMonth(date), "yyyy-MM-dd"),
  };
};

// Export helpers (simulation)
export const exportToExcel = (data: unknown[], filename: string) => {
  console.log(`Exporting ${filename} to Excel...`, data);
  alert(
    `Export to Excel: ${filename}\n\nIn production, this would download an Excel file with ${
      Array.isArray(data) ? data.length : 0
    } records.`
  );
};

export const exportToPDF = (data: unknown[], filename: string) => {
  console.log(`Exporting ${filename} to PDF...`, data);
  alert(
    `Export to PDF: ${filename}\n\nIn production, this would download a PDF file.`
  );
};

export const printReceipt = (receiptData: unknown) => {
  console.log("Printing receipt...", receiptData);
  window.print();
};

// Calculation helpers
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};
