import { FeeTransaction, Payment } from "../types";
import { residents } from "./residents";

export const feeTransactions: FeeTransaction[] = [];
export const payments: Payment[] = [];

// Generate 6 months of fee transactions
const months = [
  { month: "2023-10", dueDate: "2023-10-05" },
  { month: "2023-11", dueDate: "2023-11-05" },
  { month: "2023-12", dueDate: "2023-12-05" },
  { month: "2024-01", dueDate: "2024-01-05" },
  { month: "2024-02", dueDate: "2024-02-05" },
  { month: "2024-03", dueDate: "2024-03-05" },
];

let feeId = 1;
let paymentId = 1;

residents.forEach((resident) => {
  if (resident.status === "checkout") return;

  const joinDate = new Date(resident.joinDate);

  months.forEach(({ month, dueDate }, monthIdx) => {
    const monthDate = new Date(`${month}-01`);
    if (monthDate < joinDate) return;

    // Rent fee
    const rentStatus =
      monthIdx < 4
        ? "paid"
        : monthIdx === 4
        ? Math.random() > 0.3
          ? "paid"
          : "pending"
        : "pending";
    const rentPaidDate =
      rentStatus === "paid"
        ? `${month}-${String(Math.floor(Math.random() * 10) + 1).padStart(
            2,
            "0"
          )}`
        : undefined;

    const rentFee: FeeTransaction = {
      id: `FEE${String(feeId++).padStart(4, "0")}`,
      residentId: resident.id,
      type: "rent",
      amount: resident.monthlyRent,
      month,
      dueDate,
      paidDate: rentPaidDate,
      status:
        monthIdx === 5
          ? "pending"
          : rentStatus === "paid"
          ? "paid"
          : monthIdx < 5
          ? "overdue"
          : "pending",
      paymentMethod:
        rentStatus === "paid"
          ? (["cash", "bank", "online"][Math.floor(Math.random() * 3)] as
              | "cash"
              | "bank"
              | "online")
          : undefined,
      receiptNumber:
        rentStatus === "paid"
          ? `RCP${String(paymentId).padStart(5, "0")}`
          : undefined,
    };
    feeTransactions.push(rentFee);

    if (rentStatus === "paid") {
      payments.push({
        id: `PAY${String(paymentId++).padStart(5, "0")}`,
        residentId: resident.id,
        feeTransactionId: rentFee.id,
        amount: resident.monthlyRent,
        paymentDate: rentPaidDate!,
        paymentMethod: rentFee.paymentMethod!,
        receivedBy: ["E001", "E002", "E003"][Math.floor(Math.random() * 3)],
        receiptNumber: rentFee.receiptNumber!,
      });
    }

    // Mess fee (for ~60% of residents)
    if (Math.random() > 0.4) {
      const messAmount = 8000;
      const messStatus =
        monthIdx < 4
          ? "paid"
          : monthIdx === 4
          ? Math.random() > 0.4
            ? "paid"
            : "pending"
          : "pending";
      const messPaidDate =
        messStatus === "paid"
          ? `${month}-${String(Math.floor(Math.random() * 10) + 5).padStart(
              2,
              "0"
            )}`
          : undefined;

      const messFee: FeeTransaction = {
        id: `FEE${String(feeId++).padStart(4, "0")}`,
        residentId: resident.id,
        type: "mess",
        amount: messAmount,
        month,
        dueDate,
        paidDate: messPaidDate,
        status:
          monthIdx === 5
            ? "pending"
            : messStatus === "paid"
            ? "paid"
            : monthIdx < 5
            ? "overdue"
            : "pending",
        paymentMethod:
          messStatus === "paid"
            ? (["cash", "bank", "online"][Math.floor(Math.random() * 3)] as
                | "cash"
                | "bank"
                | "online")
            : undefined,
        receiptNumber:
          messStatus === "paid"
            ? `RCP${String(paymentId).padStart(5, "0")}`
            : undefined,
      };
      feeTransactions.push(messFee);

      if (messStatus === "paid") {
        payments.push({
          id: `PAY${String(paymentId++).padStart(5, "0")}`,
          residentId: resident.id,
          feeTransactionId: messFee.id,
          amount: messAmount,
          paymentDate: messPaidDate!,
          paymentMethod: messFee.paymentMethod!,
          receivedBy: ["E001", "E002", "E003"][Math.floor(Math.random() * 3)],
          receiptNumber: messFee.receiptNumber!,
        });
      }
    }

    // Utility fee (quarterly)
    if (monthIdx % 3 === 0) {
      const utilityAmount = Math.floor(Math.random() * 2000) + 1000;
      const utilityStatus = monthIdx < 3 ? "paid" : "pending";
      const utilityPaidDate =
        utilityStatus === "paid" ? `${month}-15` : undefined;

      const utilityFee: FeeTransaction = {
        id: `FEE${String(feeId++).padStart(4, "0")}`,
        residentId: resident.id,
        type: "utility",
        amount: utilityAmount,
        month,
        dueDate: `${month}-15`,
        paidDate: utilityPaidDate,
        status: utilityStatus,
        paymentMethod: utilityStatus === "paid" ? "cash" : undefined,
        receiptNumber:
          utilityStatus === "paid"
            ? `RCP${String(paymentId).padStart(5, "0")}`
            : undefined,
      };
      feeTransactions.push(utilityFee);

      if (utilityStatus === "paid") {
        payments.push({
          id: `PAY${String(paymentId++).padStart(5, "0")}`,
          residentId: resident.id,
          feeTransactionId: utilityFee.id,
          amount: utilityAmount,
          paymentDate: utilityPaidDate!,
          paymentMethod: "cash",
          receivedBy: "E003",
          receiptNumber: utilityFee.receiptNumber!,
        });
      }
    }
  });

  // Security deposit (once)
  if (resident.securityDeposit > 0) {
    const securityFee: FeeTransaction = {
      id: `FEE${String(feeId++).padStart(4, "0")}`,
      residentId: resident.id,
      type: "security",
      amount: resident.securityDeposit,
      month: resident.joinDate.substring(0, 7),
      dueDate: resident.joinDate,
      paidDate: resident.joinDate,
      status: "paid",
      paymentMethod: "cash",
      receiptNumber: `RCP${String(paymentId).padStart(5, "0")}`,
    };
    feeTransactions.push(securityFee);

    payments.push({
      id: `PAY${String(paymentId++).padStart(5, "0")}`,
      residentId: resident.id,
      feeTransactionId: securityFee.id,
      amount: resident.securityDeposit,
      paymentDate: resident.joinDate,
      paymentMethod: "cash",
      receivedBy: "E001",
      receiptNumber: securityFee.receiptNumber!,
    });
  }
});

