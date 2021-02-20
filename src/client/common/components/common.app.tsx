import { useState } from 'react'
import initialBank from '../services/bank.initialState'
import initialLogin from '../services/login.initialState'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import HomePage from './common.home'
import ClientDashboard from '../../components/client/client.dashboard'
import StaffDashboard from '../../components/staff/staff.dashboard'
import PageNotFound from './common.404'
import { initializeIcons } from '@fluentui/react'

function App() {

  initializeIcons()
  const [bankDB, setBankDB] = useState(initialBank)
  const [loginSession, setLoginSession] = useState(initialLogin)

  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact render={() => <HomePage bankDB={bankDB} loginSession={loginSession} setLoginSession={setLoginSession} />} />
        <Route path='/client/:id' exact render={() => <ClientDashboard bankDB={bankDB} loginSession={loginSession} setBankDB={setBankDB} setLoginSession={setLoginSession} />} />
        <Route path='/staff/:id' exact render={() => <StaffDashboard bankDB={bankDB} loginSession={loginSession} setBankDB={setBankDB} setLoginSession={setLoginSession} />} />
        <Route component={PageNotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
