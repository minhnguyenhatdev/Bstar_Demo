import { User } from './user';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, ManyToOne, JoinTable } from "typeorm"
import { Product } from "./product"

export enum Type {
    Export = "Export",
    Import = "Import",
}

@Entity()
export class StockLog extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number

    @CreateDateColumn()
    createdAt!: Date

    @Column({
        type:"enum", 
        enum: Type
    })
    type!: Type

    @Column()
    previousQuantity!: number

    @Column()
    newQuantity!: number

    @ManyToOne(()=> Product, product => product.id)
    @JoinTable()
    product: Product

    @Column()
    productId: number

    @ManyToOne(()=> User, (user) => user.id)
    @JoinTable()
    user: User

    @Column()
    userId: number
}
