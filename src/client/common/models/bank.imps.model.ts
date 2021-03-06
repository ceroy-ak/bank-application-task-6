import IImps from "../interfaces/bank.imps.interface";

export default class Imps implements IImps {
    constructor(public same: number, public other: number) { }
}