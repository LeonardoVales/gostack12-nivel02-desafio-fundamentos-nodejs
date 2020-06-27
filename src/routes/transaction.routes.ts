import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();
    const balance = transactionsRepository.getBalance();

    return response.json({
      transactions,
      balance,
    });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type } = request.body; // Peguei os dados da requisição

    // crio uma instância do service, CreateTransactionService
    const CreateTransaction = new CreateTransactionService(
      transactionsRepository,
    );

    // Passo os dados da requisição para o Service
    const transaction = CreateTransaction.execute({
      title,
      value,
      type,
    });

    // Retorna a transação criada
    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
