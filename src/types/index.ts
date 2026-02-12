// Resident Types
export interface Resident {
  id: string;
  name: string;
  fatherName: string;
  cnic: string;
  phone: string;
  emergencyContact: string;
  email?: string;
  address: string;
  city: string;
  occupation: string;
  workplace?: string;
  roomId: string;
  bedNumber: number;
  joinDate: string;
  status: 'active' | 'inactive' | 'checkout';
  securityDeposit: number;
  monthlyRent: number;
  photo?: string;
  documents?: string[];
  notes?: string;
}

// Room Types
export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  type: 'single' | 'double' | 'triple' | 'quad' | 'dormitory';
  capacity: number;
  occupiedBeds: number;
  monthlyRent: number;
  hasAC: boolean;
  hasAttachedBath: boolean;
  status: 'available' | 'full' | 'maintenance';
  amenities: string[];
}

export interface Bed {
  id: string;
  roomId: string;
  bedNumber: number;
  residentId?: string;
  status: 'vacant' | 'occupied' | 'reserved';
}

// Employee Types
export interface Employee {
  id: string;
  name: string;
  fatherName: string;
  cnic: string;
  phone: string;
  address: string;
  role: 'manager' | 'warden' | 'cook' | 'cleaner' | 'security' | 'accountant' | 'maintenance';
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive';
  bankAccount?: string;
  photo?: string;
}

export interface LeaveRecord {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: 'casual' | 'sick' | 'annual' | 'unpaid';
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  month: string;
  baseSalary: number;
  deductions: number;
  bonus: number;
  netSalary: number;
  paidDate?: string;
  status: 'pending' | 'paid';
}

// Fee Types
export interface FeeTransaction {
  id: string;
  residentId: string;
  type: 'rent' | 'security' | 'mess' | 'utility' | 'other';
  amount: number;
  month: string;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paymentMethod?: 'cash' | 'bank' | 'online' | 'cheque';
  receiptNumber?: string;
  notes?: string;
}

export interface Payment {
  id: string;
  residentId: string;
  feeTransactionId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'bank' | 'online' | 'cheque';
  receivedBy: string;
  receiptNumber: string;
  notes?: string;
}

// Expense Types
export interface Expense {
  id: string;
  category: 'utility' | 'maintenance' | 'salary' | 'mess' | 'supplies' | 'rent' | 'other';
  subcategory?: string;
  description: string;
  amount: number;
  date: string;
  paidTo: string;
  paymentMethod: 'cash' | 'bank' | 'online' | 'cheque';
  receiptNumber?: string;
  approvedBy?: string;
  notes?: string;
}

// Mess Types
export interface MessExpense {
  id: string;
  date: string;
  category: 'grocery' | 'vegetables' | 'meat' | 'dairy' | 'gas' | 'other';
  description: string;
  amount: number;
  vendor: string;
  paidBy: string;
}

export interface MessMember {
  id: string;
  residentId: string;
  joinDate: string;
  status: 'active' | 'inactive';
  mealType: 'full' | 'lunch' | 'dinner';
}

// Notification Types
export interface Notification {
  id: string;
  type: 'fee_reminder' | 'payment_confirmation' | 'announcement' | 'alert';
  title: string;
  message: string;
  recipientId?: string;
  recipientPhone?: string;
  channel: 'sms' | 'whatsapp' | 'both';
  status: 'pending' | 'sent' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'fee_reminder' | 'payment_confirmation' | 'announcement' | 'alert';
  messageTemplate: string;
  channel: 'sms' | 'whatsapp' | 'both';
  isActive: boolean;
}

// Settings Types
export interface SystemSettings {
  hostelName: string;
  hostelNameUrdu: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  currency: string;
  dateFormat: string;
  language: 'en' | 'ur';
  feeGenerationDay: number;
  lateFeePercentage: number;
  securityDepositMonths: number;
}

// Dashboard Types
export interface DashboardStats {
  totalResidents: number;
  activeResidents: number;
  totalRooms: number;
  occupancyRate: number;
  totalRevenue: number;
  pendingFees: number;
  totalExpenses: number;
  netIncome: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

// User Types
export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  email: string;
  phone: string;
  lastLogin?: string;
  isActive: boolean;
}

// Report Types
export interface ReportFilter {
  startDate: string;
  endDate: string;
  type?: string;
  status?: string;
}
