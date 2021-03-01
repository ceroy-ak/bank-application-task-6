import { useState, useEffect } from 'react'
import IAccountHolder from '../../common/interfaces/client.account.interface'
import AccountStatusEnum from '../../common/interfaces/acount.status.enum'
import { PrimaryButton, Panel, TextField, DefaultButton, PanelType, Separator } from '@fluentui/react'
import { useBoolean } from '@uifabric/react-hooks'
import ClientTransactionStaff from './staff.client.transaction'
import TransactionStatusEnum from '../../common/interfaces/transaction.status.enum'
import BankNameEnum from '../../common/interfaces/bank.name.enum'
import { nameRegex, passwordRegex, usernameRegex } from '../../common/services/client.validation.regex'

interface IClientAccountStaff {
    client: IAccountHolder,
    deleteAccount: Function,
    updateAccount: Function,
    revokeTransaction: Function,
    bankName: BankNameEnum
}
function ClientAccount({ client, deleteAccount, updateAccount, revokeTransaction, bankName }: IClientAccountStaff) {

    const [isUpdateClient, { setTrue: openUpdateClient, setFalse: dismissUpdateClient }] = useBoolean(false)
    const [isViewAccount, { setTrue: openViewAccount, setFalse: dismissViewAccount }] = useBoolean(false)

    const [name, setName] = useState(client.name)
    const [username, setUsername] = useState(client.username)
    const [password, setPassword] = useState(client.password)

    function updateAccountProxy(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        dismissUpdateClient()
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
    const [isUpdateValidBtn, { setTrue: disableUpdateBtn, setFalse: enableUpdateBtn }] = useBoolean(true)

    useEffect(() => {

        if (nameRegex.test(name) && usernameRegex.test(username) && passwordRegex.test(password)) {
            enableUpdateBtn()
        } else {
            disableUpdateBtn()
        }

    }, [name, username, password])

    return (
        <div className="ms-Grid-col ms-xl6 ms-sm12">
            <div className={`${(client.status === AccountStatusEnum.Open) ? 'staff-dashboard__client--account' : 'staff-dashboard__client--account-closed'}`}>
                <Separator alignContent="center"><h1 className="staff-dashboard__client--name">{client.name}</h1></Separator>
                <p>Id: <b>{client.id}</b></p>
                <p>Status: <b style={{ color: `${((client.status === AccountStatusEnum.Open) ? 'green' : 'red')}` }}>{(client.status === AccountStatusEnum.Open) ? "Active" : "Closed"}</b></p>
                <p>Balance: <b>&#8377; {balance.toFixed(2)}</b></p>

                <div className="staff-dashboard__client--btn">


                    <PrimaryButton iconProps={{ iconName: "View" }} text="View Transactions" onClick={openViewAccount} />
                    {
                        (client.status === AccountStatusEnum.Open) ?
                            <>
                                <PrimaryButton iconProps={{ iconName: "Refresh" }} text="Update Account" onClick={openUpdateClient} />
                                <PrimaryButton iconProps={{ iconName: "Delete" }} text="Delete Account" onClick={() => deleteAccount(client)} />
                            </>
                            : <></>
                    }
                </div>
            </div>

            <Panel isOpen={isUpdateClient} hasCloseButton={false} headerText="Update Client" >
                <form onSubmit={(e) => updateAccountProxy(e)}>
                    <TextField
                        onGetErrorMessage={(value) => {
                            if (!nameRegex.test(value) && value.length !== 0) {
                                return 'Name can only contain Alphabets'
                            } else {
                                return ''
                            }
                        }}
                        required className="staff-dashboard--add-client__name" name="name" value={name} label="Name" onChange={(e, value) => setName(value!)} />
                    <TextField
                        onGetErrorMessage={(value) => {
                            //username Regex
                            if (!usernameRegex.test(value) && value.length !== 0) {
                                return 'No Special characters or uppercase allowed, minimum 6 characters'
                            } else {
                                return ''
                            }
                        }}
                        required className="staff-dashboard--add-client__username" name="username" value={username} label="Username" onChange={(e, value) => setUsername(value!)} />
                    <TextField
                        onGetErrorMessage={(value) => {
                            //password Regex
                            if (!passwordRegex.test(value) && value.length !== 0) {
                                return 'Password must be alphanumeric, contain atleast one @ # $ % ^ & * ( ) ! and one lower and uppercase letters, minimum 8 characters'
                            } else {
                                return ''
                            }
                        }}
                        required className="staff-dashboard--add-client__password" name="password" value={password} label="Password" onChange={(e, value) => setPassword(value!)} />
                    <PrimaryButton text="Update" type="submit" className="staff-dashboard--add-client__add" disabled={isUpdateValidBtn} />
                    <DefaultButton text="Cancel" onClick={dismissUpdateClient} className="staff-dashboard--add-client__cancel" />
                </form>
            </Panel>

            <Panel isOpen={isViewAccount} className="ms-Grid" onDismiss={dismissViewAccount} headerText={client.name} type={PanelType.custom} customWidth='500px'>
                <hr />
                {(client.transactions.length === 0) ? <p>No Transactions Available</p> :
                    client.transactions.map((value) => {
                        return <ClientTransactionStaff transaction={value} key={value.id} revokeTransaction={revokeTransaction} currBankName={bankName} />
                    })
                }
                <DefaultButton text="Close" onClick={dismissViewAccount} />
            </Panel>
        </div>
    )
}



export default ClientAccount
