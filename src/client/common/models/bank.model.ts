import IBank from '../interfaces/bank.interface'
import BankNameEnum from '../interfaces/bank.name.enum'
import Account from './client.account.model'
import Staff from './staff.model'
import Rtgs from './bank.rtgs.model'
import Imps from './bank.imps.model'
import Currency from './bank.currency.model'

class Bank implements IBank {
    name: string
    id: string
    client: Account[] = []
    staff: Staff[] = []
    enum: BankNameEnum
    img: string

    rtgs: Rtgs = {
        same: 0,
        other: 2,
    }

    imps: Imps = {
        same: 5,
        other: 6,
    }

    currency: Currency[] = [
        {
            currency: 'INR',
            exchangeRate: 0
        },
        {
            currency: 'USD',
            exchangeRate: 72.41
        },
        {
            currency: 'GBP',
            exchangeRate: 101.93
        },
        {
            currency: 'EUR',
            exchangeRate: 88.02
        },
    ]

    constructor(name: string, id: string, enu: BankNameEnum, img: string) {
        this.name = name;
        this.id = id;
        this.enum = enu;
        this.img = img
    }
}

export default Bank