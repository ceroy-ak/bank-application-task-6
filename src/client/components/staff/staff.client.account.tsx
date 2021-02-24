import { useState } from 'react'
import IAccountHolder from '../../common/interfaces/client.account.interface'
import AccountStatusEnum from '../../common/interfaces/acount.status.enum'
import { PrimaryButton, Panel, TextField, DefaultButton, PanelType, Separator } from '@fluentui/react'
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
    let balance = Object.values(client.transactions.map((val) => (val.status === TransactionStatusEnum.Success) ? val.amount : 0).concat([0])).reduce((a?, b?) => a + b) ?? 0
    return (
        <div className="ms-Grid-col ms-md6">
            <div className={`${(client.status === AccountStatusEnum.Open) ? 'staff-dashboard__client--account' : 'staff-dashboard__client--account-closed'}`}>
                <Separator alignContent="center"><h1>{client.name}</h1></Separator>
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
            </div>

            <Panel isOpen={isAddClient} hasCloseButton={false} headerText="Update Client" >
                <form onSubmit={(e) => updateAccountProxy(e)}>

                    <TextField className="staff-dashboard--add-client__name" name="name" value={name} label="Name" onChange={(e, value) => setName(value!)} />
                    <TextField className="staff-dashboard--add-client__username" name="username" value={username} label="Username" onChange={(e, value) => setUsername(value!)} />
                    <TextField className="staff-dashboard--add-client__password" name="password" value={password} label="Password" onChange={(e, value) => setPassword(value!)} />
                    <PrimaryButton text="Add" type="submit" className="staff-dashboard--add-client__add" />
                    <DefaultButton text="Cancel" onClick={dismissAddClient} className="staff-dashboard--add-client__cancel" />
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
