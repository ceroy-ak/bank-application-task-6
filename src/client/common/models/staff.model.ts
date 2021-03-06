import IStaff from '../interfaces/staff.interface'

export default class Staff implements IStaff {
    constructor(public username: string, public password: string, public name: string) { }
}