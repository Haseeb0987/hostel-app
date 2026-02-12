import { Notification, NotificationTemplate } from "../types";

export const notificationTemplates: NotificationTemplate[] = [
  {
    id: "TPL001",
    name: "Fee Reminder",
    type: "fee_reminder",
    messageTemplate:
      "Dear {name}, your rent of PKR {amount} for {month} is due. Please pay by {dueDate} to avoid late fee. Contact: 0300-1234567",
    channel: "sms",
    isActive: true,
  },
  {
    id: "TPL002",
    name: "Fee Reminder (Urdu)",
    type: "fee_reminder",
    messageTemplate:
      "محترم {name}، آپ کا {month} کا کرایہ {amount} روپے واجب الادا ہے۔ براہ کرم {dueDate} تک ادائیگی کریں۔ رابطہ: 0300-1234567",
    channel: "whatsapp",
    isActive: true,
  },
  {
    id: "TPL003",
    name: "Payment Confirmation",
    type: "payment_confirmation",
    messageTemplate:
      "Thank you {name}! Payment of PKR {amount} received for {month}. Receipt: {receiptNumber}. Al-Noor Hostel",
    channel: "sms",
    isActive: true,
  },
  {
    id: "TPL004",
    name: "Payment Confirmation (Urdu)",
    type: "payment_confirmation",
    messageTemplate:
      "شکریہ {name}! {month} کی {amount} روپے کی ادائیگی موصول ہوئی۔ رسید نمبر: {receiptNumber}۔ النور ہاسٹل",
    channel: "whatsapp",
    isActive: true,
  },
  {
    id: "TPL005",
    name: "Overdue Notice",
    type: "fee_reminder",
    messageTemplate:
      "URGENT: {name}, your payment of PKR {amount} is {days} days overdue. Please pay immediately to avoid service disruption. Contact: 0300-1234567",
    channel: "both",
    isActive: true,
  },
  {
    id: "TPL006",
    name: "General Announcement",
    type: "announcement",
    messageTemplate:
      "Al-Noor Hostel Notice: {message}. For queries contact management.",
    channel: "whatsapp",
    isActive: true,
  },
  {
    id: "TPL007",
    name: "Maintenance Alert",
    type: "alert",
    messageTemplate:
      "Dear Residents, {message}. We apologize for any inconvenience. - Management",
    channel: "both",
    isActive: true,
  },
  {
    id: "TPL008",
    name: "Welcome Message",
    type: "announcement",
    messageTemplate:
      "Welcome to Al-Noor Hostel, {name}! Your room is {roomNumber}. For any assistance, contact warden at 0300-1234567. WiFi: AlNoor2024",
    channel: "whatsapp",
    isActive: true,
  },
];

export const notifications: Notification[] = [
  // Recent notifications
  {
    id: "NOT001",
    type: "fee_reminder",
    title: "Rent Reminder - March 2024",
    message:
      "Dear Ahmed Khan, your rent of PKR 15,000 for March 2024 is due. Please pay by 2024-03-05 to avoid late fee.",
    recipientId: "R001",
    recipientPhone: "0300-1234567",
    channel: "sms",
    status: "sent",
    scheduledAt: "2024-03-01",
    sentAt: "2024-03-01",
  },
  {
    id: "NOT002",
    type: "fee_reminder",
    title: "Rent Reminder - March 2024",
    message:
      "Dear Ali Hassan, your rent of PKR 15,000 for March 2024 is due. Please pay by 2024-03-05 to avoid late fee.",
    recipientId: "R002",
    recipientPhone: "0301-2345678",
    channel: "sms",
    status: "sent",
    scheduledAt: "2024-03-01",
    sentAt: "2024-03-01",
  },
  {
    id: "NOT003",
    type: "payment_confirmation",
    title: "Payment Received",
    message:
      "Thank you Ahmed Khan! Payment of PKR 15,000 received for March 2024. Receipt: RCP00125",
    recipientId: "R001",
    recipientPhone: "0300-1234567",
    channel: "sms",
    status: "sent",
    sentAt: "2024-03-03",
  },
  {
    id: "NOT004",
    type: "announcement",
    title: "Water Supply Interruption",
    message:
      "Al-Noor Hostel Notice: Water supply will be interrupted on March 10 from 10 AM to 2 PM for tank cleaning. Please store water accordingly.",
    channel: "whatsapp",
    status: "sent",
    sentAt: "2024-03-08",
  },
  {
    id: "NOT005",
    type: "fee_reminder",
    title: "Overdue Notice",
    message:
      "URGENT: Bilal Ahmed, your payment of PKR 12,000 is 5 days overdue. Please pay immediately.",
    recipientId: "R004",
    recipientPhone: "0303-4567890",
    channel: "both",
    status: "sent",
    sentAt: "2024-03-10",
  },
  {
    id: "NOT006",
    type: "alert",
    title: "Generator Maintenance",
    message:
      "Dear Residents, Generator maintenance scheduled for March 15. Backup power may be unavailable for 2 hours.",
    channel: "both",
    status: "pending",
    scheduledAt: "2024-03-14",
  },
  {
    id: "NOT007",
    type: "fee_reminder",
    title: "Mess Fee Reminder",
    message:
      "Dear Usman Malik, your mess fee of PKR 8,000 for March 2024 is pending. Please pay at your earliest.",
    recipientId: "R003",
    recipientPhone: "0302-3456789",
    channel: "sms",
    status: "pending",
    scheduledAt: "2024-03-15",
  },
  {
    id: "NOT008",
    type: "announcement",
    title: "Ramadan Timing",
    message:
      "Al-Noor Hostel Notice: Mess timings during Ramadan - Sehri: 4:00 AM, Iftar: 6:30 PM. Management wishes you blessed Ramadan.",
    channel: "whatsapp",
    status: "sent",
    sentAt: "2024-03-11",
  },
  {
    id: "NOT009",
    type: "fee_reminder",
    title: "Rent Reminder - Bulk",
    message: "Bulk reminder sent to 15 residents for March rent.",
    channel: "sms",
    status: "sent",
    sentAt: "2024-03-05",
  },
  {
    id: "NOT010",
    type: "alert",
    title: "Internet Maintenance",
    message:
      "Dear Residents, Internet service will be upgraded on March 20. Brief interruption expected between 2-4 PM.",
    channel: "whatsapp",
    status: "pending",
    scheduledAt: "2024-03-19",
  },
];

export const getNotificationsByStatus = (status: string): Notification[] => {
  return notifications.filter((n) => n.status === status);
};

export const getNotificationsByType = (type: string): Notification[] => {
  return notifications.filter((n) => n.type === type);
};

export const getNotificationsByResident = (
  residentId: string
): Notification[] => {
  return notifications.filter((n) => n.recipientId === residentId);
};

export const getActiveTemplates = (): NotificationTemplate[] => {
  return notificationTemplates.filter((t) => t.isActive);
};

export const getTemplatesByType = (type: string): NotificationTemplate[] => {
  return notificationTemplates.filter((t) => t.type === type);
};
