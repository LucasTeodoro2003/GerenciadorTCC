"use client"

import TableExpense, { TableExpenseProps } from "@/features/actions/expense/page_client";

export default function ExpensePageClient({ expenses, user }: TableExpenseProps) {
  return <TableExpense expenses={expenses} user={user} />;
}
