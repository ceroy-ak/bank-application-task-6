import React from 'react'
import ITransaction from '../../common/interfaces/client.transaction.interface'
import TransactionStatusEnum from '../../common/interfaces/transaction.status.enum'
import { PrimaryButton, Icon } from '@fluentui/react'
import BankNameEnum from '../../common/interfaces/bank.name.enum'
import bankNameFinder from '../../common/services/bankName'

interface ICLientTransactionStaff {
    transaction: ITransaction,
    revokeTransaction: Function,
    currBankName: BankNameEnum
}

function ClientTransactionStaff({ transaction, revokeTransaction, currBankName }: ICLientTransactionStaff) {
    return (
        <div className="ms-Grid-row" dir="ltr">
            <div className="ms-Grid-col ms-sm12 staff-dashboard--transaction">
                <div className="ms-Grid-row staff-dashboard--transaction-from">
                    <p>{transaction.fromAccountId} - {bankNameFinder(transaction.fromBankName)}</p>
                </div>
                <div className="ms-Grid-row staff-dashboard--transaction-arrow">
                    <Icon iconName="Down" />
                </div>
                <div className="ms-Grid-row staff-dashboard--transaction-to">
                    <p>{transaction.toAccountId} - {bankNameFinder(transaction.toBankName)}</p>
                </div>
                <div className="ms-Grid-row staff-dashboard--transaction-status">
                    <p style={{ color: `${(transaction.status === TransactionStatusEnum.Success) ? 'green' : 'red'}` }}>{(transaction.status === TransactionStatusEnum.Success) ? 'Sucess' : 'Revoked'}</p>
                </div>
                <div className="ms-Grid-row staff-dashboard--transaction-amount">
                    <p>&#8377; {Math.abs(transaction.amount).toFixed(2)}</p>
                </div>
                <div className="ms-Grid-row staff-dashboard--transaction-id">
                    <p>{transaction.id}</p>
                </div>
                <div className="ms-Grid-row staff-dashboard--transaction-btn">
                    {
                        (transaction.status !== TransactionStatusEnum.Revoked) ?
                            <PrimaryButton
                                text={(transaction.toBankName === currBankName) ? "Revoke" : `Contact ${(transaction.toBankName === BankNameEnum.Technovert) ? "Technovert Bank" : (transaction.toBankName === BankNameEnum.Saketa) ? "Saketa Bank" : "Keka Bank"}`}
                                onClick={() => revokeTransaction(transaction)}
                                disabled={(transaction.toBankName === currBankName) ? false : true}
                            /> : <></>
                    }
                </div>
            </div>


        </div>
    )
}

export default ClientTransactionStaff
