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
    const income = this.transactions.reduce(function (acumulador, transaction) {
      if (transaction.type === 'income') {
        return acumulador + transaction.value;
      }
      return acumulador;
    }, 0);

    const outcome = this.transactions.reduce(function (
      acumulador,
      transaction,
    ) {
      if (transaction.type === 'outcome') {
        return acumulador + transaction.value;
      }
      return acumulador;
    },
    0);

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }

  public create({ title, type, value }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, type, value });

    if (type === 'outcome') {
      const balance = this.getBalance();
      if (balance.total < value) {
        throw Error('Not enought cash to this transaction');
      }
    }
    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
