import React, { useState } from 'react'
import IDashboard from '../../common/interfaces/bank.dashboard.interface'
import { PrimaryButton, Panel, TextField, DefaultButton } from '@fluentui/react'
import { useBoolean } from '@uifabric/react-hooks'
import { useHistory } from 'react-router-dom'
import ClientAccount from './staff.client.account'
import IAccountHolder from '../../common/interfaces/client.account.interface'
import AccountStatusEnum from '../../common/interfaces/acount.status.enum'
import { createAccountId } from '../../common/services/bank.id.creation'
import ITransaction from '../../common/interfaces/client.transaction.interface'
import TransactionStatus from '../../common/interfaces/transaction.status.enum'


function StaffDashboard({ setLoginSession, setBankDB, loginSession, bankDB }: IDashboard) {

    const history = useHistory()
    function logOut() {
        let newLoginSession = loginSession
        newLoginSession.currentId = undefined
        newLoginSession.isLoggedIn = false
        newLoginSession.isStaff = false
        setLoginSession(newLoginSession)
        history.push('/')
    }

    function deleteClient(client: IAccountHolder) {

        if (window.confirm('Are you sure you want to delete this Account?')) {
            let newBankDB = { ...bankDB }
            newBankDB.client.forEach((value) => {
                if (value.id === client.id) {
                    value.status = AccountStatusEnum.Close
                }
            })
            setBankDB(newBankDB)
        }
    }

    const [isAddClient, { setTrue: openAddClient, setFalse: dismissAddClient }] = useBoolean(false)

    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    function addClient(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        dismissAddClient()
        let tempClient: IAccountHolder = {
            id: createAccountId(name),
            name: name,
            password: password,
            status: AccountStatusEnum.Open,
            transactions: [],
            username: username
        }

        let newBankDB = { ...bankDB }
        newBankDB.client.unshift(tempClient)
        setBankDB(newBankDB)
    }


    function updateClient(client: IAccountHolder) {
        let newBankDB = { ...bankDB }
        newBankDB.client.forEach((value) => {
            if (value.id === client.id) {
                value.name = client.name
                value.password = client.password
                value.username = client.username
            }
        })
        setBankDB(newBankDB)
    }

    function revokeTransaction(transaction: ITransaction) {
        let newBankDB = { ...bankDB }
        newBankDB.client.forEach((value) => {
            if (value.id === transaction.toAccountId || value.id === transaction.fromAccountId) {
                value.transactions.forEach((t) => {
                    if (t.id === transaction.id) {
                        t.status = TransactionStatus.Revoked
                        console.log(t);
                    }
                })
            }
        })

        setBankDB(newBankDB)

    }

    return (
        <div>
            <h1>Staff Dashboard</h1>
            <PrimaryButton text="Logout" onClick={logOut} />
            <br />
            <PrimaryButton text="Add Client" onClick={openAddClient} />
            <hr />
            <br />
            <br />
            {
                bankDB.client.map((client) => <ClientAccount key={`xxx-${client.id}`} updateAccount={updateClient} client={client} revokeTransaction={revokeTransaction} deleteAccount={deleteClient} />)
            }

            <Panel isOpen={isAddClient} hasCloseButton={false} title="Add Client" >

                <form onSubmit={addClient}>

                    <TextField name="name" label="Name" onChange={(e, value) => setName(value!)} />
                    <TextField name="username" label="Username" onChange={(e, value) => setUsername(value!)} />
                    <TextField name="password" label="Password" onChange={(e, value) => setPassword(value!)} />
                    <PrimaryButton text="Add" type="submit" />
                    <DefaultButton text="Cancel" onClick={dismissAddClient} />
                </form>

            </Panel>
        </div>
    )
}

export default StaffDashboard
