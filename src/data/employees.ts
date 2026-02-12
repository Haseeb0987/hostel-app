import { Employee, LeaveRecord, SalaryRecord } from "../types";

export const employees: Employee[] = [
  {
    id: "E001",
    name: "Muhammad Aslam",
    fatherName: "Abdul Rashid",
    cnic: "35201-9876543-1",
    phone: "0300-9876543",
    address: "House 12, Shahdara, Lahore",
    role: "manager",
    salary: 80000,
    joinDate: "2020-01-15",
    status: "active",
    bankAccount: "HBL-1234567890",
  },
  {
    id: "E002",
    name: "Akbar Ali",
    fatherName: "Bashir Ahmed",
    cnic: "35202-8765432-3",
    phone: "0301-8765432",
    address: "House 34, Township, Lahore",
    role: "warden",
    salary: 45000,
    joinDate: "2021-03-01",
    status: "active",
    bankAccount: "MCB-2345678901",
  },
  {
    id: "E003",
    name: "Nasreen Bibi",
    fatherName: "Chand Khan",
    cnic: "35203-7654321-5",
    phone: "0302-7654321",
    address: "Flat 56, Samnabad, Lahore",
    role: "accountant",
    salary: 55000,
    joinDate: "2020-06-15",
    status: "active",
    bankAccount: "UBL-3456789012",
  },
  {
    id: "E004",
    name: "Riaz Ahmed",
    fatherName: "Dawood Khan",
    cnic: "35204-6543210-7",
    phone: "0303-6543210",
    address: "House 78, Badami Bagh, Lahore",
    role: "cook",
    salary: 35000,
    joinDate: "2022-01-10",
    status: "active",
  },
  {
    id: "E005",
    name: "Shabbir Hussain",
    fatherName: "Ehsan Ali",
    cnic: "35205-5432109-9",
    phone: "0304-5432109",
    address: "House 90, Misri Shah, Lahore",
    role: "cook",
    salary: 30000,
    joinDate: "2022-08-20",
    status: "active",
  },
  {
    id: "E006",
    name: "Saima Khatoon",
    fatherName: "Farhan Ali",
    cnic: "35206-4321098-1",
    phone: "0305-4321098",
    address: "Flat 23, Model Town, Lahore",
    role: "cleaner",
    salary: 25000,
    joinDate: "2021-11-05",
    status: "active",
  },
  {
    id: "E007",
    name: "Amina Begum",
    fatherName: "Ghulam Mustafa",
    cnic: "35207-3210987-3",
    phone: "0306-3210987",
    address: "House 45, Ichra, Lahore",
    role: "cleaner",
    salary: 25000,
    joinDate: "2023-02-15",
    status: "active",
  },
  {
    id: "E008",
    name: "Iqbal Khan",
    fatherName: "Habib Khan",
    cnic: "35208-2109876-5",
    phone: "0307-2109876",
    address: "House 67, Shahdara, Lahore",
    role: "security",
    salary: 28000,
    joinDate: "2020-09-01",
    status: "active",
  },
  {
    id: "E009",
    name: "Zahid Mehmood",
    fatherName: "Irfan Mehmood",
    cnic: "35209-1098765-7",
    phone: "0308-1098765",
    address: "House 89, Baghbanpura, Lahore",
    role: "security",
    salary: 28000,
    joinDate: "2021-05-20",
    status: "active",
  },
  {
    id: "E010",
    name: "Khalid Mahmood",
    fatherName: "Javed Mahmood",
    cnic: "35210-0987654-9",
    phone: "0309-0987654",
    address: "House 12, Nawankot, Lahore",
    role: "security",
    salary: 26000,
    joinDate: "2022-04-10",
    status: "active",
  },
  {
    id: "E011",
    name: "Liaqat Ali",
    fatherName: "Kamal Din",
    cnic: "35211-9876543-1",
    phone: "0310-9876543",
    address: "Flat 34, Shah Jamal, Lahore",
    role: "maintenance",
    salary: 32000,
    joinDate: "2021-08-15",
    status: "active",
  },
  {
    id: "E012",
    name: "Munir Ahmed",
    fatherName: "Latif Ahmed",
    cnic: "35212-8765432-3",
    phone: "0311-8765432",
    address: "House 56, Mozang, Lahore",
    role: "maintenance",
    salary: 30000,
    joinDate: "2023-01-05",
    status: "active",
  },
  {
    id: "E013",
    name: "Perveen Akhtar",
    fatherName: "Muhammad Akhtar",
    cnic: "35213-7654321-5",
    phone: "0312-7654321",
    address: "House 78, Anarkali, Lahore",
    role: "cleaner",
    salary: 22000,
    joinDate: "2022-06-20",
    status: "active",
  },
  {
    id: "E014",
    name: "Rashid Khan",
    fatherName: "Nasir Khan",
    cnic: "35214-6543210-7",
    phone: "0313-6543210",
    address: "House 90, Data Darbar Road, Lahore",
    role: "cook",
    salary: 28000,
    joinDate: "2023-03-10",
    status: "active",
  },
  {
    id: "E015",
    name: "Sultan Ahmed",
    fatherName: "Omer Ahmed",
    cnic: "35215-5432109-9",
    phone: "0314-5432109",
    address: "Flat 23, Garhi Shahu, Lahore",
    role: "warden",
    salary: 40000,
    joinDate: "2022-09-15",
    status: "active",
    bankAccount: "ABL-4567890123",
  },
  {
    id: "E016",
    name: "Tariq Mehmood",
    fatherName: "Pervaiz Mehmood",
    cnic: "35216-4321098-1",
    phone: "0315-4321098",
    address: "House 45, Begumpura, Lahore",
    role: "security",
    salary: 26000,
    joinDate: "2023-05-01",
    status: "active",
  },
  {
    id: "E017",
    name: "Usman Ghani",
    fatherName: "Qasim Ghani",
    cnic: "35217-3210987-3",
    phone: "0316-3210987",
    address: "House 67, Ravi Road, Lahore",
    role: "maintenance",
    salary: 28000,
    joinDate: "2022-12-20",
    status: "inactive",
  },
  {
    id: "E018",
    name: "Waqar Ahmed",
    fatherName: "Rafiq Ahmed",
    cnic: "35218-2109876-5",
    phone: "0317-2109876",
    address: "House 89, Shadbagh, Lahore",
    role: "cleaner",
    salary: 20000,
    joinDate: "2023-07-10",
    status: "active",
  },
  {
    id: "E019",
    name: "Yasir Iqbal",
    fatherName: "Shahid Iqbal",
    cnic: "35219-1098765-7",
    phone: "0318-1098765",
    address: "Flat 12, Green Town, Lahore",
    role: "security",
    salary: 25000,
    joinDate: "2024-01-15",
    status: "active",
  },
  {
    id: "E020",
    name: "Zeeshan Ali",
    fatherName: "Tanveer Ali",
    cnic: "35220-0987654-9",
    phone: "0319-0987654",
    address: "House 34, Wahdat Colony, Lahore",
    role: "cook",
    salary: 25000,
    joinDate: "2024-02-01",
    status: "active",
  },
];

