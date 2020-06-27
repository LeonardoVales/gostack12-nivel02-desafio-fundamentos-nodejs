import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

// Crio a interface para tipar os dados que o service vai receber
interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  // O repositório já está instanciado no construtor
  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  // No método, eu passo os parâmetros com a interface e informo qual é a saída
  // Nesse caso a saída é uma TRANSACTION
  public execute({ title, value, type }: Request): Transaction {
    // Compara se o type possui qualquer um desses valores
    if (!['income', 'outcome'].includes(type)) {
      throw new Error('Transaction type is invalid');
    }

    // valida se o valor de saída é maior do que eu tenho em caixa
    const { total } = this.transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new Error('You do not have enough balance');
    }

    // O service recebe os dados da rota (da requisição né) e envia para o repositório cadastrar os dados
    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
