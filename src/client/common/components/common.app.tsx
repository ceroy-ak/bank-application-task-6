import { useState, useEffect, useMemo, useCallback } from 'react'
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
import ITransaction from '../interfaces/client.transaction.interface'
import TransactionStatus from '../interfaces/transaction.status.enum'
import AccountStatusEnum from '../interfaces/acount.status.enum'

function App() {

  //Initialization of the Icons inside useEffect to ensure that it is called only Once
  useEffect(() => {
    initializeIcons()
  }, [])

  //State of out banksList Structure
  const [banksList, setBanksList] = useState(initMultiBank)

  //Default Bank in case no bank is to be selected, defined by BankNameEnum.None
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

  //State of the current bank or the selected that would be passed throughout the application
  const [bankDB, setBankDB] = useState<IBank>(defaultBank)

  //State to hold the info of the login session
  const [loginSession, setLoginSession] = useState(initialLogin)

  //Function that takes the Enum as parameter and sets the current bank as per request
  function chooseBank(bankName: BankNameEnum) {
    let temp = { ...banksList }
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

  //Function Passed to the Staff Dashboard to Revoke Transaction if the transaction is cross bank
  function revokeTransactionFromAccount(transaction: ITransaction) {
    let tempMultiBank = { ...banksList }
    if (transaction.fromBankName === BankNameEnum.Technovert) {
      tempMultiBank.technovert.client.forEach((client) => {
        if (client.id === transaction.fromAccountId) {
          client.transactions.forEach((t) => {
            if (t.id === transaction.id) {
              t.status = TransactionStatus.Revoked
            }
          })
        }
      })
    } else if (transaction.fromBankName === BankNameEnum.Saketa) {
      tempMultiBank.saketa.client.forEach((client) => {
        if (client.id === transaction.fromAccountId) {
          client.transactions.forEach((t) => {
            if (t.id === transaction.id) {
              t.status = TransactionStatus.Revoked
            }
          })
        }
      })

    } else if (transaction.fromBankName === BankNameEnum.Keka) {
      tempMultiBank.keka.client.forEach((client) => {
        if (client.id === transaction.fromAccountId) {
          client.transactions.forEach((t) => {
            if (t.id === transaction.id) {
              t.status = TransactionStatus.Revoked
            }
          })
        }
      })

    }

    setBanksList(tempMultiBank)
  }

  //Function passed as prop to Client dashboard to facilitate cross bank transaction
  function otherBankTransaction(transaction: ITransaction): Boolean {

    let validToAccount: Boolean = false
    let tempMultiBank = { ...banksList }
    if (transaction.toBankName === BankNameEnum.Saketa) {
      tempMultiBank.saketa.client.forEach((client) => {
        if (client.id === transaction.toAccountId && client.status === AccountStatusEnum.Open) {
          client.transactions.unshift(transaction)
          validToAccount = true
        }
      })
    } else if (transaction.toBankName === BankNameEnum.Keka) {
      tempMultiBank.keka.client.forEach((client) => {
        if (client.id === transaction.toAccountId && client.status === AccountStatusEnum.Open) {
          client.transactions.unshift(transaction)
          validToAccount = true
        }
      })
    } else if (transaction.toBankName === BankNameEnum.Technovert) {
      tempMultiBank.technovert.client.forEach((client) => {
        if (client.id === transaction.toAccountId && client.status === AccountStatusEnum.Open) {
          client.transactions.unshift(transaction)
          validToAccount = true
        }
      })
    }

    if (validToAccount) {
      bankDB.client.forEach((client) => {
        if (client.id === transaction.fromAccountId) {
          const superTemp = { ...transaction }
          superTemp.amount = (superTemp.amount + superTemp.charges) * -1
          client.transactions.unshift(superTemp)
        }
      })
      setBankDB(bankDB)
      setBanksList(tempMultiBank)
      return true
    }
    else {
      return false
    }
  }


  //useEffect hook ensures that if the 
  useEffect(() => {
    let temp = { ...banksList }
    if (bankDB?.enum === BankNameEnum.Technovert) {
      temp.technovert = bankDB
    } else if (bankDB?.enum === BankNameEnum.Saketa) {
      temp.saketa = bankDB
    } else if (bankDB?.enum === BankNameEnum.Keka) {
      temp.keka = bankDB
    }
    setBanksList(temp)
  }, [bankDB])

  //All the routing
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact render={() => <HomePage bankDB={bankDB!} loginSession={loginSession} setLoginSession={setLoginSession} chooseBank={chooseBank} />} />
        <Route path='/client/:id' exact render={() => {
          if (loginSession.currentId === undefined || loginSession.isLoggedIn === false || loginSession.isStaff === true)
            return (

              <HomePage bankDB={bankDB!} loginSession={loginSession} setLoginSession={setLoginSession} chooseBank={chooseBank} />)
          else return <ClientDashboard chooseBank={chooseBank} bankDB={bankDB!} loginSession={loginSession} setBankDB={setBankDB} setLoginSession={setLoginSession} otherBankTransfer={otherBankTransaction} />
        }} />
        <Route path='/staff/:id' exact render={() => {
          if (loginSession.currentId === undefined || loginSession.isLoggedIn === false || loginSession.isStaff !== true)
            return <HomePage bankDB={bankDB!} loginSession={loginSession} setLoginSession={setLoginSession} chooseBank={chooseBank} />
          else return <StaffDashboard revokeTransactionFromAccount={revokeTransactionFromAccount} bankDB={bankDB!} chooseBank={chooseBank} loginSession={loginSession} setBankDB={setBankDB} setLoginSession={setLoginSession} />
        }} />
        <Route component={PageNotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
