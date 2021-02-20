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
        password: "123"
    }],
    client: [
        {
            name: clientName,
            id: clientId1,
            password: "123",
            username: "abhishek",
            transactions: [
                {
                    id: "TXN-Tec-20-2-2021-1613825167894-Abh-20-2-2021-1613825167894-20-2-2021-1613825167894",
                    amount: -500,
                    fromAccountId: clientId1,
                    toAccountId: clientId1,
                    status: TransactionStatusEnum.Success
                },
                {
                    id: "TXN-Tec-20-2-2021-1613825167894-Abh-20-2-2021-1613825167894-20-2-2021-1613825123424",
                    amount: 2000,
                    fromAccountId: clientId1,
                    toAccountId: clientId1,
                    status: TransactionStatusEnum.Success
                },
                {
                    id: "TXN-Tec-20-2-2021-1613825167894-Abh-20-2-2021-1613825167894-20-2-2021-1613821111111",
                    amount: -5000,
                    fromAccountId: clientId1,
                    toAccountId: clientId3,
                    status: TransactionStatusEnum.Revoked
                },
                {
                    id: "TXN-Tec-20-2-2021-1613825167894-Abh-20-2-2021-1613825167894-20-2-2021-1613825345743",
                    amount: -500,
                    fromAccountId: clientId1,
                    toAccountId: clientId2,
                    status: TransactionStatusEnum.Success
                },
                {
                    id: `TXN-Tec-20-2-2021-1613825167894-${clientId2}-20-2-2021-1613825888894`,
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
                    id: `TXN-Tec-20-2-2021-1613825167894-${clientId2}-20-2-2021-1613825167894`,
                    amount: 100000,
                    fromAccountId: clientId2,
                    toAccountId: clientId2,
                    status: TransactionStatusEnum.Success
                },
                {
                    id: `TXN-Tec-20-2-2021-1613825167894-${clientId2}-20-2-2021-1613825888894`,
                    amount: -50000,
                    fromAccountId: clientId2,
                    toAccountId: clientId1,
                    status: TransactionStatusEnum.Success
                },
                {
                    id: "TXN-Tec-20-2-2021-1613825167894-Abh-20-2-2021-1613825167894-20-2-2021-1613825345743",
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
                    id: "TXN-Tec-20-2-2021-1613825167894-Abh-20-2-2021-1613825167894-20-2-2021-1613821111111",
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