export const getFeesByResident = (residentId: string): FeeTransaction[] => {
  return feeTransactions.filter((f) => f.residentId === residentId);
};

export const getPendingFees = (): FeeTransaction[] => {
  return feeTransactions.filter(
    (f) => f.status === "pending" || f.status === "overdue"
  );
};

export const getOverdueFees = (): FeeTransaction[] => {
  return feeTransactions.filter((f) => f.status === "overdue");
};

export const getFeesByMonth = (month: string): FeeTransaction[] => {
  return feeTransactions.filter((f) => f.month === month);
};

export const getTotalPendingAmount = (): number => {
  return feeTransactions
    .filter((f) => f.status === "pending" || f.status === "overdue")
    .reduce((sum, f) => sum + f.amount, 0);
};

export const getTotalCollectedByMonth = (month: string): number => {
  return feeTransactions
    .filter((f) => f.month === month && f.status === "paid")
    .reduce((sum, f) => sum + f.amount, 0);
};

export const getMonthlyFeeStats = () => {
  const stats: {
    [key: string]: { collected: number; pending: number; overdue: number };
  } = {};

  feeTransactions.forEach((fee) => {
    if (!stats[fee.month]) {
      stats[fee.month] = { collected: 0, pending: 0, overdue: 0 };
    }
    if (fee.status === "paid") {
      stats[fee.month].collected += fee.amount;
    } else if (fee.status === "pending") {
      stats[fee.month].pending += fee.amount;
    } else if (fee.status === "overdue") {
      stats[fee.month].overdue += fee.amount;
    }
  });

  return stats;
};
