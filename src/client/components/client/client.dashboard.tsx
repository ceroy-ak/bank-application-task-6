import { useState } from 'react'
import IDashboard from '../../common/interfaces/bank.dashboard.interface'
import {
    PrimaryButton, Modal, TextField, DefaultButton, DetailsList, IColumn,
    CheckboxVisibility, DetailsListLayoutMode, ConstrainMode,
    IDropdownOption,
    TooltipHost,
    Dropdown
} from '@fluentui/react'
import { useHistory } from 'react-router-dom'
import TransactionStatus from '../../common/interfaces/transaction.status.enum'
import { useBoolean } from '@uifabric/react-hooks'
import ITransaction from '../../common/interfaces/client.transaction.interface'
import TransactionStatusEnum from '../../common/interfaces/transaction.status.enum'
import { createTransactionId } from '../../common/services/bank.id.creation'
import BankNameEnum from '../../common/interfaces/bank.name.enum'
import { v4 as uuidV4 } from 'uuid'
import AccountStatusEnum from '../../common/interfaces/acount.status.enum'


interface IClientDashBoard extends IDashboard {
    otherBankTransfer: Function,
    chooseBank: Function
}
function ClientDashboard({ bankDB, loginSession, setBankDB, setLoginSession, otherBankTransfer, chooseBank }: IClientDashBoard) {

    //Booleans to control the opening and closing of the modals and setting of the values
    const history = useHistory()
    const [isWithdrawModal, { setTrue: openWithdrawModal, setFalse: dismissWithdrawModal }] = useBoolean(false)
    const [isTransactModal, { setTrue: openTransactModal, setFalse: dismissTransactModal }] = useBoolean(false)
    const [withdrawAmount, setWithdrawAmount] = useState('')

    //Common states for Modal
    const [exchangeCurrency, setExchangeCurrency] = useState('INR')
    const [isAmountValid, { setTrue: amountInvalid, setFalse: amountValid }] = useBoolean(true)


    //Deposit Modal
    const [isDepositModal, { setTrue: openDepositModal, setFalse: dismissDepositModal }] = useBoolean(false)
    const [depositAmount, setDepositAmount] = useState('0')

    //Transaction Modal
    const [transferType, setTransferType] = useState('rtgs')
    const [transferToBank, setTransferToBank] = useState(bankDB.enum)

    //Interface for the Transact Action
    interface ITransactAmount {
        toAccountId: string,
        amount: string,
        toBankName: BankNameEnum
    }

    const [transactAmount, setTransactAmount] = useState<ITransactAmount>({
        amount: '0',
        toAccountId: loginSession.currentId!,
        toBankName: BankNameEnum.None
    })

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

        balance = Object.values(transactions.map((val) => (val.status === TransactionStatus.Success) ? val.amount : 0)).reduce((a, b) => a + b)
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
            setExchangeCurrency('INR')
            setBankDB(bankDB)
        }
        catch (e) {
            alert('Something went wrong' + e)
            return
        }
    }

    //Withdraw the amount
    function withdrawAmountProcess() {
        dismissWithdrawModal()
        amountInvalid()
        const amount: number = Number.parseFloat(withdrawAmount)
        if (amount > balance) {
            window.alert('Insufficient Balance')
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

        setBankDB(bankDB)
    }

    //Transact the amount intra or inter bank
    function transactAmountProcess() {
        dismissTransactModal()
        try {
            if (Number.parseFloat(transactAmount.amount) > balance) {
                window.alert('Insufficient Fund')
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
                    amount: Number.parseFloat(transactAmount.amount),
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
                        setBankDB(bankDB)
                    } else {
                        window.alert('No Such account exists. Please check Bank and Account Id')
                    }
                } else {

                    otherBankTransfer(tempTransaction)
                }
            }
        } catch (e) {
            window.alert('Something Went Wrong during processing the transaction')
        }

    }



    //Columns for DetailsList
    const columns: IColumn[] = [
        {
            key: "dateTime",
            minWidth: 50,
            maxWidth: 100,
            name: "Date & Time",
            onRender: (item: ITransaction) => {
                const date = new Date(item.datetime)
                return (
                    <TooltipHost
                        content={date.toLocaleTimeString()}
                    >
                        {date.toDateString()}
                    </TooltipHost>)
            },
            isResizable: true
        },
        {
            key: "transactionId",
            minWidth: 50,
            maxWidth: 250,
            name: "Transaction ID",
            onRender: (item: ITransaction) => {
                return (
                    <TooltipHost
                        content={item.id}
                    >
                        {item.id}
                    </TooltipHost>)
            },
            isResizable: true
        },
        {
            key: "sender",
            minWidth: 80,
            maxWidth: 250,
            name: "From",
            onRender: (item: ITransaction) => {
                let senderText = "unknown"

                if (item.toAccountId === item.fromAccountId || item.fromAccountId === loginSession.currentId) {
                    senderText = "Self"
                } else {
                    if (item.fromBankName === bankDB.enum) {
                        senderText = `${item.fromAccountId} - ${(bankDB.enum === BankNameEnum.Technovert) ? 'Technovert Bank' : (bankDB.enum === BankNameEnum.Keka) ? 'Keka Bank' : 'Saketa Bank'}`
                    } else {
                        senderText = `${item.fromAccountId} - ${(item.fromBankName === BankNameEnum.Technovert) ? 'Technovert Bank' : (item.fromBankName === BankNameEnum.Keka) ? 'Keka Bank' : 'Saketa Bank'}`

                    }
                }
                return <TooltipHost content={senderText}>{senderText}</TooltipHost>
            },
            isResizable: true
        },

        {
            key: "receiver",
            minWidth: 80,
            maxWidth: 250,
            name: "To",
            onRender: (item: ITransaction) => {
                let receiverText = "unknown"

                if (item.toAccountId === item.fromAccountId || item.toAccountId === loginSession.currentId) {
                    receiverText = "Self"
                } else {
                    if (item.toBankName === bankDB.enum) {
                        receiverText = `${item.toAccountId} - ${(bankDB.enum === BankNameEnum.Technovert) ? 'Technovert Bank' : (bankDB.enum === BankNameEnum.Keka) ? 'Keka Bank' : 'Saketa Bank'}`
                    } else {
                        receiverText = `${item.toAccountId} - ${(item.toBankName === BankNameEnum.Technovert) ? 'Technovert Bank' : (item.toBankName === BankNameEnum.Keka) ? 'Keka Bank' : 'Saketa Bank'}`

                    }
                }
                return <TooltipHost content={receiverText}>{receiverText}</TooltipHost>
            },
            isResizable: true
        },
        {
            key: "type",
            minWidth: 50,
            maxWidth: 150,
            isResizable: true,
            name: "Type",
            onRender: (item: ITransaction) => {
                let type = "unknown"

                if (item.toAccountId === item.fromAccountId) {
                    if (item.amount < 0) {
                        type = "Withdraw"
                    } else {
                        type = "Deposit"
                    }
                } else {
                    if (item.amount < 0) {
                        type = "Transact - Sent"
                    } else {
                        type = "Transact - Received"
                    }
                }
                return <span>{type}</span>
            },
        },
        {
            key: "status",
            minWidth: 50,
            maxWidth: 50,
            name: "Status",
            onRender: (item: ITransaction) => {
                if (item.status === TransactionStatus.Success)
                    return <span style={{ color: "green" }}>Success</span>
                else if (item.status === TransactionStatus.Revoked) return <span style={{ color: "red" }}>Revoked</span>
                else return <span style={{ color: "yellow" }}>Failed</span>
            },
            isResizable: true
        },
        {
            key: "charges",
            minWidth: 50,
            maxWidth: 80,
            name: "Charges",
            isResizable: true,
            onRender: (item: ITransaction) => {
                let charge = item.charges.toFixed(2)
                return <span style={{ color: `${(item.status !== TransactionStatusEnum.Success) ? '#c8c6c4' : '#252423'}` }}><b>&#8377; {charge}</b></span>
            }
        },
        {
            key: "debit",
            minWidth: 50,
            maxWidth: 80,
            name: "Debit",
            isResizable: true,
            onRender: (item: ITransaction) => {
                let debit = '-'
                if (item.amount < 0) {
                    debit = Math.abs(item.amount).toFixed(2)
                }
                return <span style={{ color: `${(item.status !== TransactionStatusEnum.Success) ? '#c8c6c4' : '#252423'}` }}><b>&#8377; {debit}</b></span>
            }
        },
        {
            key: "credit",
            minWidth: 50,
            maxWidth: 80,
            name: "Credit",
            isResizable: true,
            onRender: (item: ITransaction) => {
                let credit = '-'
                if (item.amount > 0) {
                    credit = item.amount.toFixed(2)
                }
                return <span style={{ color: `${(item.status !== TransactionStatusEnum.Success) ? '#c8c6c4' : '#252423'}` }}><b>&#8377; {credit}</b></span>
            }
        }
    ]


    const currencyOptions: IDropdownOption[] = []
    bankDB.currency.forEach((currency) => {
        currencyOptions.push({
            key: currency.currency,
            text: currency.currency,
        })
    })

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

                {(transactions.length === 0) ? <p>No Transactions to Show</p> : <></>}
                <DetailsList

                    items={transactions}
                    constrainMode={ConstrainMode.unconstrained}
                    layoutMode={DetailsListLayoutMode.justified}
                    columns={columns}
                    checkboxVisibility={CheckboxVisibility.hidden}
                />

            </div>


            {/*Deposit Modal */}
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



            {/*Withdraw Modal */}
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



            {/*Transaction Modal */}
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


        </div>
    )
}

export default ClientDashboard
