import { useState } from 'react'
import IBank from '../../common/interfaces/bank.interface'
import Ilogin from '../../common/interfaces/bank.login.interface'
import ITransaction from '../../common/interfaces/client.transaction.interface'
import { useBoolean } from '@uifabric/react-hooks'
import { Modal, TextField, PrimaryButton, DefaultButton, MessageBarType } from '@fluentui/react'
import TransactionStatusEnum from '../../common/interfaces/transaction.status.enum'
import { createTransactionId } from '../../common/services/bank.id.creation'

interface IClientWithdrawModal {
    isWithdrawModal: boolean,
    dismissWithdrawModal: Function,
    bankDB: IBank,
    loginSession: Ilogin,
    setMessageText: Function,
    setMessageBarType: Function,
    openMessage: Function,
    transactions: ITransaction[],
    setBankDB: Function,
    balance: number
}

function ClientWithdrawModal({ isWithdrawModal, balance, dismissWithdrawModal, bankDB, loginSession, openMessage, setBankDB, setMessageBarType, setMessageText, transactions }: IClientWithdrawModal) {

    const [isAmountValid, { setTrue: amountInvalid, setFalse: amountValid }] = useBoolean(true)
    const [withdrawAmount, setWithdrawAmount] = useState('')

    //Withdraw the amount
    function withdrawAmountProcess() {
        dismissWithdrawModal()
        amountInvalid()
        const amount: number = Math.abs(Number.parseFloat(withdrawAmount))
        if (amount > balance) {
            setMessageText('Insufficient Balance')
            setMessageBarType(MessageBarType.severeWarning)
            openMessage()
            return
        }

        const date = new Date()
        const tempTransaction: ITransaction = {
            amount: amount * -1,
            fromAccountId: loginSession.currentId!,
            toAccountId: loginSession.currentId!,
            status: TransactionStatusEnum.Success,
            id: createTransactionId(bankDB.id, loginSession.currentId!),
            datetime: date.toString(),
            toBankName: bankDB.enum,
            fromBankName: bankDB.enum,
            charges: 0
        }
        transactions.unshift(tempTransaction)

        bankDB.client.forEach((client) => {
            if (client.id === loginSession.currentId!) {
                client.transactions = transactions
            }
        })

        setMessageText('Withdraw was Successful')
        setMessageBarType(MessageBarType.success)
        openMessage()
        setBankDB(bankDB)
    }


    return (
        <Modal className="client-dashboard--modal" isOpen={isWithdrawModal}>
            <TextField className="client-dashboard--modal-input" type="number" prefix="&#8377;" label="Withdraw Amount" placeholder="Enter valid amount" onChange={(e, value) => {
                if (value?.length === 0) {
                    amountInvalid()
                } else {
                    amountValid()
                    setWithdrawAmount(value!)
                }
            }} />
            <PrimaryButton className="client-dashboard--modal-btn" text="Withdraw" onClick={withdrawAmountProcess} disabled={isAmountValid} />
            <DefaultButton className="client-dashboard--modal-cancel" text="Cancel" onClick={() => {
                amountInvalid()
                dismissWithdrawModal()
            }} />
        </Modal>
    )
}

export default ClientWithdrawModal
