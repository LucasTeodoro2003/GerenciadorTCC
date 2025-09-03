# Página de Despesas - Documentação

## Visão Geral

A página de despesas é uma nova funcionalidade implementada no sistema de gerenciamento, oferecendo aos usuários a capacidade de gerenciar suas despesas de forma completa e intuitiva.

## Funcionalidades Implementadas

### 🏠 Página Principal
- Interface limpa e moderna seguindo o padrão visual do projeto
- Layout responsivo para diferentes tamanhos de tela
- Integração completa com a sidebar existente

### 📊 Dashboard de Estatísticas
- **Total de Despesas**: Valor total de todas as despesas
- **Despesas Pagas**: Valor e quantidade de despesas pagas (verde)
- **Despesas Pendentes**: Valor e quantidade de despesas pendentes (laranja)

### 📋 Gerenciamento de Despesas
- **Visualizar**: Tabela completa com todas as despesas
- **Adicionar**: Modal para criar novas despesas
- **Editar**: Modal para atualizar despesas existentes
- **Excluir**: Dialog de confirmação para remoção segura

### 🔍 Filtros e Busca
- **Busca por texto**: Filtrar por descrição ou categoria
- **Filtro por status**: Pago, Pendente ou Todos
- **Filtro por categoria**: Categorias predefinidas ou todas

### 📱 Responsividade
- Layout adaptativo para desktop, tablet e mobile
- Tabela com scroll horizontal em telas pequenas
- Filtros empilhados verticalmente em mobile

### 🗂️ Categorias Disponíveis
- Alimentação
- Transporte
- Saúde
- Educação
- Lazer
- Casa
- Roupas
- Tecnologia
- Outros

## Estrutura de Dados

### Interface Expense
```typescript
interface Expense {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  status: 'pago' | 'pendente';
  createdAt?: string;
  updatedAt?: string;
}
```

### Interface ExpenseFormData
```typescript
interface ExpenseFormData {
  descricao: string;
  valor: string;
  data: string;
  categoria: string;
  status: 'pago' | 'pendente';
}
```

## Navegação

A página de despesas é acessível através da sidebar na seção "Página Inicial" > "Despesas". A URL utiliza parâmetros de busca: `?page=despesas`

## Componentes Utilizados

### Shadcn UI Components
- `Table` - Tabela de dados
- `Dialog` - Modais de adicionar/editar
- `AlertDialog` - Confirmação de exclusão
- `Select` - Dropdowns de filtro
- `Input` - Campos de entrada
- `Button` - Botões de ação
- `Card` - Cards de estatísticas
- `Label` - Rótulos de formulário

### Funcionalidades Especiais
- **Paginação**: Suporte a múltiplas páginas (10 itens por página)
- **Formatação**: Valores em Real brasileiro (R$)
- **Datas**: Formato brasileiro (DD/MM/AAAA)
- **Validação**: Campos obrigatórios nos formulários
- **Estados de carregamento**: Skeleton screens durante navegação

## Integração com o Sistema

### Sidebar Navigation
- Atualizada para incluir a página de despesas
- Suporte a skeleton loading
- Animações de transição suaves

### Routing System
- Integração com o sistema de parâmetros de URL existente
- Gerenciamento de estado de skeleton loading
- Animações com Framer Motion

## Dados Mock

O sistema inclui dados de demonstração:
- Almoço no restaurante (R$ 45,50 - Alimentação - Pago)
- Combustível (R$ 120,00 - Transporte - Pago)
- Consulta médica (R$ 200,00 - Saúde - Pendente)
- Curso online (R$ 99,90 - Educação - Pago)

## Próximos Passos

Para integração com backend real:
1. Substituir dados mock por chamadas de API
2. Implementar persistência no banco de dados
3. Adicionar validação de servidor
4. Implementar autenticação por usuário
5. Adicionar filtros por período de data

## Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Shadcn UI** - Componentes de interface
- **Framer Motion** - Animações
- **Lucide React** - Ícones

## Screenshots

### Desktop
![Página Principal](https://github.com/user-attachments/assets/a4404395-c375-4171-b85c-410232d03cb6)

### Busca Funcionando
![Busca Filtrada](https://github.com/user-attachments/assets/0de4dcd6-5c3e-40bb-96d8-93c63bdbbacf)

### Mobile Responsivo
![Versão Mobile](https://github.com/user-attachments/assets/5087af16-2537-4ee4-b2ef-0b3ff129f63e)