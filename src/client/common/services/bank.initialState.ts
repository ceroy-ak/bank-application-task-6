import IBank from '../interfaces/bank.interface'
import { createAccountId, createBankId, createTransactionId } from '../services/bank.id.creation'
import AccountStatusEnum from '../interfaces/acount.status.enum'
import TransactionStatusEnum from '../interfaces/transaction.status.enum'

let bankId = createBankId('Technovert Bank')
let clientName = "Abhishek Kumar"
let clientName2 = "Sachin Tendulkar"
let clientName3 = "Mahendra Singh Dhoni"
let clientId1 = createAccountId(clientName)
let clientId2 = createAccountId(clientName2)
let clientId3 = createAccountId(clientName3)

let bank: IBank = {
    name: "Technovert Bank",
    id: bankId,
    staff: [{
        name: "R. Ashwin",
        username: "staff1",
        password: "pa55word"
    }],
    client: [
        {
            name: clientName,
            id: clientId1,
            password: "123",
            username: "abhishek",
            transactions: [
                {
                    id: createTransactionId(bankId, clientId1),
                    amount: -500,
                    fromAccountId: clientId1,
                    toAccountId: clientId1,
                    status: TransactionStatusEnum.Success
                },
                {
                    id: createTransactionId(bankId, clientId1),
                    amount: 2000,
                    fromAccountId: clientId1,
                    toAccountId: clientId1,
                    status: TransactionStatusEnum.Success
                },
                {
                    id: createTransactionId(bankId, clientId1),
                    amount: -5000,
                    fromAccountId: clientId1,
                    toAccountId: clientId3,
                    status: TransactionStatusEnum.Revoked
                },
                {
                    id: createTransactionId(bankId, clientId1),
                    amount: -500,
                    fromAccountId: clientId1,
                    toAccountId: clientId2,
                    status: TransactionStatusEnum.Success
                },
                {
                    id: createTransactionId(bankId, clientId1),
                    amount: 50000,
                    fromAccountId: clientId2,
                    toAccountId: clientId1,
                    status: TransactionStatusEnum.Success
                }
            ],
            status: AccountStatusEnum.Open
        },
        {
            name: clientName2,
            id: clientId2,
            password: "securePassword1",
            username: "sachinmaster",
            transactions: [
                {
                    id: createTransactionId(bankId, clientId2),
                    amount: 100000,
                    fromAccountId: clientId2,
                    toAccountId: clientId2,
                    status: TransactionStatusEnum.Success
                },
                {
                    id: createTransactionId(bankId, clientId2),
                    amount: -50000,
                    fromAccountId: clientId2,
                    toAccountId: clientId1,
                    status: TransactionStatusEnum.Success
                },
                {
                    id: createTransactionId(bankId, clientId2),
                    amount: 500,
                    fromAccountId: clientId1,
                    toAccountId: clientId2,
                    status: TransactionStatusEnum.Success
                }
            ],
            status: AccountStatusEnum.Open
        },
        {
            name: clientName3,
            id: clientId3,
            password: "securePassword",
            username: "msHelicopter7",
            transactions: [
                {
                    id: createTransactionId(bankId, clientId3),
                    amount: 5000,
                    fromAccountId: clientId1,
                    toAccountId: clientId3,
                    status: TransactionStatusEnum.Revoked
                }
            ],
            status: AccountStatusEnum.Close
        }
    ]
}

export default bank
