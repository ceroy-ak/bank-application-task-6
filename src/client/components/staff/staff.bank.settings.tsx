import React from 'react'
import IBank from '../../common/interfaces/bank.interface'


interface IBankSettings {
    bankDB: IBank,
    setBankDB: Function
}
function BankSettings({ bankDB, setBankDB }: IBankSettings) {
    return (
        <div>
            <h1>Bank Setting for {bankDB.name}</h1>
        </div>
    )
}

export default BankSettings
