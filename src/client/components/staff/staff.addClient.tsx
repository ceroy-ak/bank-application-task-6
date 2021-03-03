import { useEffect, useState } from 'react'
import { nameRegex, passwordRegex, usernameRegex } from '../../common/services/client.validation.regex'
import { createAccountId } from '../../common/services/bank.id.creation'
import {
    PrimaryButton, Panel, TextField, DefaultButton, MessageBarType
} from '@fluentui/react'
import IAccountHolder from '../../common/interfaces/client.account.interface'
import AccountStatusEnum from '../../common/interfaces/acount.status.enum'
import IBank from '../../common/interfaces/bank.interface'
import { useBoolean } from '@uifabric/react-hooks'


interface IAddClient {
    dismissAddClient: any,
    bankDB: IBank,
    setBankDB: Function,
    setMessageText: Function,
    setMessageBarType: Function,
    openMessage: Function
    isAddClient: boolean
}
function AddClient({ dismissAddClient, isAddClient, bankDB, openMessage, setBankDB, setMessageBarType, setMessageText }: IAddClient) {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isAddValidBtn, { setTrue: disableAddBtn, setFalse: enableAddBtn }] = useBoolean(true)

    useEffect(() => {

        if (nameRegex.test(name) && usernameRegex.test(username) && passwordRegex.test(password)) {
            enableAddBtn()
        } else {
            disableAddBtn()
        }

    }, [name, username, password])

    //Add a new Account Holder(client)
    function addClient(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        dismissAddClient()
        let tempClient: IAccountHolder = {
            id: createAccountId(name),
            name: name,
            password: password,
            status: AccountStatusEnum.Open,
            transactions: [],
            username: username
        }

        let allowedAddClientFlag = true
        let ifDuplicateThenType = ''

        bankDB.client.forEach((client) => {
            if (client.id === tempClient.id) {
                ifDuplicateThenType = ifDuplicateThenType + 'ID'
                allowedAddClientFlag = false
            }
            if (client.username === tempClient.username) {
                allowedAddClientFlag = false
                if (ifDuplicateThenType.length > 0) {
                    ifDuplicateThenType = ifDuplicateThenType + ' & Username'
                } else {
                    ifDuplicateThenType = ifDuplicateThenType + 'Username'
                }
            }
        })

        if (allowedAddClientFlag) {
            let newBankDB = { ...bankDB }
            newBankDB.client.unshift(tempClient)
            setBankDB(newBankDB)
            setMessageText('Client was successfully added')
            setMessageBarType(MessageBarType.success)
            openMessage()
        } else {
            setMessageText(`${ifDuplicateThenType} already exists`)
            setMessageBarType(MessageBarType.blocked)
            openMessage()
        }
    }


    return (
        <Panel isOpen={isAddClient} hasCloseButton={false} headerText="Add Client" >
            <form onSubmit={addClient}>
                <TextField required
                    onGetErrorMessage={(value) => {
                        if (!nameRegex.test(value) && value.length !== 0) {
                            return 'Name can only contain Alphabets'
                        } else {
                            return ''
                        }
                    }}
                    name="name" className="staff-dashboard--add-client__name" label="Name" onChange={(e, value) => setName(value!)} />
                <TextField required
                    onGetErrorMessage={(value) => {
                        //username Regex
                        if (!usernameRegex.test(value) && value.length !== 0) {
                            return 'No Special characters or uppercase allowed, minimum 6 characters'
                        } else {
                            return ''
                        }
                    }}
                    name="username" className="staff-dashboard--add-client__username" label="Username" onChange={(e, value) => setUsername(value!)} />
                <TextField
                    onGetErrorMessage={(value) => {
                        //password Regex
                        if (!passwordRegex.test(value) && value.length !== 0) {
                            return 'Password must be alphanumeric, contain atleast one @ # $ % ^ & * ( ) ! and one lower and uppercase letters, minimum 8 characters'
                        } else {
                            return ''
                        }
                    }}
                    required name="password" className="staff-dashboard--add-client__password" label="Password" onChange={(e, value) => setPassword(value!)} />
                <PrimaryButton text="Add" type="submit" className="staff-dashboard--add-client__add" disabled={isAddValidBtn} />
                <DefaultButton text="Cancel" onClick={dismissAddClient} className="staff-dashboard--add-client__cancel" />
            </form>
        </Panel>
    )
}

export default AddClient
