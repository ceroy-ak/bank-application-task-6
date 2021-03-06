import IRtgs from "../interfaces/bank.rtgs.interface";

export default class Rtgs implements IRtgs {
    constructor(public same: number, public other: number) { }
}