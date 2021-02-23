import { useState, useEffect } from 'react'
import initialLogin from '../services/login.initialState'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import HomePage from './common.home'
import ClientDashboard from '../../components/client/client.dashboard'
import StaffDashboard from '../../components/staff/staff.dashboard'
import PageNotFound from './common.404'
import { initializeIcons } from '@fluentui/react'
import initMultiBank from '../services/bank.initialState'
import IBank from '../interfaces/bank.interface'
import BankNameEnum from '../interfaces/bank.name.enum'

function App() {

  initializeIcons()
  const [multiBank, setMultiBank] = useState(initMultiBank)

  const defaultBank: IBank = {
    client: [],
    enum: BankNameEnum.None,
    id: "",
    name: "Select a bank",
    staff: [],
    img: "",
    currency: [],
    imps: {
      same: 0,
      other: 0
    },
    rtgs: {
      other: 0,
      same: 0
    }
  }
  const [bankDB, setBankDB] = useState<IBank>(defaultBank)
  const [loginSession, setLoginSession] = useState(initialLogin)

  function chooseBank(bankName: BankNameEnum) {
    let temp = { ...multiBank }
    if (bankName === BankNameEnum.Technovert) {
      setBankDB(temp.technovert)
    } else if (bankName === BankNameEnum.Saketa) {
      setBankDB(temp.saketa)
    } else if (bankName === BankNameEnum.Keka) {
      setBankDB(temp.keka)
    } else {
      setBankDB(defaultBank)
    }
  }

  useEffect(() => {
    let temp = { ...multiBank }
    if (bankDB?.enum === BankNameEnum.Technovert) {
      temp.technovert = bankDB
    } else if (bankDB?.enum === BankNameEnum.Saketa) {
      temp.saketa = bankDB
    } else if (bankDB?.enum === BankNameEnum.Keka) {
      temp.keka = bankDB
    }
    setMultiBank(temp)
  }, [bankDB])

  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact render={() => <HomePage bankDB={bankDB!} loginSession={loginSession} setLoginSession={setLoginSession} chooseBank={chooseBank} />} />
        <Route path='/client/:id' exact render={() => {
          if (loginSession.currentId === undefined || loginSession.isLoggedIn === false || loginSession.isStaff === true)
            return (

              <HomePage bankDB={bankDB!} loginSession={loginSession} setLoginSession={setLoginSession} chooseBank={chooseBank} />)
          else return <ClientDashboard bankDB={bankDB!} loginSession={loginSession} setBankDB={setBankDB} setLoginSession={setLoginSession} />
        }} />
        <Route path='/staff/:id' exact render={() => {
          if (loginSession.currentId === undefined || loginSession.isLoggedIn === false || loginSession.isStaff !== true)
            return <HomePage bankDB={bankDB!} loginSession={loginSession} setLoginSession={setLoginSession} chooseBank={chooseBank} />
          else return <StaffDashboard bankDB={bankDB!} loginSession={loginSession} setBankDB={setBankDB} setLoginSession={setLoginSession} />
        }} />
        <Route component={PageNotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
