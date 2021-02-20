import { useState } from 'react'
import IDashboard from '../../common/interfaces/bank.dashboard.interface'
import { PrimaryButton, Modal, TextField, DefaultButton } from '@fluentui/react'
import { useHistory } from 'react-router-dom'
import ClientTransaction from './client.transaction'
import TransactionStatus from '../../common/interfaces/transaction.status.enum'
import { useBoolean } from '@uifabric/react-hooks'
import ITransaction from '../../common/interfaces/client.transaction.interface'
import TransactionStatusEnum from '../../common/interfaces/transaction.status.enum'
import { createTransactionId } from '../../common/services/bank.id.creation'

function ClientDashboard({ bankDB, loginSession, setBankDB, setLoginSession }: IDashboard) {

    const history = useHistory()
    const [isDepositModal, { setTrue: openDepositModal, setFalse: dismissDepositModal }] = useBoolean(false)
    const [isWithdrawModal, { setTrue: openWithdrawModal, setFalse: dismissWithdrawModal }] = useBoolean(false)
    const [isTransactModal, { setTrue: openTransactModal, setFalse: dismissTransactModal }] = useBoolean(false)

    const [depositAmount, setDepositAmount] = useState('')
    const [withdrawAmount, setWithdrawAmount] = useState('')

    interface ITransactAmount {
        toAccountId: string,
        amount: string
    }

    const [transactAmount, setTransactAmount] = useState<ITransactAmount>({
        amount: '0',
        toAccountId: loginSession.currentId!
    })

    if (loginSession.currentId === undefined) {
        history.push('/')
    }

    let clientAccount = bankDB.client.filter((client) => {
        if (client.id === loginSession.currentId) {
            return true
        } else return false
    })[0]

    let transactions = clientAccount.transactions

    const balance = Object.values(transactions.map((val) => (val.status === TransactionStatus.Success) ? val.amount : 0)).reduce((a, b) => a + b)

    function logOut() {
        let newLoginSession = loginSession!
        newLoginSession.currentId = undefined
        newLoginSession.isLoggedIn = false
        newLoginSession.isStaff = false
        setLoginSession(newLoginSession)
        history.push('/')
    }



    const transactAmountSet = (amount: string) => {
        let newTransactAmount: ITransactAmount = {
            ...transactAmount,
            amount: amount
        }
        setTransactAmount(newTransactAmount)
    }

    const transactPayeeIdSet = (toAccountId: string) => {
        let newTransactAmount: ITransactAmount = {
            ...transactAmount,
            toAccountId: toAccountId
        }
        setTransactAmount(newTransactAmount)
    }

    function depositAmountProcess() {
        dismissDepositModal()
        const amount: number = Number.parseFloat(depositAmount)
        const tempTransaction: ITransaction = {
            amount: amount,
            fromAccountId: loginSession.currentId!,
            toAccountId: loginSession.currentId!,
            status: TransactionStatusEnum.Success,
            id: createTransactionId(bankDB.id, loginSession.currentId!)
        }
        transactions.unshift(tempTransaction)

        bankDB.client.forEach((client) => {
            if (client.id === loginSession.currentId!) {
                client.transactions = transactions
            }
        })

        setBankDB(bankDB)
    }

    function withdrawAmountProcess() {
        dismissWithdrawModal()
        const amount: number = Number.parseFloat(withdrawAmount)
        if (amount > balance) {
            window.alert('Insufficient Balance')
            return
        }

        const tempTransaction: ITransaction = {
            amount: amount * -1,
            fromAccountId: loginSession.currentId!,
            toAccountId: loginSession.currentId!,
            status: TransactionStatusEnum.Success,
            id: createTransactionId(bankDB.id, loginSession.currentId!)
        }
        transactions.unshift(tempTransaction)

        bankDB.client.forEach((client) => {
            if (client.id === loginSession.currentId!) {
                client.transactions = transactions
            }
        })

        setBankDB(bankDB)
    }

    function transactAmountProcess() {
        dismissTransactModal()

        if (Number.parseFloat(transactAmount.amount) > balance) {
            window.alert('Insufficient Fund')
        }
        else {
            let tempTransaction: ITransaction = {
                amount: Number.parseFloat(transactAmount.amount),
                fromAccountId: loginSession.currentId!,
                toAccountId: transactAmount.toAccountId,
                id: createTransactionId(bankDB.id, loginSession.currentId!),
                status: TransactionStatusEnum.Success
            }

            bankDB.client.forEach((client) => {
                if (client.id === tempTransaction.fromAccountId) {
                    const superTemp = { ...tempTransaction }
                    superTemp.amount = superTemp.amount * -1
                    client.transactions.unshift(superTemp)
                } else if (client.id === tempTransaction.toAccountId) {
                    client.transactions.unshift(tempTransaction)
                }
            })

            setBankDB(bankDB)
        }

    }

    return (
        <div>
            <h1>Client Dashboard</h1>
            <PrimaryButton text="Logout" onClick={logOut} />
            <br />
            <PrimaryButton text="Deposit" onClick={openDepositModal} />
            <PrimaryButton text="Withdraw" onClick={openWithdrawModal} />
            <PrimaryButton text="Transact" onClick={openTransactModal} />

            <h1>Hi {clientAccount.name}</h1>
            <p>You current balance is <b>&#8377; {balance}</b></p>

            <br />
            {
                transactions.map((value) => {
                    return <ClientTransaction amount={value.amount} fromAccountId={value.fromAccountId} id={value.id} status={value.status} toAccountId={value.toAccountId} key={value.id} bankDB={bankDB} />
                })
            }

            <Modal isOpen={isDepositModal} onDismiss={dismissDepositModal}>
                <TextField label="Deposit Amount" onChange={(e, value) => setDepositAmount(value!)} />
                <PrimaryButton text="Deposit" onClick={depositAmountProcess} />
                <DefaultButton text="Cancel" onClick={dismissDepositModal} />
            </Modal>

            <Modal isOpen={isWithdrawModal} onDismiss={dismissWithdrawModal}>
                <TextField label="Withdraw Amount" onChange={(e, value) => setWithdrawAmount(value!)} />
                <PrimaryButton text="Withdraw" onClick={withdrawAmountProcess} />
                <DefaultButton text="Cancel" onClick={dismissWithdrawModal} />
            </Modal>

            <Modal isOpen={isTransactModal} onDismiss={dismissTransactModal}>
                <TextField label="Transaction Amount" onChange={(e, value) => transactAmountSet(value!)} />
                <TextField label="Payee Account Number" onChange={(e, value) => transactPayeeIdSet(value!)} />
                <PrimaryButton text="Transact" onClick={transactAmountProcess} />
                <DefaultButton text="Cancel" onClick={dismissTransactModal} />
            </Modal>


        </div>
    )
}

export default ClientDashboard
