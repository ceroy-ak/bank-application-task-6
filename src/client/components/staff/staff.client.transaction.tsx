import React from 'react'
import ITransaction from '../../common/interfaces/client.transaction.interface'
import TransactionStatusEnum from '../../common/interfaces/transaction.status.enum'
import { PrimaryButton } from '@fluentui/react'

interface ICLientTransactionStaff {
    transaction: ITransaction,
    revokeTransaction: Function
}

function ClientTransactionStaff({ transaction, revokeTransaction }: ICLientTransactionStaff) {
    return (
        <div>
            <p>From: {transaction.fromAccountId}</p>
            <p>To: {transaction.toAccountId}</p>
            <p>{(transaction.status === TransactionStatusEnum.Success) ? 'Sucess' : 'Revoked'}</p>
            <p>Amount: {transaction.amount}</p>
            <p>Transaction: {transaction.id}</p>
            {(transaction.status !== TransactionStatusEnum.Revoked) ? <PrimaryButton text="Revoke" onClick={() => revokeTransaction(transaction)} /> : <></>}
            <hr />
        </div>
    )
}

export default ClientTransactionStaff
