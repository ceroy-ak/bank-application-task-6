import React from 'react'
import IDashboard from '../../common/interfaces/bank.dashboard.interface'
import { PrimaryButton } from '@fluentui/react'
import { useHistory } from 'react-router-dom'

function ClientDashboard({ bankDB, loginSession, setBankDB, setLoginSession }: IDashboard) {

    const history = useHistory()
    function logOut() {
        let newLoginSession = loginSession!
        newLoginSession.currentId = undefined
        newLoginSession.isLoggedIn = false
        newLoginSession.isStaff = false
        setLoginSession(newLoginSession)
        history.push('/')
    }
    return (
        <div>
            <h1>Client Dashboard</h1>
            <PrimaryButton text="Logout" onClick={logOut} />
        </div>
    )
}

export default ClientDashboard
