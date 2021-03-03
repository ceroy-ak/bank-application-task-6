import IAccountHolder from '../../common/interfaces/client.account.interface'
import AccountStatusEnum from '../../common/interfaces/acount.status.enum'
import { PrimaryButton, Separator } from '@fluentui/react'
import { useBoolean } from '@uifabric/react-hooks'
import TransactionStatusEnum from '../../common/interfaces/transaction.status.enum'
import BankNameEnum from '../../common/interfaces/bank.name.enum'
import ViewClient from './staff.viewClient'
import UpdateClient from './staff.updateClient'

interface IClientAccountStaff {
    client: IAccountHolder,
    deleteAccount: Function,
    updateAccount: Function,
    revokeTransaction: Function,
    bankName: BankNameEnum
}
function ClientAccount({ client, deleteAccount, updateAccount, revokeTransaction, bankName }: IClientAccountStaff) {

    const [isUpdateClient, { setTrue: openUpdateClient, setFalse: dismissUpdateClient }] = useBoolean(false)
    const [isViewAccount, { setTrue: openViewAccount, setFalse: dismissViewAccount }] = useBoolean(false)

    let balance = Object.values(client.transactions.map((val) => (val.status === TransactionStatusEnum.Success) ? val.amount : 0).concat([0])).reduce((a?, b?) => a + b) ?? 0


    return (
        <div className="ms-Grid-col ms-xl6 ms-sm12">
            <div className={`${(client.status === AccountStatusEnum.Open) ? 'staff-dashboard__client--account' : 'staff-dashboard__client--account-closed'}`}>
                <Separator alignContent="center"><h1 className="staff-dashboard__client--name">{client.name}</h1></Separator>
                <p>Id: <b>{client.id}</b></p>
                <p>Status: <b style={{ color: `${((client.status === AccountStatusEnum.Open) ? 'green' : 'red')}` }}>{(client.status === AccountStatusEnum.Open) ? "Active" : "Closed"}</b></p>
                <p>Balance: <b>&#8377; {balance.toFixed(2)}</b></p>

                <div className="staff-dashboard__client--btn">


                    <PrimaryButton iconProps={{ iconName: "View" }} text="View Transactions" onClick={openViewAccount} />
                    {
                        (client.status === AccountStatusEnum.Open) ?
                            <>
                                <PrimaryButton iconProps={{ iconName: "Refresh" }} text="Update Account" onClick={openUpdateClient} />
                                <PrimaryButton iconProps={{ iconName: "Delete" }} text="Delete Account" onClick={() => deleteAccount(client)} />
                            </>
                            : <></>
                    }
                </div>
            </div>

            <ViewClient
                bankName={bankName}
                client={client}
                dismissViewAccount={dismissViewAccount}
                isViewAccount={isViewAccount}
                revokeTransaction={revokeTransaction}
            />

            <UpdateClient
                client={client}
                dismissUpdateClient={dismissUpdateClient}
                isUpdateClient={isUpdateClient}
                updateAccount={updateAccount}
            />
        </div>
    )
}



export default ClientAccount
