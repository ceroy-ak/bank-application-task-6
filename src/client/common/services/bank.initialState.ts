import IBank from '../interfaces/bank.interface'
import AccountStatusEnum from '../interfaces/acount.status.enum'
import TransactionStatusEnum from '../interfaces/transaction.status.enum'
import BankNameEnum from '../interfaces/bank.name.enum'
import technovert_logo from '../../res/Technovert-Logo-2X.png'
import saketa_logo from '../../res/saketa_logo.png'
import keka_logo from '../../res/keka.png'

const technovertBankId = "Tec-20-2-2021-1613825167894"
const technovertClientName1 = "Abhishek Kumar"
const technovertClientName2 = "Sachin Tendulkar"
const technovertClientName3 = "Mahendra Singh Dhoni"
const technovertClientId1 = "Abh-20-2-2021-1613825167894"
const technovertClientId2 = "Sac-20-2-2021-1613825167893"
const technovertClientId3 = "Mah-20-2-2021-1613825167894"

const technovertBank: IBank = {
    name: "Technovert Bank",
    id: technovertBankId,
    enum: BankNameEnum.Technovert,
    img: technovert_logo,
    staff: [{
        name: "R. Ashwin",
        username: "staff1",
        password: "123"
    }],
    client: [
        {
            name: technovertClientName1,
            id: technovertClientId1,
            password: "123",
            username: "abhishek",
            transactions: [
                {
                    id: "TXN-Tec-20-2-2021-1613825167894-Abh-20-2-2021-1613825167894-20-2-2021-1613825167894",
                    amount: -500,
                    fromAccountId: technovertClientId1,
                    toAccountId: technovertClientId1,
                    status: TransactionStatusEnum.Success,
                    datetime: "Mon Feb 20 2021 11:52:40 GMT+0530 (India Standard Time)"
                },
                {
                    id: "TXN-Tec-20-2-2021-1613825167894-Abh-20-2-2021-1613825167894-20-2-2021-1613825123424",
                    amount: 2000,
                    fromAccountId: technovertClientId1,
                    toAccountId: technovertClientId1,
                    status: TransactionStatusEnum.Success,
                    datetime: "Mon Feb 20 2021 10:52:40 GMT+0530 (India Standard Time)"
                },
                {
                    id: "TXN-Tec-20-2-2021-1613825167894-Abh-20-2-2021-1613825167894-20-2-2021-1613821111111",
                    amount: -5000,
                    fromAccountId: technovertClientId1,
                    toAccountId: technovertClientId3,
                    status: TransactionStatusEnum.Revoked,
                    datetime: "Mon Feb 19 2021 19:52:40 GMT+0530 (India Standard Time)"
                },
                {
                    id: "TXN-Tec-20-2-2021-1613825167894-Abh-20-2-2021-1613825167894-20-2-2021-1613825345743",
                    amount: -500,
                    fromAccountId: technovertClientId1,
                    toAccountId: technovertClientId2,
                    status: TransactionStatusEnum.Success,
                    datetime: "Mon Feb 18 2021 11:52:40 GMT+0530 (India Standard Time)"
                },
                {
                    id: `TXN-Tec-20-2-2021-1613825167894-${technovertClientId2}-20-2-2021-1613825888894`,
                    amount: 50000,
                    fromAccountId: technovertClientId2,
                    toAccountId: technovertClientId1,
                    status: TransactionStatusEnum.Success,
                    datetime: "Mon Feb 17 2021 11:52:40 GMT+0530 (India Standard Time)"
                }
            ],
            status: AccountStatusEnum.Open
        },
        {
            name: technovertClientName2,
            id: technovertClientId2,
            password: "securePassword1",
            username: "sachinmaster",
            transactions: [
                {
                    id: `TXN-Tec-20-2-2021-1613825167894-${technovertClientId2}-20-2-2021-1613825167894`,
                    amount: 100000,
                    fromAccountId: technovertClientId2,
                    toAccountId: technovertClientId2,
                    status: TransactionStatusEnum.Success,
                    datetime: "Mon Feb 17 2021 12:52:40 GMT+0530 (India Standard Time)"
                },
                {
                    id: "TXN-Tec-20-2-2021-1613825167894-Abh-20-2-2021-1613825167894-20-2-2021-1613825345743",
                    amount: 500,
                    fromAccountId: technovertClientId1,
                    toAccountId: technovertClientId2,
                    status: TransactionStatusEnum.Success,
                    datetime: "Mon Feb 18 2021 11:52:40 GMT+0530 (India Standard Time)"
                },
                {
                    id: `TXN-Tec-20-2-2021-1613825167894-${technovertClientId2}-20-2-2021-1613825888894`,
                    amount: -50000,
                    fromAccountId: technovertClientId2,
                    toAccountId: technovertClientId1,
                    status: TransactionStatusEnum.Success,
                    datetime: "Mon Feb 17 2021 11:52:40 GMT+0530 (India Standard Time)"
                }
            ],
            status: AccountStatusEnum.Open
        },
        {
            name: technovertClientName3,
            id: technovertClientId3,
            password: "securePassword",
            username: "msHelicopter7",
            transactions: [
                {
                    id: "TXN-Tec-20-2-2021-1613825167894-Abh-20-2-2021-1613825167894-20-2-2021-1613821111111",
                    amount: 5000,
                    fromAccountId: technovertClientId1,
                    toAccountId: technovertClientId3,
                    status: TransactionStatusEnum.Revoked,
                    datetime: "Mon Feb 19 2021 19:52:40 GMT+0530 (India Standard Time)"
                }
            ],
            status: AccountStatusEnum.Close
        }
    ]
}


