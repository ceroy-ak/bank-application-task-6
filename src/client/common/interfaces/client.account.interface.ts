import ITransaction from './client.transaction.interface'
import AccountStatusEnum from './acount.status.enum'

interface IAccountHolder {
    id: string
    username: string
    password: string
    name: string
    transactions: ITransaction[]
    status: AccountStatusEnum
}

export default IAccountHolder