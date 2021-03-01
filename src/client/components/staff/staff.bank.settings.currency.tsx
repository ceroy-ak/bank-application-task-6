import { useEffect, useState } from 'react'
import IBank from '../../common/interfaces/bank.interface'
import { DetailsList, IColumn, SelectionMode, Modal, PrimaryButton, TextField, DefaultButton, Selection } from '@fluentui/react'
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
            let isAddValid = true

            bankDB.currency.forEach((value) => {
                if (value.currency === currencySymbol) {
                    isAddValid = false
                }
            })
            if (isAddValid) {
                let tempBank = { ...bankDB }
                let newRate = (Math.abs(rate) === 0) ? 1 : Math.abs(rate)
                let tempCurrency: ICurrency = {
                    currency: currencySymbol,
                    exchangeRate: newRate
                }
                tempBank.currency.unshift(tempCurrency)
                setBankDB(tempBank)
            } else {
                window.alert('The Currency already exists')
            }
            disableBtn()
            setOldCurrencySymbol('')
            setCurrencySymbol('')
            setRate(0)
        }
        else updateCurrency()


    }





    function deleteCurrency() {
        if (window.confirm('Are you sure you want to delete the currency?')) {
            let tempBank = { ...bankDB }
            tempBank.currency = tempBank.currency.filter((c) => c.currency !== currencySymbol)
            setBankDB(tempBank)
        }
        setCurrencySymbol('')
        setRate(0)
        disableBtn()
    }

    function updateCurrency() {
        let isUpdateValid = true

        bankDB.currency.forEach((value) => {
            if (value.currency === currencySymbol && currencySymbol !== oldCurrencySymbol) {
                isUpdateValid = false
            }
        })
        if (isUpdateValid) {
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

            setBankDB(tempBank)
            disableBtn()
            setOldCurrencySymbol('')
            setCurrencySymbol('')
            setRate(0)
        }
        else {
            enableBtn()
            window.alert('Update failed because the Currency name is already in use')
        }
    }

    const [items, setItems] = useState(bankDB.currency.filter((c) => c.currency !== 'INR'))
    const selection = new Selection({
        onSelectionChanged: () => {
            if (selection.getSelectedCount() > 0) {
                enableBtn()
            } else {
                disableBtn()
            }
        }
    })

    useEffect(() => {
        setItems(bankDB.currency.filter((c) => c.currency !== 'INR'))
    }, [bankDB])

    const [isCurrencyModalBtn, { setTrue: disableCurrencyModalBtn, setFalse: enableCurrencyModalBtn }] = useBoolean(true)

    return (
        <div className="ms-Grid-col ms-md12">
            <div className="ms-Grid-row">
                <div className="ms-Grid-row">
                    <h1 className="staff-dashboard--currency-title">Currency List - {bankDB.name}</h1>
                </div>
                <div className="ms-Grid-row staff-dashboard--currency-btn">
                    <PrimaryButton text="Add Currency" onClick={() => {
                        setOldCurrencySymbol('')
                        setCurrencySymbol('')
                        setRate(0)
                        openModal()
                    }} iconProps={{ iconName: 'Add' }} />
                    <PrimaryButton text="Edit Currency" onClick={openModal} iconProps={{ iconName: 'Edit' }} disabled={isBtn} />
                    <PrimaryButton text="Delete Currency" onClick={deleteCurrency} iconProps={{ iconName: 'Delete' }} disabled={isBtn} />
                </div>


            </div>
            <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-md6">
                    <DetailsList items={items} columns={column} selection={selection} selectionMode={SelectionMode.single} onActiveItemChanged={(item: ICurrency, index, ev) => {
                        setCurrencySymbol(item.currency)
                        setOldCurrencySymbol(item.currency)
                        setRate(item.exchangeRate)
                    }}
                        selectionPreservedOnEmptyClick={false} />
                </div>
            </div>

            <Modal isOpen={isOpen}>
                <form onSubmit={(e) => handleSubmit(e)} className="staff-dashboard__modal--currency">
                    <TextField label="Currency Symbol" value={currencySymbol} onChange={(e, value) => setCurrencySymbol(value!)} required
                        onGetErrorMessage={(value) => {
                            let regEx = /^[A-Z]{3}$/gm
                            if (!regEx.test(value) && value.length !== 0) {
                                disableCurrencyModalBtn()
                                return 'Can only be 3 characters and Capital'
                            } else {
                                if (value.length !== 0) enableCurrencyModalBtn()
                                else disableCurrencyModalBtn()
                                return ''
                            }
                        }}
                    />
                    <TextField label="Exchange Rate" value={rate.toString()} onChange={(e, value) => setRate(Number.parseFloat(value!))} type="number" required />
                    <PrimaryButton text="Submit" type="submit" disabled={isCurrencyModalBtn} />
                    <DefaultButton text="Cancel" onClick={closeModal} />
                </form>
            </Modal>

        </div>
    )
}

export default BankSettingsCurrency
