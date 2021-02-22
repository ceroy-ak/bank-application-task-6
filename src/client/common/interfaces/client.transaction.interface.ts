import TransactionStatusEnum from './transaction.status.enum'

interface ITransaction {
    id: string
    amount: number
    toAccountId: string
    fromAccountId: string
    status: TransactionStatusEnum
    datetime: string
}

export default ITransaction