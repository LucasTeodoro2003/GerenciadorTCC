export interface Expense {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  status: 'pago' | 'pendente';
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseFormData {
  descricao: string;
  valor: string;
  data: string;
  categoria: string;
  status: 'pago' | 'pendente';
}

export const EXPENSE_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Casa',
  'Roupas',
  'Tecnologia',
  'Outros'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];