import { useState } from 'react'
import IBank from '../../common/interfaces/bank.interface'
import BankSettingsCurrency from './staff.bank.settings.currency'
import { DefaultButton, Modal, TextField, PrimaryButton } from '@fluentui/react'
import { useBoolean } from '@uifabric/react-hooks'



interface IBankSettings {
    bankDB: IBank,
    setBankDB: Function
}
function BankSettings({ bankDB, setBankDB }: IBankSettings) {

    const [isOpen, { setTrue: openModal, setFalse: closeModal }] = useBoolean(false)

    const [sameRtgs, setSameRtgs] = useState(bankDB.rtgs.same.toFixed(2))
    const [otherRtgs, setOtherRtgs] = useState(bankDB.rtgs.other.toFixed(2))
    const [sameImps, setSameImps] = useState(bankDB.imps.same.toFixed(2))
    const [otherImps, setOtherImps] = useState(bankDB.imps.other.toFixed(2))


    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        closeModal()
        let tempBank = { ...bankDB }
        tempBank.rtgs.same = Number.parseFloat(sameRtgs)
        tempBank.rtgs.other = Number.parseFloat(otherRtgs)
        tempBank.imps.same = Number.parseFloat(sameImps)
        tempBank.imps.other = Number.parseFloat(otherImps)
        // setBankDB(tempBank)
    }

    return (
        <div className="ms-Grid">
            <div className="ms-Grid-row">
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-md3 staff-dashboard--bank-charge">
                        <div className="ms-Grid-row staff-dashboard--bank-charge-title">
                            <h1>RTGS Charges</h1>
                        </div>
                        <div className="ms-Grid-row staff-dashboard--bank-charge-same">
                            <p>{bankDB.name} to {bankDB.name}: <b>{bankDB.rtgs.same.toFixed(2)}%</b></p>
                        </div>
                        <div className="ms-Grid-row staff-dashboard--bank-charge-other">
                            <p>{bankDB.name} to Other: <b>{bankDB.rtgs.other.toFixed(2)}%</b></p>
                        </div>
                    </div>
                    <div className="ms-Grid-col ms-md3 staff-dashboard--bank-charge">
                        <div className="ms-Grid-row staff-dashboard--bank-charge-title">
                            <h1>IMPS Charges</h1>
                        </div>
                        <div className="ms-Grid-row staff-dashboard--bank-charge-same">
                            <p>{bankDB.name} to {bankDB.name}: <b>{bankDB.imps.same.toFixed(2)}%</b></p>
                        </div>
                        <div className="ms-Grid-row staff-dashboard--bank-charge-other">
                            <p>{bankDB.name} to Other: <b>{bankDB.imps.other.toFixed(2)}%</b></p>
                        </div>
                    </div>
                    <div className="ms-Grid-col ms-md4 staff-dashboard--bank-charge-btn">
                        <DefaultButton text="Edit Charges" iconProps={{ iconName: "BullseyeTargetEdit" }} onClick={openModal} />
                    </div>
                </div>
            </div>


            <Modal isOpen={isOpen}>
                <form onSubmit={(e) => handleSubmit(e)} className="staff-dashboard__form--charges">
                    <TextField value={sameRtgs} label="RTGS - Same Bank" onChange={(e, value) => setSameRtgs(value!)} required type="number" suffix="%" />
                    <TextField value={otherRtgs} label="RTGS - Other Bank" onChange={(e, value) => setOtherRtgs(value!)} required type="number" suffix="%" />
                    <TextField value={sameImps} label="IMPS - Same Bank" onChange={(e, value) => setSameImps(value!)} required type="number" suffix="%" />
                    <TextField value={otherImps} label="IMPS - Other Bank" onChange={(e, value) => setOtherImps(value!)} required type="number" suffix="%" />
                    <PrimaryButton text="Submit" type="submit" />
                    <DefaultButton text="Cancel" onClick={closeModal} />
                </form>
            </Modal>
            <hr />
            <div className="ms-Grid-row">
                <BankSettingsCurrency bankDB={bankDB} setBankDB={setBankDB} />
            </div>
        </div>
    )
}

export default BankSettings
