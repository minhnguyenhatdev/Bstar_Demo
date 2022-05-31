import { StockLog } from './stockLog';
import { ProductLog } from './productLog';
import { SocialAccount } from './socialAccount';
import { SystemAccount } from './systemAccount';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinTable, OneToMany } from "typeorm"

export enum Role {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    USER = "USER"
}

export enum Type {
    SYSTEM = "SYSTEM",
    SOCIAL = "SOCIAL"
}



export enum Status {
    Avaiable = "Available",
    Spending = "Spending",
    Disabled = "Disabled"
}

@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column({
        type:"enum", 
        enum: Role
    })
    role!: Role

    @Column()
    email!: string

    @Column()
    phone!: string

    @Column({
        type:"enum", 
        enum: Status
    })
    status!: string

    @Column({
        type:"enum", 
        enum: Type,
        default: Type.SYSTEM
    })
    type!: string

    @OneToOne(()=> SystemAccount, (systemAccount) => systemAccount.id)
    @JoinTable()
    systemAccount: SystemAccount

    @OneToOne(()=> SocialAccount, (socialAccount) => socialAccount.id)
    @JoinTable()
    socialAccount: SocialAccount

    @OneToMany(()=> ProductLog, (productLog) => productLog.id)
    @JoinTable()
    productLog: ProductLog

    @OneToMany(()=> StockLog, (stockLog) => stockLog.id)
    @JoinTable()
    stockLog: StockLog
}
