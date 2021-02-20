import React from 'react'
import IBank from '../../common/interfaces/bank.interface'
import TransactionStatusEnum from '../../common/interfaces/transaction.status.enum'


interface IClientTransaction {
    amount: number,
    toAccountId: string,
    fromAccountId: string,
    status: TransactionStatusEnum,
    id: string
    bankDB: IBank
}
function ClientTransaction({ amount, fromAccountId, id, status, toAccountId, bankDB }: IClientTransaction) {

    function transactionStatus(status: TransactionStatusEnum): string {
        if (status === TransactionStatusEnum.Success)
            return "Success"
        else if (status === TransactionStatusEnum.Failed)
            return "Failed"
        else return "Revoked"
    }


    return (
        <div>
            <h1>{amount}</h1>
            <h1>{fromAccountId}</h1>
            <h1>{toAccountId}</h1>
            <h1>{transactionStatus(status)}</h1>
            <hr />
        </div>
    )
}

export default ClientTransaction
