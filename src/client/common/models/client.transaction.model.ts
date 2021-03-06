import ITransaction from '../interfaces/client.transaction.interface'
import TransactionStatusEnum from '../interfaces/transaction.status.enum'
import BankNameEnum from '../interfaces/bank.name.enum'

export default class Transaction implements ITransaction {
    id: string
    amount: number
    charges: number
    toAccountId: string
    fromAccountId: string
    status: TransactionStatusEnum
    datetime: string
    fromBankName: BankNameEnum
    toBankName: BankNameEnum

    constructor(id: string,
        amount: number,
        charges: number,
        toAccountId: string,
        fromAccountId: string,
        status: TransactionStatusEnum,
        datetime: string,
        fromBankName: BankNameEnum,
        toBankName: BankNameEnum) {
        this.id = id
        this.amount = amount
        this.charges = charges
        this.toAccountId = toAccountId
        this.fromAccountId = fromAccountId
        this.status = status
        this.datetime = datetime
        this.fromBankName = fromBankName
        this.toBankName = toBankName
    }
}