import { useState } from 'react'
import { PrimaryButton, DefaultButton, Panel, TextField, MessageBar, MessageBarType } from '@fluentui/react'
import { useBoolean } from '@uifabric/react-hooks'
import IBank from '../interfaces/bank.interface'
import Ilogin from '../interfaces/bank.login.interface'
import { useHistory } from 'react-router-dom'
import AccountStatusEnum from '../interfaces/acount.status.enum'

interface IHomePage {
    bankDB: IBank,
    loginSession: Ilogin,
    setLoginSession: Function
}

function HomePage({ bankDB, loginSession, setLoginSession }: IHomePage) {

    const history = useHistory()

    if (loginSession.isLoggedIn) {
        (loginSession.isStaff) ? history.push(`/staff/${loginSession.currentId}`) : history.push(`/client/${loginSession.currentId}`)
    }


    const [isClientLogin, { setTrue: openClientLogin, setFalse: dismissClientLogin }] = useBoolean(false)
    const [isStaffLogin, { setTrue: openStaffLogin, setFalse: dismissStaffLogin }] = useBoolean(false)
    const [isError, { setTrue: errorTrue, setFalse: errorFalse }] = useBoolean(false)

    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')

    const onSubmit = () => {

        if (isClientLogin) {
            dismissClientLogin()
            bankDB.client.forEach((client) => {
                if (client.username === userName && client.password === password) {

                    if (client.status === AccountStatusEnum.Close) {
                        window.alert('Your Account is Closed. Please contact the bank')
                    } else {
                        let newLoginSession = { ...loginSession }
                        newLoginSession.currentId = client.id
                        newLoginSession.isLoggedIn = true
                        newLoginSession.isStaff = false
                        setLoginSession(newLoginSession)
                        history.push(`/client/${newLoginSession.currentId}`)
                    }
                }
            })
        }
        else {
            dismissStaffLogin()
            bankDB.staff.forEach((staff) => {
                if (staff.username === userName && staff.password === password) {
                    let newLoginSession = { ...loginSession }
                    newLoginSession.currentId = staff.username
                    newLoginSession.isLoggedIn = true
                    newLoginSession.isStaff = true
                    setLoginSession(newLoginSession)
                    history.push(`/staff/${newLoginSession.currentId}`)
                }
            })
        }
        errorTrue()
    }

    return (
        <div>
            <PrimaryButton text="Client Login" onClick={openClientLogin} />
            <PrimaryButton text="Staff Login" onClick={openStaffLogin} />


            <Panel isOpen={isClientLogin} hasCloseButton={false} headerText="Client Login" >
                <form onSubmit={(e) => {
                    e.preventDefault()
                    onSubmit();
                }}>
                    <TextField label="Username" onChange={(e, value) => setUserName(value!)} required />
                    <TextField label="Password" canRevealPassword={true} type="password" onChange={(e, value) => setPassword(value!)} required />
                    <PrimaryButton text="Login" type="submit" />
                    <DefaultButton text="Cancel" onClick={dismissClientLogin} />
                </form>
            </Panel>

            <Panel isOpen={isStaffLogin} hasCloseButton={false} headerText="Staff Login">
                <form onSubmit={(e) => {
                    e.preventDefault()
                    onSubmit();
                }}>
                    <TextField label="Username" onChange={(e, value) => setUserName(value!)} required />
                    <TextField label="Password" canRevealPassword={true} type="password" onChange={(e, value) => setPassword(value!)} required />
                    <PrimaryButton text="Login" type="submit" />
                    <DefaultButton text="Cancel" onClick={dismissStaffLogin} />
                </form>
            </Panel>
            {
                (isError) ? <MessageBar messageBarType={MessageBarType.error}>
                    Wrong Username or Password
            </MessageBar> : <></>
            }

        </div>
    )
}

export default HomePage
