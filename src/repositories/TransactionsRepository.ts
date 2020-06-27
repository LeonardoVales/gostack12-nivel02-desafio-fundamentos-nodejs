import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const { income, outcome } = this.transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += transaction.value;
            break;
          case 'outcome':
            accumulator.outcome += transaction.value;
            break;
          default:
            break;
        }

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }

  // O método create recebe as informações que o Service enviou
  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    // O repositório envia os dados recebidos do Service para a Model
    // A Model cria e devolve a informação
    const transaction = new Transaction({
      title,
      value,
      type,
    });

    // Armazena a transaction criada no array de transactions
    this.transactions.push(transaction);

    // Retorna a transaction criada
    return transaction;
  }
}

export default TransactionsRepository;
