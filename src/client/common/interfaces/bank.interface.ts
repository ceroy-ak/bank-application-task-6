import BankNameEnum from './bank.name.enum'
import Account from '../models/client.account.model'
import Staff from '../models/staff.model'
import Rtgs from '../models/bank.rtgs.model'
import Imps from '../models/bank.imps.model'
import Currency from '../models/bank.currency.model'

interface IBank {
    name: string,
    id: string,
    client: Account[],
    staff: Staff[]
    enum: BankNameEnum,
    img: string,
    rtgs: Rtgs,
    imps: Imps,
    currency: Currency[]
}

export default IBank