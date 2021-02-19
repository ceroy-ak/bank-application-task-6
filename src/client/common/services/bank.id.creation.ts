export function createBankId(bankName: string): string {
    const date = new Date()
    return `${bankName.substr(0, 3)}-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}-${date.getTime()}`
}

export function createAccountId(clientName: string): string {
    const date = new Date()
    return `${clientName.substr(0, 3)}-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}-${date.getTime()}`
}

export function createTransactionId(bankId: string, clientId: string): string {
    const date = new Date()
    return `TXN-${bankId}-${clientId}-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}-${date.getTime()}`
}