export const leaveRecords: LeaveRecord[] = [
  {
    id: "L001",
    employeeId: "E004",
    startDate: "2024-01-15",
    endDate: "2024-01-17",
    type: "sick",
    status: "approved",
    reason: "Fever and flu",
  },
  {
    id: "L002",
    employeeId: "E006",
    startDate: "2024-01-20",
    endDate: "2024-01-20",
    type: "casual",
    status: "approved",
    reason: "Personal work",
  },
  {
    id: "L003",
    employeeId: "E008",
    startDate: "2024-02-05",
    endDate: "2024-02-07",
    type: "annual",
    status: "approved",
    reason: "Family function",
  },
  {
    id: "L004",
    employeeId: "E002",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    type: "sick",
    status: "approved",
    reason: "Back pain",
  },
  {
    id: "L005",
    employeeId: "E011",
    startDate: "2024-02-15",
    endDate: "2024-02-15",
    type: "casual",
    status: "approved",
    reason: "Doctor appointment",
  },
  {
    id: "L006",
    employeeId: "E003",
    startDate: "2024-03-01",
    endDate: "2024-03-05",
    type: "annual",
    status: "approved",
    reason: "Wedding in family",
  },
  {
    id: "L007",
    employeeId: "E007",
    startDate: "2024-03-10",
    endDate: "2024-03-10",
    type: "casual",
    status: "approved",
    reason: "Child school meeting",
  },
  {
    id: "L008",
    employeeId: "E009",
    startDate: "2024-03-15",
    endDate: "2024-03-18",
    type: "sick",
    status: "approved",
    reason: "Dengue fever",
  },
  {
    id: "L009",
    employeeId: "E014",
    startDate: "2024-03-20",
    endDate: "2024-03-21",
    type: "casual",
    status: "pending",
    reason: "Personal emergency",
  },
  {
    id: "L010",
    employeeId: "E010",
    startDate: "2024-04-01",
    endDate: "2024-04-03",
    type: "annual",
    status: "pending",
    reason: "Eid holidays",
  },
];

export const salaryRecords: SalaryRecord[] = [];

// Generate salary records for the last 6 months
const months = [
  "2023-10",
  "2023-11",
  "2023-12",
  "2024-01",
  "2024-02",
  "2024-03",
];
let salaryId = 1;

employees.forEach((emp) => {
  months.forEach((month, idx) => {
    const deductions =
      Math.random() > 0.8 ? Math.floor(Math.random() * 3000) : 0;
    const bonus =
      idx === 5 && Math.random() > 0.7 ? Math.floor(emp.salary * 0.1) : 0; // Occasional bonus
    salaryRecords.push({
      id: `SAL${String(salaryId++).padStart(3, "0")}`,
      employeeId: emp.id,
      month,
      baseSalary: emp.salary,
      deductions,
      bonus,
      netSalary: emp.salary - deductions + bonus,
      paidDate: idx < 5 ? `${month}-28` : undefined,
      status: idx < 5 ? "paid" : "pending",
    });
  });
});

export const getEmployeeById = (id: string): Employee | undefined => {
  return employees.find((e) => e.id === id);
};

export const getActiveEmployees = (): Employee[] => {
  return employees.filter((e) => e.status === "active");
};

export const getEmployeesByRole = (role: string): Employee[] => {
  return employees.filter((e) => e.role === role);
};

export const getEmployeeLeaves = (employeeId: string): LeaveRecord[] => {
  return leaveRecords.filter((l) => l.employeeId === employeeId);
};

export const getEmployeeSalaries = (employeeId: string): SalaryRecord[] => {
  return salaryRecords.filter((s) => s.employeeId === employeeId);
};

export const getTotalMonthlySalary = (): number => {
  return employees
    .filter((e) => e.status === "active")
    .reduce((sum, e) => sum + e.salary, 0);
};
