import IStaff from './staff.interface'
import IAccount from './client.account.interface'
import BankNameEnum from './bank.name.enum'
import IRtgs from './bank.rtgs.interface'
import IImps from './bank.imps.interface'
import ICurrency from './bank.currency'

interface IBank {
    name: string,
    id: string,
    client: IAccount[],
    staff: IStaff[]
    enum: BankNameEnum,
    img: string,
    rtgs: IRtgs,
    imps: IImps,
    currency: ICurrency[]
}

export default IBank