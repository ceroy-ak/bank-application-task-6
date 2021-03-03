import { useState } from 'react'
import IDashboard from '../../common/interfaces/bank.dashboard.interface'
import {
    PrimaryButton, Modal, TextField, DefaultButton,
    IDropdownOption,
    Dropdown,
    MessageBar, MessageBarType
} from '@fluentui/react'
import { useHistory } from 'react-router-dom'
import { useBoolean } from '@uifabric/react-hooks'
import ITransaction from '../../common/interfaces/client.transaction.interface'
import TransactionStatusEnum from '../../common/interfaces/transaction.status.enum'
import BankNameEnum from '../../common/interfaces/bank.name.enum'
import ClientTransactionDetails from './client.transaction.details'
import ClientDepositModal from './client.deposit.modal'
import ClientWithdrawModal from './client.withdraw.modal'
import ClientTransferModal from './client.transfer.modal'


interface IClientDashBoard extends IDashboard {
    otherBankTransfer: (t: ITransaction) => Boolean,
    chooseBank: Function
}
function ClientDashboard({ bankDB, loginSession, setBankDB, setLoginSession, otherBankTransfer, chooseBank }: IClientDashBoard) {

    //Booleans to control the opening and closing of the modals and setting of the values
    const history = useHistory()
    const [isWithdrawModal, { setTrue: openWithdrawModal, setFalse: dismissWithdrawModal }] = useBoolean(false)
    const [isTransactModal, { setTrue: openTransactModal, setFalse: dismissTransactModal }] = useBoolean(false)
    const [isDepositModal, { setTrue: openDepositModal, setFalse: dismissDepositModal }] = useBoolean(false)


    //For Message
    const [isMessage, { setTrue: openMessage, setFalse: closeMessage }] = useBoolean(false)
    const [messageBarType, setMessageBarType] = useState<MessageBarType>(MessageBarType.severeWarning)
    const [messageText, setMessageText] = useState('')

    if (loginSession.currentId === undefined) {
        logOut()
    }

    let clientAccount = bankDB.client.filter((client) => {
        if (client.id === loginSession.currentId) {
            return true
        } else return false
    })[0]

    let transactions = clientAccount.transactions
    let balance = 0

    //Calculating the balance of the account holder
    if (transactions.length > 0) {

        balance = Object.values(transactions.map((val) => (val.status === TransactionStatusEnum.Success) ? val.amount : 0).concat([0])).reduce((a?, b?) => a + b) ?? 0
    }

    function logOut() {
        let newLoginSession = loginSession!
        newLoginSession.currentId = undefined
        newLoginSession.isLoggedIn = false
        newLoginSession.isStaff = false
        chooseBank(BankNameEnum.None)
        setLoginSession(newLoginSession)
        history.push('/')
    }


    return (
        <div className="ms-Grid" dir="ltr">

            <div className="ms-Grid-row client-dashboard__title-row">
                <div className="ms-Grid-col ms-md6">
                    <h1 className="client-dashboard--title">Client Dashboard | {bankDB.name}</h1>
                </div>
                <div className="ms-Grid-col ms-mdPush5">
                    <PrimaryButton className="client-dashboard--logout" text="Logout" onClick={logOut} />
                </div>
            </div>

            <div className="ms-Grid-row">
                <h1 className="client-dashboard--client-name">Welcome, {clientAccount.name}</h1>
            </div>
            {   //Message Bar
                isMessage && <MessageBar
                    onDismiss={closeMessage}
                    messageBarType={messageBarType}
                >
                    {messageText}
                </MessageBar>
            }
            <div className="ms-Grid-row client-dashboard--balance-title">
                <p>Current Balance</p>
            </div>
            <div className="ms-Grid-row client-dashboard--balance-amount">
                <p>&#8377; {balance.toFixed(2)}</p>
            </div>

            <div className="ms-Grid-row client-dashboard--btn">
                <PrimaryButton text="Deposit" onClick={openDepositModal} />
                <PrimaryButton text="Withdraw" onClick={openWithdrawModal} />
                <PrimaryButton text="Transact" onClick={openTransactModal} />
            </div>



            <div className="ms-Grid-row">

                {(transactions.length === 0) ? <p>No Transactions to Show</p> : <ClientTransactionDetails bankDB={bankDB} loginSession={loginSession} items={transactions} />}

            </div>


            {/*Deposit Modal*/}
            <ClientDepositModal
                isDepositModal={isDepositModal}
                dismissDepositModal={dismissDepositModal}
                bankDB={bankDB}
                loginSession={loginSession}
                setMessageText={setMessageText}
                setMessageBarType={setMessageBarType}
                openMessage={openMessage}
                transactions={transactions}
                setBankDB={setBankDB}
            />

            {/*Withdraw Modal */}
            <ClientWithdrawModal
                balance={balance}
                bankDB={bankDB}
                dismissWithdrawModal={dismissWithdrawModal}
                isWithdrawModal={isWithdrawModal}
                loginSession={loginSession}
                openMessage={openMessage}
                setBankDB={setBankDB}
                setMessageBarType={setMessageBarType}
                setMessageText={setMessageText}
                transactions={transactions}
            />

            {/*Transfer Amount Modal */}
            <ClientTransferModal
                balance={balance}
                bankDB={bankDB}
                dismissTransactModal={dismissTransactModal}
                isTransactModal={isTransactModal}
                loginSession={loginSession}
                openMessage={openMessage}
                otherBankTransfer={otherBankTransfer}
                setBankDB={setBankDB}
                setMessageBarType={setMessageBarType}
                setMessageText={setMessageText}
            />

        </div>
    )
}

export default ClientDashboard
