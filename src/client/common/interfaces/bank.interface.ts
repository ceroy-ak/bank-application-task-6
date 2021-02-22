import IStaff from './staff.interface'
import IAccount from './client.account.interface'
import BankNameEnum from './bank.name.enum'

interface IBank {
    name: string,
    id: string,
    client: IAccount[],
    staff: IStaff[]
    enum: BankNameEnum,
    img: string,
}

export default IBank