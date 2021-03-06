import ICurrency from '../interfaces/bank.currency'

export default class Currency implements ICurrency {
    constructor(public currency: string, public exchangeRate: number) { }
}