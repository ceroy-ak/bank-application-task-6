import { useState } from 'react'
import IDashboard from '../../common/interfaces/bank.dashboard.interface'
import {
    PrimaryButton, Pivot, PivotItem,
    IStyleFunctionOrObject, IPivotStyleProps, IPivotStyles, PivotLinkSize,
    Separator, MessageBar, MessageBarType
} from '@fluentui/react'
import { useBoolean } from '@uifabric/react-hooks'
import { useHistory } from 'react-router-dom'
import ClientAccount from './staff.client.account'
import IAccountHolder from '../../common/interfaces/client.account.interface'
import AccountStatusEnum from '../../common/interfaces/acount.status.enum'
import ITransaction from '../../common/interfaces/client.transaction.interface'
import TransactionStatus from '../../common/interfaces/transaction.status.enum'
import BankSettings from './staff.bank.settings'
import BankNameEnum from '../../common/interfaces/bank.name.enum'
import AddClient from './staff.addClient'

interface IStaffDashboard extends IDashboard {
    chooseBank: Function,
    revokeTransactionFromAccount: Function
}
function StaffDashboard({ setLoginSession, setBankDB, loginSession, bankDB, chooseBank, revokeTransactionFromAccount }: IStaffDashboard) {

    const staff = bankDB.staff.filter((staff) => staff.username === loginSession.currentId)[0]


    //To facilitate Logout functionality
    const history = useHistory()
    function logOut() {
        let newLoginSession = loginSession
        newLoginSession.currentId = undefined
        newLoginSession.isLoggedIn = false
        newLoginSession.isStaff = false
        setLoginSession(newLoginSession)
        chooseBank(BankNameEnum.None)
        history.push('/')
    }

    //For Message
    const [isMessage, { setTrue: openMessage, setFalse: closeMessage }] = useBoolean(false)
    const [messageBarType, setMessageBarType] = useState<MessageBarType>(MessageBarType.severeWarning)
    const [messageText, setMessageText] = useState('')

    //Delete an account Holder(client)
    function deleteClient(client: IAccountHolder) {

        if (window.confirm('Are you sure you want to delete this Account?')) {
            let newBankDB = { ...bankDB }
            newBankDB.client.forEach((value) => {
                if (value.id === client.id) {
                    value.status = AccountStatusEnum.Close
                }
            })
            setBankDB(newBankDB)
            setMessageText('Client account was successfully closed')
            setMessageBarType(MessageBarType.success)
            openMessage()
        }
    }

    const [isAddClient, { setTrue: openAddClient, setFalse: dismissAddClient }] = useBoolean(false)

    //Update a account holder(Client)
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
        setMessageText('Client details were successfully Updated')
        setMessageBarType(MessageBarType.success)
        openMessage()
    }

    //Revoke a transaction if from same bank
    function revokeTransaction(transaction: ITransaction) {
        if (transaction.toBankName === transaction.fromBankName) {
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
        } else {
            let newBankDB = { ...bankDB }
            newBankDB.client.forEach((value) => {
                if (value.id === transaction.toAccountId) {
                    value.transactions.forEach((t) => {
                        if (t.id === transaction.id) {
                            t.status = TransactionStatus.Revoked
                            console.log(t);
                        }
                    })
                }
            })

            setBankDB(newBankDB)
            revokeTransactionFromAccount(transaction)
        }
        setMessageText('Transaction was successfully Revoked')
        setMessageBarType(MessageBarType.success)
        openMessage()
    }

    const pivotStyles: IStyleFunctionOrObject<IPivotStyleProps, IPivotStyles> = {
        root: {
            paddingBottom: '40px',
            marginTop: '20px'
        }
    }

    const activeAccounts = bankDB.client.filter((client) => (client.status === AccountStatusEnum.Open))
    const closedAccounts = bankDB.client.filter((client) => (client.status === AccountStatusEnum.Close))

    return (
        <div className="ms-Grid" dir="ltr">
            <div className="ms-Grid-row staff-dashboard__title-row">
                <div className="ms-Grid-col ms-md6">
                    <h1 className="staff-dashboard--title">Staff Dashboard | {bankDB.name}</h1>

                </div>
                <div className="ms-Grid-col ms-mdPush5">
                    <PrimaryButton className="staff-dashboard--logout" text="Logout" onClick={logOut} />

                </div>
            </div>
            <div className="ms-Grid-row">
                <h1 className="staff-dashboard--client-name">Welcome, {staff.name}</h1>
            </div>
            {
                isMessage && <MessageBar
                    onDismiss={closeMessage}
                    messageBarType={messageBarType}
                >
                    {messageText}
                </MessageBar>
            }
            <Pivot styles={pivotStyles} linkSize={PivotLinkSize.large}>
                <PivotItem headerText="Clients">
                    <div className="ms-Grid-row">
                        <Separator alignContent="end">
                            <PrimaryButton iconProps={{
                                iconName: "Add"
                            }} className="staff-dashboard--add_client-btn" text="Add Client" onClick={openAddClient} />
                        </Separator>
                    </div>
                    <div className="ms-Grid-row">
                        {(bankDB.client.length === 0) ? <Separator alignContent="center"><p className="staff-dashboard--no-show">No Account Holders to Show</p></Separator> : <></>}
                        <h1 className="staff-dashboard--account-type">Active Accounts</h1>
                        {(activeAccounts.length === 0) ? <Separator alignContent="center"><p className="staff-dashboard--no-show">No Active Account Holders</p> </Separator> : <></>}
                        {
                            activeAccounts.map((client) => <ClientAccount bankName={bankDB.enum} key={`xxx-${client.id}`} updateAccount={updateClient} client={client} revokeTransaction={revokeTransaction} deleteAccount={deleteClient} />)
                        }
                    </div>
                    <div className="ms-Grid-row">
                        <h1 className="staff-dashboard--account-type">Closed Accounts</h1>
                        {(closedAccounts.length === 0) ? <Separator alignContent="center"><p className="staff-dashboard--no-show">No Closed Account Holders</p> </Separator> : <></>}
                        {
                            closedAccounts.map((client) => <ClientAccount bankName={bankDB.enum} key={`xxx-${client.id}`} updateAccount={updateClient} client={client} revokeTransaction={revokeTransaction} deleteAccount={deleteClient} />)
                        }
                    </div>
                </PivotItem>
                <PivotItem headerText="Bank Settings">
                    <BankSettings bankDB={bankDB} setBankDB={setBankDB} />
                </PivotItem>
            </Pivot>
            <AddClient
                bankDB={bankDB}
                dismissAddClient={dismissAddClient}
                isAddClient={isAddClient}
                openMessage={openMessage}
                setBankDB={setBankDB}
                setMessageBarType={setMessageBarType}
                setMessageText={setMessageText}
            />
        </div>
    )
}

export default StaffDashboard
