"use client"

import TableExpense, { TableExpenseProps } from "@/features/actions/expense/page_client";

export default function ExpensePageClient({ expenses, user }: TableExpenseProps) {
  console.log("DESPESAS", expenses);
  return <TableExpense expenses={expenses} user={user} />;
}
