const mockTransactions = [
  {
    id: "txn_1",
    type: "income",
    amount: 15000,
    category: "เงินเดือน",
    description: "เงินเดือน",
    date: "2026-10-01",
    createdAt: "2026-10-01T08:00:00.000Z",
  },
  {
    id: "txn_2",
    type: "expense",
    amount: 320,
    category: "อาหาร",
    description: "ข้าวมันไก่",
    date: "2026-10-02",
    createdAt: "2026-10-02T12:30:00.000Z",
  },
  {
    id: "txn_3",
    type: "expense",
    amount: 560,
    category: "เดินทาง",
    description: "ค่าอุบล",
    date: "2026-10-03",
    createdAt: "2026-10-03T08:10:00.000Z",
  },
  {
    id: "txn_4",
    type: "expense",
    amount: 150,
    category: "เครื่องดื่ม",
    description: "กาแฟ",
    date: "2026-10-04",
    createdAt: "2026-10-04T11:15:00.000Z",
  },
];

export function getMockTransactions() {
  return mockTransactions;
}

export function summarizeTransactions(transactions: typeof mockTransactions) {
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const expense = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const todayExpense = transactions
    .filter((item) => item.type === "expense" && item.date === new Date().toISOString().slice(0, 10))
    .reduce((sum, item) => sum + item.amount, 0);

  return {
    totalBalance: income - expense,
    income,
    expense,
    todayExpense,
    monthExpense: expense,
  };
}
