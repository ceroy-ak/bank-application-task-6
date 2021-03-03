import { useState, useEffect } from 'react'
import { Panel, TextField, PrimaryButton, DefaultButton } from '@fluentui/react'
import { nameRegex, passwordRegex, usernameRegex } from '../../common/services/client.validation.regex'
import { useBoolean } from '@uifabric/react-hooks'
import IAccountHolder from '../../common/interfaces/client.account.interface'

interface IUpdateClient {
    client: IAccountHolder,
    dismissUpdateClient: any,
    updateAccount: Function,
    isUpdateClient: boolean,
}

function UpdateClient({ client, dismissUpdateClient, isUpdateClient, updateAccount }: IUpdateClient) {
    const [isUpdateValidBtn, { setTrue: disableUpdateBtn, setFalse: enableUpdateBtn }] = useBoolean(true)
    const [name, setName] = useState(client.name)
    const [username, setUsername] = useState(client.username)
    const [password, setPassword] = useState(client.password)

    useEffect(() => {

        if (nameRegex.test(name) && usernameRegex.test(username) && passwordRegex.test(password)) {
            enableUpdateBtn()
        } else {
            disableUpdateBtn()
        }

    }, [name, username, password])

    function updateAccountProxy(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        dismissUpdateClient()
        let tempClient: IAccountHolder = {
            id: client.id,
            name: name,
            password: password,
            status: client.status,
            transactions: client.transactions,
            username: username
        }

        updateAccount(tempClient)
    }



    return (
        <Panel isOpen={isUpdateClient} hasCloseButton={false} headerText="Update Client" >
            <form onSubmit={(e) => updateAccountProxy(e)}>
                <TextField
                    onGetErrorMessage={(value) => {
                        if (!nameRegex.test(value) && value.length !== 0) {
                            return 'Name can only contain Alphabets'
                        } else {
                            return ''
                        }
                    }}
                    required className="staff-dashboard--add-client__name" name="name" value={name} label="Name" onChange={(e, value) => setName(value!)} />
                <TextField
                    onGetErrorMessage={(value) => {
                        //username Regex
                        if (!usernameRegex.test(value) && value.length !== 0) {
                            return 'No Special characters or uppercase allowed, minimum 6 characters'
                        } else {
                            return ''
                        }
                    }}
                    required className="staff-dashboard--add-client__username" name="username" value={username} label="Username" onChange={(e, value) => setUsername(value!)} />
                <TextField
                    onGetErrorMessage={(value) => {
                        //password Regex
                        if (!passwordRegex.test(value) && value.length !== 0) {
                            return 'Password must be alphanumeric, contain atleast one @ # $ % ^ & * ( ) ! and one lower and uppercase letters, minimum 8 characters'
                        } else {
                            return ''
                        }
                    }}
                    required className="staff-dashboard--add-client__password" name="password" value={password} label="Password" onChange={(e, value) => setPassword(value!)} />
                <PrimaryButton text="Update" type="submit" className="staff-dashboard--add-client__add" disabled={isUpdateValidBtn} />
                <DefaultButton text="Cancel" onClick={dismissUpdateClient} className="staff-dashboard--add-client__cancel" />
            </form>
        </Panel>
    )
}

export default UpdateClient
