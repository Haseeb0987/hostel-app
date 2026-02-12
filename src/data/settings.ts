import { SystemSettings, User } from "../types";

export const systemSettings: SystemSettings = {
  hostelName: "Al-Noor Boys Hostel",
  hostelNameUrdu: "النور بوائز ہاسٹل",
  address: "House 45, Block C, Model Town, Lahore",
  phone: "0300-1234567",
  email: "info@alnoorhostel.pk",
  currency: "PKR",
  dateFormat: "DD/MM/YYYY",
  language: "en",
  feeGenerationDay: 1,
  lateFeePercentage: 5,
  securityDepositMonths: 2,
};

export const users: User[] = [
  {
    id: "U001",
    username: "admin",
    name: "Muhammad Aslam",
    role: "admin",
    email: "admin@alnoorhostel.pk",
    phone: "0300-1234567",
    lastLogin: "2024-03-15T09:30:00",
    isActive: true,
  },
  {
    id: "U002",
    username: "manager",
    name: "Akbar Ali",
    role: "manager",
    email: "manager@alnoorhostel.pk",
    phone: "0301-2345678",
    lastLogin: "2024-03-14T14:20:00",
    isActive: true,
  },
  {
    id: "U003",
    username: "accountant",
    name: "Nasreen Bibi",
    role: "staff",
    email: "accounts@alnoorhostel.pk",
    phone: "0302-3456789",
    lastLogin: "2024-03-15T08:45:00",
    isActive: true,
  },
  {
    id: "U004",
    username: "warden",
    name: "Sultan Ahmed",
    role: "staff",
    email: "warden@alnoorhostel.pk",
    phone: "0303-4567890",
    lastLogin: "2024-03-13T22:10:00",
    isActive: true,
  },
];

export const expenseCategories = [
  { id: "utility", name: "Utilities", nameUrdu: "یوٹیلیٹیز" },
  { id: "maintenance", name: "Maintenance", nameUrdu: "مرمت" },
  { id: "salary", name: "Salaries", nameUrdu: "تنخواہیں" },
  { id: "mess", name: "Mess", nameUrdu: "کھانا" },
  { id: "supplies", name: "Supplies", nameUrdu: "سامان" },
  { id: "rent", name: "Building Rent", nameUrdu: "عمارت کرایہ" },
  { id: "other", name: "Other", nameUrdu: "دیگر" },
];

export const roomTypes = [
  { id: "single", name: "Single", capacity: 1 },
  { id: "double", name: "Double", capacity: 2 },
  { id: "triple", name: "Triple", capacity: 3 },
  { id: "quad", name: "Quad", capacity: 4 },
  { id: "dormitory", name: "Dormitory", capacity: 8 },
];

export const employeeRoles = [
  { id: "manager", name: "Manager", nameUrdu: "مینیجر" },
  { id: "warden", name: "Warden", nameUrdu: "وارڈن" },
  { id: "accountant", name: "Accountant", nameUrdu: "اکاؤنٹنٹ" },
  { id: "cook", name: "Cook", nameUrdu: "باورچی" },
  { id: "cleaner", name: "Cleaner", nameUrdu: "صفائی کرنے والا" },
  { id: "security", name: "Security Guard", nameUrdu: "سیکیورٹی گارڈ" },
  { id: "maintenance", name: "Maintenance", nameUrdu: "مرمت کار" },
];

export const paymentMethods = [
  { id: "cash", name: "Cash", nameUrdu: "نقد" },
  { id: "bank", name: "Bank Transfer", nameUrdu: "بینک ٹرانسفر" },
  { id: "online", name: "Online Payment", nameUrdu: "آن لائن ادائیگی" },
  { id: "cheque", name: "Cheque", nameUrdu: "چیک" },
];

export const getCurrentUser = (): User => {
  return users[0]; // Return admin for demo
};

export const getUserById = (id: string): User | undefined => {
  return users.find((u) => u.id === id);
};
