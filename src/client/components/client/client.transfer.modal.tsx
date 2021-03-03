import { useState } from 'react'
import { v4 as uuidV4 } from 'uuid'
import AccountStatusEnum from '../../common/interfaces/acount.status.enum'
import { createTransactionId } from '../../common/services/bank.id.creation'
import {
    PrimaryButton, Modal, TextField, DefaultButton,
    IDropdownOption,
    Dropdown,
    MessageBarType
} from '@fluentui/react'
import TransactionStatusEnum from '../../common/interfaces/transaction.status.enum'
import BankNameEnum from '../../common/interfaces/bank.name.enum'
import Ilogin from '../../common/interfaces/bank.login.interface'
import IBank from '../../common/interfaces/bank.interface'
import ITransaction from '../../common/interfaces/client.transaction.interface'
import { useBoolean } from '@uifabric/react-hooks'

//Interface for the component
interface IClientTransferModal {
    loginSession: Ilogin,
    bankDB: IBank,
    dismissTransactModal: Function,
    setMessageText: Function,
    setMessageBarType: Function,
    openMessage: Function,
    isTransactModal: boolean,
    setBankDB: Function,
    otherBankTransfer: Function,
    balance: number
}

//Interface for the Transact Action
interface ITransactAmount {
    toAccountId: string,
    amount: string,
    toBankName: BankNameEnum
}

function ClientTransferModal({ loginSession, balance, otherBankTransfer, setBankDB, bankDB, dismissTransactModal, isTransactModal, openMessage, setMessageBarType, setMessageText }: IClientTransferModal) {

    const [transactAmount, setTransactAmount] = useState<ITransactAmount>({
        amount: '0',
        toAccountId: loginSession.currentId!,
        toBankName: BankNameEnum.None
    })
    const [transferType, setTransferType] = useState('rtgs')
    const [transferToBank, setTransferToBank] = useState(bankDB.enum)
    const [isAmountValid, { setTrue: amountInvalid, setFalse: amountValid }] = useBoolean(true)

    //Set the state of the transact amount
    const transactAmountSet = (amount: string) => {
        let newTransactAmount: ITransactAmount = {
            ...transactAmount,
            amount: amount
        }
        setTransactAmount(newTransactAmount)
    }

    //Set the state of the ID of the receiver
    const transactPayeeIdSet = (toAccountId: string) => {
        let newTransactAmount: ITransactAmount = {
            ...transactAmount,
            toAccountId: toAccountId
        }
        setTransactAmount(newTransactAmount)
    }
    //Transact the amount intra or inter bank
    function transactAmountProcess() {
        amountInvalid()
        dismissTransactModal()
        try {
            const amount = Math.abs(Number.parseFloat(transactAmount.amount))
            if (amount > balance) {
                setMessageText('Insufficient Balance')
                setMessageBarType(MessageBarType.severeWarning)
                openMessage()
            }
            else {

                let charge: number = 0
                if (transferToBank === bankDB.enum) {
                    if (transferType === 'rtgs') {
                        charge = bankDB.rtgs.same
                    } else {
                        charge = bankDB.imps.same
                    }
                } else {
                    if (transferType === 'rtgs') {
                        charge = bankDB.rtgs.other
                    } else {
                        charge = bankDB.imps.other
                    }
                }
                const date = new Date()
                let tempTransaction: ITransaction = {
                    amount: amount,
                    fromAccountId: loginSession.currentId!,
                    toAccountId: transactAmount.toAccountId,
                    id: createTransactionId(bankDB.id, loginSession.currentId!),
                    status: TransactionStatusEnum.Success,
                    datetime: date.toString(),
                    toBankName: transferToBank,
                    fromBankName: bankDB.enum,
                    charges: charge
                }

                if (tempTransaction.toBankName === bankDB.enum) {
                    let flagAccountValid = false
                    bankDB.client.forEach((client) => {
                        if (client.id === tempTransaction.toAccountId && client.status === AccountStatusEnum.Open) {
                            client.transactions.unshift(tempTransaction)
                            flagAccountValid = true
                        }
                    })

                    if (flagAccountValid) {
                        bankDB.client.forEach((client) => {
                            if (client.id === tempTransaction.fromAccountId) {
                                const superTemp = { ...tempTransaction }
                                superTemp.amount = (superTemp.amount + superTemp.charges) * -1
                                client.transactions.unshift(superTemp)
                            }
                        })

                        setMessageText('Transaction was successful')
                        setMessageBarType(MessageBarType.success)
                        openMessage()
                        setBankDB(bankDB)
                    } else {
                        setMessageText('No such account exists or the account is closed')
                        setMessageBarType(MessageBarType.severeWarning)
                        openMessage()
                    }
                } else {
                    let res = otherBankTransfer(tempTransaction)
                    if (res) {
                        setMessageText('Transaction was successful')
                        setMessageBarType(MessageBarType.success)
                        openMessage()
                    } else {
                        setMessageText('No such account exists or the account is closed')
                        setMessageBarType(MessageBarType.severeWarning)
                        openMessage()
                    }
                }
            }
        } catch (e) {
            setMessageText('Something went wrong while processing the transaction')
            setMessageBarType(MessageBarType.severeWarning)
            openMessage()
        }

    }


    const transferMode: IDropdownOption[] = [{
        key: 'rtgs',
        text: 'RTGS'
    }, {
        key: 'imps',
        text: 'IMPS'
    }
    ]

    const bankNameOptions: IDropdownOption[] = [
        {
            key: BankNameEnum.Technovert,
            text: 'Technovert Bank',
            data: BankNameEnum.Technovert
        },
        {
            key: BankNameEnum.Saketa,
            text: 'Saketa Bank',
            data: BankNameEnum.Saketa
        },
        {
            key: BankNameEnum.Keka,
            text: 'Keka Bank',
            data: BankNameEnum.Keka
        },
    ]


    return (
        <Modal isOpen={isTransactModal} className="client-dashboard__transact-modal">
            <Dropdown
                key={uuidV4()}
                defaultSelectedKey={transferToBank}
                options={bankNameOptions}
                label="Select Bank"
                required
                onChange={(e, option) => {
                    setTransferToBank(option?.data)
                }}
                className="client-dashboard__transact-modal--bank"
            />
            <TextField label="Payee Account Number" required onChange={(e, value) => transactPayeeIdSet(value!)} className="client-dashboard__transact-modal--account" />
            <Dropdown
                key={uuidV4()}
                options={transferMode}
                label="Transfer Mode"
                required
                defaultSelectedKey={transferType}
                onChange={(e, option) => {
                    setTransferType(option?.key.toString()!)
                }}
                className="client-dashboard__transact-modal--transfer"
            />
            <TextField label="Transaction Amount" required prefix="&#8377;" type="number" className="client-dashboard__transact-modal--amount" onChange={(e, value) => {
                if (value?.length! > 0) {
                    amountValid()
                    transactAmountSet(value!)
                } else {
                    amountInvalid()
                }
            }} minLength={1} />
            <PrimaryButton text="Transact" className="client-dashboard__transact-modal--submit" onClick={transactAmountProcess} disabled={isAmountValid} />
            <DefaultButton text="Cancel" className="client-dashboard__transact-modal--cancel" onClick={() => {
                amountInvalid()
                dismissTransactModal()
            }} />
        </Modal>


    )
}

export default ClientTransferModal
