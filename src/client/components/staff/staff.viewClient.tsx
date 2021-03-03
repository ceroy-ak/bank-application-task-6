import React from 'react'
import BankNameEnum from '../../common/interfaces/bank.name.enum'
import IAccountHolder from '../../common/interfaces/client.account.interface'
import ClientTransactionStaff from './staff.client.transaction'
import { Panel, PanelType, DefaultButton } from '@fluentui/react'

interface IViewClient {
    client: IAccountHolder,
    revokeTransaction: Function,
    bankName: BankNameEnum,
    dismissViewAccount: any,
    isViewAccount: boolean
}

function ViewClient({ bankName, client, dismissViewAccount, revokeTransaction, isViewAccount }: IViewClient) {
    return (
        <Panel isOpen={isViewAccount} className="ms-Grid" onDismiss={dismissViewAccount} headerText={client.name} type={PanelType.custom} customWidth='500px'>
            <hr />
            {(client.transactions.length === 0) ? <p>No Transactions Available</p> :
                client.transactions.map((value) => {
                    return <ClientTransactionStaff transaction={value} key={value.id} revokeTransaction={revokeTransaction} currBankName={bankName} />
                })
            }
            <DefaultButton text="Close" onClick={dismissViewAccount} />
        </Panel>
    )
}

export default ViewClient