const saketaBankId = "Sak-20-2-2021-1613825164494"
const saketaClientName1 = "Kapil Dev"
const saketaClientName2 = "Virat Kohli"
const saketaClientId1 = "Kap-20-2-2021-1613825167894"
const saketaClientId2 = "Vir-20-2-2021-1613825167894"

const saketaBank: IBank = {
    name: "Saketa Bank",
    id: saketaBankId,
    enum: BankNameEnum.Saketa,
    img: saketa_logo,
    staff: [{
        name: "Abhishek Kumar",
        username: "staff1",
        password: "123"
    }],
    client: [
        {
            name: saketaClientName1,
            id: saketaClientId1,
            password: "123",
            username: "kapil",
            transactions: [
                {
                    id: `TXN-${saketaBankId}-${saketaClientId1}-20-2-2021-1613825167894`,
                    amount: 500,
                    fromAccountId: saketaClientId1,
                    toAccountId: saketaClientId1,
                    status: TransactionStatusEnum.Success,
                    datetime: "Mon Feb 19 2021 19:52:40 GMT+0530 (India Standard Time)"
                },
            ],
            status: AccountStatusEnum.Open
        },
        {
            name: saketaClientName2,
            id: saketaClientId2,
            password: "123",
            username: "bc",
            transactions: [
                {
                    id: `TXN-${saketaBankId}-${saketaClientId1}-20-2-2021-1613825167894`,
                    amount: 100000,
                    fromAccountId: saketaClientId2,
                    toAccountId: saketaClientId2,
                    status: TransactionStatusEnum.Success,
                    datetime: "Mon Feb 19 2021 19:52:40 GMT+0530 (India Standard Time)"
                },
                {
                    id: `TXN-${saketaBankId}-${saketaClientId1}-20-2-2021-1613825888894`,
                    amount: 50000,
                    fromAccountId: saketaClientId2,
                    toAccountId: saketaClientId2,
                    status: TransactionStatusEnum.Success,
                    datetime: "Mon Feb 18 2021 19:52:40 GMT+0530 (India Standard Time)"
                },
            ],
            status: AccountStatusEnum.Open
        },
    ]
}

const kekaBankId = "kek-20-2-2021-1613825164494"
const kekaClientName = "Ravindra Jadeja"
const kekaClientId = "Rav-20-2-2021-1613325167894"

const kekaBank: IBank = {
    name: "Keka Bank",
    enum: BankNameEnum.Keka,
    img: keka_logo,
    id: kekaBankId,
    staff: [{
        name: "Abhishek Kumar",
        username: "staff1",
        password: "123"
    }],
    client: [
        {
            name: kekaClientName,
            id: kekaClientId,
            password: "123",
            username: "raju",
            transactions: [
                {
                    id: `TXN-${kekaBankId}-${kekaClientId}-20-2-2021-1613825167894`,
                    amount: 500,
                    fromAccountId: kekaClientId,
                    toAccountId: kekaClientId,
                    status: TransactionStatusEnum.Success,
                    datetime: "Mon Feb 21 2021 19:52:40 GMT+0530 (India Standard Time)"
                },
            ],
            status: AccountStatusEnum.Open
        }
    ]
}

const multiBank = {
    technovert: technovertBank,
    saketa: saketaBank,
    keka: kekaBank
}

export default multiBank