import TransactionStatusEnum from './transaction.status.enum'
import BankNameEnum from './bank.name.enum'

interface ITransaction {
    id: string
    amount: number
    charges: number
    toAccountId: string
    fromAccountId: string
    status: TransactionStatusEnum
    datetime: string
    fromBankName: BankNameEnum
    toBankName: BankNameEnum
}

export default ITransaction