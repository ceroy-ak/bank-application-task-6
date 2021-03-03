import React from 'react'
import ITransaction from '../../common/interfaces/client.transaction.interface'
import {
    DetailsList, IColumn,
    CheckboxVisibility, DetailsListLayoutMode, ConstrainMode, TooltipHost
} from '@fluentui/react'
import IBank from '../../common/interfaces/bank.interface'
import Ilogin from '../../common/interfaces/bank.login.interface'
import BankNameEnum from '../../common/interfaces/bank.name.enum'
import TransactionStatusEnum from '../../common/interfaces/transaction.status.enum'


interface IClientTransactionDetails {
    items: ITransaction[],
    bankDB: IBank,
    loginSession: Ilogin
}
function ClientTransactionDetails({ items, bankDB, loginSession }: IClientTransactionDetails) {

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
                if (item.status === TransactionStatusEnum.Success)
                    return <span style={{ color: "green" }}>Success</span>
                else if (item.status === TransactionStatusEnum.Revoked) return <span style={{ color: "red" }}>Revoked</span>
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

    return (
        <DetailsList

            items={items}
            constrainMode={ConstrainMode.unconstrained}
            layoutMode={DetailsListLayoutMode.justified}
            columns={columns}
            checkboxVisibility={CheckboxVisibility.hidden}
        />
    )
}



export default ClientTransactionDetails
