let mockTransactions = [
  {
    id: "txn_1",
    type: "income",
    amount: 15000,
    category: "เงินเดือน",
    description: "เงินเดือนประจำเดือนตุลาคม",
    date: "2026-10-01",
    createdAt: "2026-10-01T08:00:00.000Z",
  },
  {
    id: "txn_2",
    type: "expense",
    amount: 320,
    category: "อาหาร",
    description: "ข้าวมันไก่ที่ตลาด",
    date: "2026-10-02",
    createdAt: "2026-10-02T12:30:00.000Z",
  },
  {
    id: "txn_3",
    type: "expense",
    amount: 560,
    category: "เดินทาง",
    description: "ค่าน้ำมัน",
    date: "2026-10-03",
    createdAt: "2026-10-03T08:10:00.000Z",
  },
];

export function getMockTransactions() {
  return [...mockTransactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function appendMockTransaction(transaction: {
  id?: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt?: string;
}) {
  const item = {
    id: transaction.id ?? `txn_${Date.now()}`,
    type: transaction.type,
    amount: Number(transaction.amount),
    category: transaction.category,
    description: transaction.description,
    date: transaction.date,
    createdAt: transaction.createdAt ?? new Date().toISOString(),
  };

  mockTransactions.unshift(item);
  return item;
}

export function summarizeTransactions(transactions: typeof mockTransactions) {
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const expense = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const today = new Date().toISOString().slice(0, 10);
  const todayExpense = transactions
    .filter((item) => item.type === "expense" && item.date === today)
    .reduce((sum, item) => sum + item.amount, 0);

  return {
    totalBalance: income - expense,
    income,
    expense,
    todayExpense,
    monthExpense: expense,
  };
}
