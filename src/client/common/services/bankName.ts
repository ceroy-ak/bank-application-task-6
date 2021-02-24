import BankNameEnum from '../interfaces/bank.name.enum'

function bankNameFinder(bank: BankNameEnum): string {
    if (bank === BankNameEnum.Technovert) {
        return "Technovert Bank"
    } else if (bank === BankNameEnum.Saketa) {
        return "Saketa Bank"
    } else if (bank === BankNameEnum.Keka) {
        return "Keka Bank"
    } else return "Unknown Bank"
}

export default bankNameFinder