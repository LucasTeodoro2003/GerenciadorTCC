// Este arquivo contém funções para interagir com a API de despesas

// Função para excluir uma despesa
export async function deleteExpense(expenseId: string) {
  try {
    const response = await fetch(`/api/expenses/${expenseId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Falha ao excluir despesa');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao excluir despesa:', error);
    return false;
  }
}

// Função para atualizar uma despesa
export async function updateExpense(expenseId: string, data: any) {
  try {
    const response = await fetch(`/api/expenses/${expenseId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Falha ao atualizar despesa');
    }
    
    const updatedExpense = await response.json();
    return updatedExpense;
  } catch (error) {
    console.error('Erro ao atualizar despesa:', error);
    return null;
  }
}

// Função para criar uma nova despesa
export async function createExpense(data: any) {
  try {
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Falha ao criar despesa');
    }
    
    const newExpense = await response.json();
    return newExpense;
  } catch (error) {
    console.error('Erro ao criar despesa:', error);
    return null;
  }
}