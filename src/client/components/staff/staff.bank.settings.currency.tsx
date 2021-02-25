import { useEffect, useMemo, useState } from 'react'
import IBank from '../../common/interfaces/bank.interface'
import { DetailsList, IColumn, SelectionMode, Modal, PrimaryButton, TextField, DefaultButton, IObjectWithKey, Selection, MarqueeSelection, ISelection } from '@fluentui/react'
import { v4 as uuid } from 'uuid'
import { useBoolean } from '@uifabric/react-hooks'
import ICurrency from '../../common/interfaces/bank.currency'

interface IBankSettingsCurrency {
    bankDB: IBank,
    setBankDB: Function
}
function BankSettingsCurrency({ bankDB, setBankDB }: IBankSettingsCurrency) {

    const [currencySymbol, setCurrencySymbol] = useState('')
    const [oldCurrencySymbol, setOldCurrencySymbol] = useState('')
    const [rate, setRate] = useState(0)

    const [isOpen, { setTrue: openModal, setFalse: closeModal }] = useBoolean(false)

    const [isBtn, { setTrue: disableBtn, setFalse: enableBtn }] = useBoolean(true)


    const items = bankDB.currency.filter((c) => c.currency !== 'INR')
    const column: IColumn[] = [
        {
            key: "currency",
            fieldName: 'currency',
            minWidth: 10,
            maxWidth: 100,
            name: 'Currency'
        },
        {
            key: "exchangeRate",
            fieldName: 'exchangeRate',
            minWidth: 10,
            maxWidth: 20,
            name: 'Exchange Rate'
        }
    ]

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        closeModal()

        if (oldCurrencySymbol === '') {
            let tempBank = { ...bankDB }
            let tempCurrency: ICurrency = {
                currency: currencySymbol,
                exchangeRate: rate
            }
            tempBank.currency.push(tempCurrency)
            setBankDB(tempBank)
        }
        else updateCurrency()
        disableBtn()
    }





    function deleteCurrency() {
        if (window.confirm('Are you sure you want to delete the currency?')) {
            let tempBank = { ...bankDB }
            tempBank.currency = tempBank.currency.filter((c) => c.currency !== currencySymbol)
            setBankDB(tempBank)
        }
        disableBtn()
    }

    function updateCurrency() {
        let tempBank = { ...bankDB }
        let oldCurrency = oldCurrencySymbol
        let tempCurrency: ICurrency = {
            currency: currencySymbol,
            exchangeRate: rate
        }
        tempBank.currency.forEach((currency) => {
            if (currency.currency === oldCurrency) {
                currency.currency = tempCurrency.currency
                currency.exchangeRate = tempCurrency.exchangeRate
            }
        })
        setOldCurrencySymbol('')
        setBankDB(tempBank)
        disableBtn()
    }


    return (
        <div className="ms-Grid-col ms-md12">
            <div className="ms-Grid-row">
                <div className="ms-Grid-row">
                    <h1 className="staff-dashboard--currency-title">Currency List - {bankDB.name}</h1>
                </div>
                <div className="ms-Grid-row staff-dashboard--currency-btn">
                    <PrimaryButton text="Add Currency" onClick={openModal} iconProps={{ iconName: 'Add' }} />
                    <PrimaryButton text="Edit Currency" onClick={openModal} iconProps={{ iconName: 'Edit' }} disabled={isBtn} />
                    <PrimaryButton text="Delete Currency" onClick={deleteCurrency} iconProps={{ iconName: 'Delete' }} disabled={isBtn} />
                </div>


            </div>
            <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-md6">
                    <DetailsList items={items} columns={column} selectionMode={SelectionMode.single} onActiveItemChanged={(item: ICurrency, index, ev) => {
                        enableBtn()
                        setCurrencySymbol(item.currency)
                        setOldCurrencySymbol(item.currency)
                        setRate(item.exchangeRate)
                    }}
                        selectionPreservedOnEmptyClick={true} />
                </div>
            </div>

            <Modal isOpen={isOpen}>
                <form onSubmit={(e) => handleSubmit(e)} className="staff-dashboard__modal--currency">
                    <TextField label="Currency Symbol" value={currencySymbol} onChange={(e, value) => setCurrencySymbol(value!)} required />
                    <TextField label="Exchange Rate" value={rate.toString()} onChange={(e, value) => setRate(Number.parseFloat(value!))} type="number" required />
                    <PrimaryButton text="Submit" type="submit" />
                    <DefaultButton text="Cancel" onClick={closeModal} />
                </form>
            </Modal>

        </div>
    )
}

export default BankSettingsCurrency
