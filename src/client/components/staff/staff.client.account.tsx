import { useState } from 'react'
import IAccountHolder from '../../common/interfaces/client.account.interface'
import AccountStatusEnum from '../../common/interfaces/acount.status.enum'
import { PrimaryButton, Panel, TextField, DefaultButton, PanelType } from '@fluentui/react'
import { useBoolean } from '@uifabric/react-hooks'
import ClientTransactionStaff from './staff.client.transaction'
import TransactionStatusEnum from '../../common/interfaces/transaction.status.enum'


interface IClientAccountStaff {
    client: IAccountHolder,
    deleteAccount: Function,
    updateAccount: Function,
    revokeTransaction: Function
}
function ClientAccount({ client, deleteAccount, updateAccount, revokeTransaction }: IClientAccountStaff) {

    const [isAddClient, { setTrue: openAddClient, setFalse: dismissAddClient }] = useBoolean(false)
    const [isViewAccount, { setTrue: openViewAccount, setFalse: dismissViewAccount }] = useBoolean(false)

    const [name, setName] = useState(client.name)
    const [username, setUsername] = useState(client.username)
    const [password, setPassword] = useState(client.password)

    function updateAccountProxy(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        dismissAddClient()
        let tempClient: IAccountHolder = {
            id: client.id,
            name: name,
            password: password,
            status: client.status,
            transactions: client.transactions,
            username: username
        }

        updateAccount(tempClient)
    }
    let balance = Object.values(client.transactions.map((val) => (val.status === TransactionStatusEnum.Success) ? val.amount : 0)).reduce((a, b) => a + b)
    return (
        <div>
            <h1>Account Holder: {client.name}</h1>
            <p>{client.id}</p>
            <p>Account Status: {(client.status === AccountStatusEnum.Open) ? "Active" : "Closed"}</p>
            <p>Current balance: &#8377;{balance}</p>
            <PrimaryButton text="View Account" onClick={openViewAccount} />
            {
                (client.status === AccountStatusEnum.Open) ?
                    <>
                        <PrimaryButton text="Update Account" onClick={openAddClient} />
                        <PrimaryButton text="Delete Account" onClick={() => deleteAccount(client)} />
                    </>
                    : <></>
            }
            <hr />

            <Panel isOpen={isAddClient} hasCloseButton={false} headerText="Add Client" >
                <form onSubmit={(e) => updateAccountProxy(e)}>

                    <TextField name="name" value={name} label="Name" onChange={(e, value) => setName(value!)} />
                    <TextField name="username" value={username} label="Username" onChange={(e, value) => setUsername(value!)} />
                    <TextField name="password" value={password} label="Password" onChange={(e, value) => setPassword(value!)} />
                    <PrimaryButton text="Add" type="submit" />
                    <DefaultButton text="Cancel" onClick={dismissAddClient} />
                </form>
            </Panel>

            <Panel isOpen={isViewAccount} onDismiss={dismissViewAccount} headerText={client.name} type={PanelType.custom} customWidth='500px'>
                {
                    client.transactions.map((value) => {
                        return <ClientTransactionStaff transaction={value} key={value.id} revokeTransaction={revokeTransaction} />
                    })
                }
                <DefaultButton text="Close" onClick={dismissViewAccount} />
            </Panel>
        </div>
    )
}



export default ClientAccount
