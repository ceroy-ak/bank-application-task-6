import IAccountHolder from '../interfaces/client.account.interface'
import Transaction from './client.transaction.model'
import AccountStatusEnum from '../interfaces/acount.status.enum'

export default class AccountHolder implements IAccountHolder {
    id: string
    username: string
    password: string
    name: string
    transactions: Transaction[]
    status: AccountStatusEnum
    constructor(
        id: string,
        username: string,
        password: string,
        name: string,
        transactions: Transaction[],
        status: AccountStatusEnum,
    ) {
        this.id = id
        this.username = username
        this.password = password
        this.name = name
        this.transactions = transactions
        this.status = status
    }
}