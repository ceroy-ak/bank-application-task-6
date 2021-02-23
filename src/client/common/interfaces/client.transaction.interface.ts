import TransactionStatusEnum from './transaction.status.enum'
import BankNameEnum from './bank.name.enum'

interface ITransaction {
    id: string
    amount: number
    toAccountId: string
    fromAccountId: string
    status: TransactionStatusEnum
    datetime: string
    toBankName: BankNameEnum
}

export default ITransaction