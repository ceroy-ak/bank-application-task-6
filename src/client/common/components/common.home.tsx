import { useState } from 'react'
import { Layer, PrimaryButton, DefaultButton, Panel, TextField, MessageBar, MessageBarType, ChoiceGroup, IChoiceGroupOption, IChoiceGroupOptionStyleProps, IChoiceGroupOptionStyles, IStyleFunctionOrObject, IChoiceGroupStyleProps, IChoiceGroupStyles, mergeStyleSets } from '@fluentui/react'
import { useBoolean } from '@uifabric/react-hooks'
import IBank from '../interfaces/bank.interface'
import Ilogin from '../interfaces/bank.login.interface'
import { useHistory } from 'react-router-dom'
import AccountStatusEnum from '../interfaces/acount.status.enum'
import BankNameEnum from '../interfaces/bank.name.enum'
import technovert_logo from '../../res/Technovert-Logo-2X.png'
import saketa_logo from '../../res/saketa_logo.png'
import keka_logo from '../../res/keka.png'

interface IHomePage {
    bankDB: IBank,
    loginSession: Ilogin,
    setLoginSession: Function,
    chooseBank: Function
}

function HomePage({ bankDB, loginSession, setLoginSession, chooseBank }: IHomePage) {

    const choiceGroupOptionStyle: IStyleFunctionOrObject<IChoiceGroupOptionStyleProps, IChoiceGroupOptionStyles> = {
        labelWrapper: {
            fontWeight: "500",
            paddingTop: "15px",
            fontSize: "25px",
            color: "darkslategrey"
        }
    }
    const choices: IChoiceGroupOption[] = [
        {
            key: BankNameEnum.Technovert.toString(),
            text: "Technovert Bank",
            imageSrc: technovert_logo,
            imageAlt: "Technovert Bank",
            imageSize: { width: 200, height: 200 },
            selectedImageSrc: technovert_logo,
            styles: choiceGroupOptionStyle
        },
        {
            key: BankNameEnum.Saketa.toString(),
            text: "Saketa Bank",
            imageSrc: saketa_logo,
            imageAlt: "Saketa Bank",
            imageSize: { width: 200, height: 200 },
            selectedImageSrc: saketa_logo,
            styles: choiceGroupOptionStyle

        },
        {
            key: BankNameEnum.Keka.toString(),
            text: "Keka Bank",
            imageSrc: keka_logo,
            selectedImageSrc: keka_logo,
            imageAlt: "Keka Bank",
            imageSize: { width: 200, height: 200 },
            styles: choiceGroupOptionStyle

        }
    ]

    const [isBtnDisabled, { setTrue: disableBtn, setFalse: enableBtn }] = useBoolean(true)

    const history = useHistory()
    if (loginSession.isLoggedIn) {
        (loginSession.isStaff) ? history.push(`/staff/${loginSession.currentId}`) : history.push(`/client/${loginSession.currentId}`)
    }


    const [isClientLogin, { setTrue: openClientLogin, setFalse: dismissClientLogin }] = useBoolean(false)
    const [isStaffLogin, { setTrue: openStaffLogin, setFalse: dismissStaffLogin }] = useBoolean(false)
    const [isError, { setTrue: errorTrue, setFalse: errorFalse }] = useBoolean(false)

    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')

    const onSubmit = () => {

        if (isClientLogin) {
            dismissClientLogin()
            bankDB.client.forEach((client) => {
                if (client.username === userName && client.password === password) {

                    if (client.status === AccountStatusEnum.Close) {
                        window.alert('Your Account is Closed. Please contact the bank')
                    } else {
                        let newLoginSession = { ...loginSession }
                        newLoginSession.currentId = client.id
                        newLoginSession.isLoggedIn = true
                        newLoginSession.isStaff = false
                        setLoginSession(newLoginSession)
                        history.push(`/client/${newLoginSession.currentId}`)
                    }
                }
            })
        }
        else {
            dismissStaffLogin()
            bankDB.staff.forEach((staff) => {
                if (staff.username === userName && staff.password === password) {
                    let newLoginSession = { ...loginSession }
                    newLoginSession.currentId = staff.username
                    newLoginSession.isLoggedIn = true
                    newLoginSession.isStaff = true
                    setLoginSession(newLoginSession)
                    history.push(`/staff/${newLoginSession.currentId}`)
                }
            })
        }
        errorTrue()
    }

    function choiceOnChange(choice: IChoiceGroupOption) {
        enableBtn()
        if (choice.key === BankNameEnum.Technovert.toString()) {
            chooseBank(BankNameEnum.Technovert)
        } else if (choice.key === BankNameEnum.Saketa.toString()) {
            chooseBank(BankNameEnum.Saketa)
        } else if (choice.key === BankNameEnum.Keka.toString()) {
            chooseBank(BankNameEnum.Keka)
        }
    }

    const choiceGroupStyle: IStyleFunctionOrObject<IChoiceGroupStyleProps, IChoiceGroupStyles> = {
        flexContainer: {
            justifyContent: "space-evenly",
        }
    }
    return (
        <div className="home">

            <h1 className="home-title">Ceroy Banking Services</h1>
            <ChoiceGroup options={choices} onChange={(e, choice) => choiceOnChange(choice!)} styles={choiceGroupStyle} />
            <h1 className="home-bank-name">{bankDB.name}</h1>
            <div className="home-btn">
                <PrimaryButton className="home-client-btn" text="Client Login" onClick={openClientLogin} disabled={isBtnDisabled} />
                <PrimaryButton className="home-staff-btn" text="Staff Login" onClick={openStaffLogin} disabled={isBtnDisabled} />
            </div>


            <Panel isOpen={isClientLogin} hasCloseButton={false} headerText="Client Login" >
                <form onSubmit={(e) => {
                    e.preventDefault()
                    onSubmit();
                }}>
                    <img src={bankDB.img} alt="bank" className="login-panel-img" />
                    <TextField className="login-panel-username" label="Username" onChange={(e, value) => setUserName(value!)} required />
                    <TextField className="login-panel-password" label="Password" canRevealPassword={true} type="password" onChange={(e, value) => setPassword(value!)} required />
                    <PrimaryButton text="Login" type="submit" className="login-panel-btn" />
                    <DefaultButton text="Cancel" onClick={dismissClientLogin} className="login-panel-cancel-btn" />
                </form>
            </Panel>

            <Panel isOpen={isStaffLogin} hasCloseButton={false} headerText="Staff Login">
                <form onSubmit={(e) => {
                    e.preventDefault()
                    onSubmit();
                }}>
                    <img src={bankDB.img} alt="bank" className="login-panel-img" />
                    <TextField className="login-panel-username" label="Staff ID" onChange={(e, value) => setUserName(value!)} required />
                    <TextField className="login-panel-password" label="Password" canRevealPassword={true} type="password" onChange={(e, value) => setPassword(value!)} required />
                    <PrimaryButton text="Login" type="submit" className="login-panel-btn" />
                    <DefaultButton text="Cancel" onClick={dismissStaffLogin} className="login-panel-cancel-btn" />
                </form>
            </Panel>
            {
                (isError) ? <MessageBar messageBarType={MessageBarType.error}>
                    Wrong Username or Password
            </MessageBar> : <></>
            }

        </div>
    )
}

export default HomePage
