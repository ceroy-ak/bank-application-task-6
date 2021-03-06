import Transaction from '../models/client.transaction.model'
import AccountStatusEnum from './acount.status.enum'

interface IAccountHolder {
    id: string
    username: string
    password: string
    name: string
    transactions: Transaction[]
    status: AccountStatusEnum
}

export default IAccountHolder