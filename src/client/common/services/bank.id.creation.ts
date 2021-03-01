export function createBankId(bankName: string): string {
    const date = new Date()
    bankName = bankName.replaceAll(' ', 'x')
    if (bankName.length < 3) {
        bankName = bankName + 'z'.repeat(3 - bankName.length)
    }
    return `${bankName.substr(0, 3)}-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}-${date.getTime()}`
}

export function createAccountId(clientName: string): string {
    const date = new Date()
    clientName = clientName.replaceAll(' ', 'x')
    if (clientName.length < 3) {
        clientName = clientName + 'z'.repeat(3 - clientName.length)
    }
    return `${clientName.substr(0, 3)}-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}-${date.getTime()}`
}

export function createTransactionId(bankId: string, clientId: string): string {
    const date = new Date()
    return `TXN-${bankId}-${clientId}-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}-${date.getTime()}`
}