import { useState } from 'react'
import { Modal, MessageBarType, IDropdownOption, Dropdown, PrimaryButton, DefaultButton, TextField } from '@fluentui/react'
import IBank from '../../common/interfaces/bank.interface'
import Ilogin from '../../common/interfaces/bank.login.interface'
import ITransaction from '../../common/interfaces/client.transaction.interface'
import TransactionStatusEnum from '../../common/interfaces/transaction.status.enum'
import { useBoolean } from '@uifabric/react-hooks'
import { createTransactionId } from '../../common/services/bank.id.creation'
import { v4 as uuidV4 } from 'uuid'


interface IClientDepositModal {
    isDepositModal: boolean,
    dismissDepositModal: Function,
    bankDB: IBank,
    loginSession: Ilogin,
    setMessageText: Function,
    setMessageBarType: Function,
    openMessage: Function,
    transactions: ITransaction[],
    setBankDB: Function
}

function ClientDepositModal({ isDepositModal, setBankDB, transactions, dismissDepositModal, bankDB, loginSession, openMessage, setMessageBarType, setMessageText }: IClientDepositModal) {

    const [depositAmount, setDepositAmount] = useState('0')
    const [exchangeCurrency, setExchangeCurrency] = useState('INR')
    const [isAmountValid, { setTrue: amountInvalid, setFalse: amountValid }] = useBoolean(true)

    const currencyOptions: IDropdownOption[] = []
    bankDB.currency.forEach((currency) => {
        currencyOptions.push({
            key: currency.currency,
            text: currency.currency,
        })
    })

    //Deposit the amount 
    function depositAmountProcess() {
        dismissDepositModal()
        amountInvalid()
        try {
            let amount: number = Number.parseFloat(depositAmount)
            const date = new Date()
            let exchangeRate: number = 1;
            bankDB.currency.forEach((value) => {
                if (value.currency === exchangeCurrency && value.currency !== 'INR') {
                    exchangeRate = value.exchangeRate
                }
            })
            amount = Number.parseFloat((amount * exchangeRate).toFixed(2))


            const tempTransaction: ITransaction = {
                amount: amount,
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
            setMessageText('Deposit was successful')
            setMessageBarType(MessageBarType.success)
            openMessage()
            setExchangeCurrency('INR')
            setBankDB(bankDB)
        }
        catch (e) {
            setMessageText('Something Went Wrong with Deposit')
            setMessageBarType(MessageBarType.severeWarning)
            openMessage()
            return
        }
    }
    return (
        <Modal className="client-dashboard--modal" isOpen={isDepositModal}>
            <Dropdown
                key={uuidV4()}
                options={currencyOptions}
                label="Currency"
                defaultSelectedKey={exchangeCurrency}
                required
                className="client-dashboard--modal-dropdown"
                onChange={(e, option) => setExchangeCurrency(option?.text ?? 'INR')}
            />
            <TextField required className="client-dashboard--modal-input" label="Deposit Amount" type="number" placeholder="Enter valid amount" onChange={(e, value) => {
                if (value?.length === 0) {
                    amountInvalid()
                } else {
                    amountValid()
                    setDepositAmount(value!)
                }
            }} />
            <PrimaryButton className="client-dashboard--modal-btn" text="Deposit" onClick={depositAmountProcess} disabled={isAmountValid} />
            <DefaultButton className="client-dashboard--modal-cancel" text="Cancel" onClick={() => {
                amountInvalid()
                dismissDepositModal()
            }} />
        </Modal>
    )
}

export default ClientDepositModal
