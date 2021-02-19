import IStaff from './staff.interface'
import IAccount from './client.account.interface'

interface IBank {
    name: string,
    id: string,
    client: IAccount[],
    staff: IStaff[]
}

export default IBank