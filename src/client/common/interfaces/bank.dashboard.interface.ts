import IBank from './bank.interface'
import Ilogin from './bank.login.interface'

interface IDashboard {
    bankDB: IBank,
    loginSession: Ilogin,
    setLoginSession: Function,
    setBankDB: Function
}

export default IDashboard