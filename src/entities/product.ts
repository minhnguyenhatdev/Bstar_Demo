import { StoragePlacement } from './storagePlacement';
import { StockLog } from './stockLog';
import { ProductLog } from './productLog';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, JoinTable } from "typeorm"
import { Category } from "./category"
import { IsString, IsNumber, IsPositive, IsNotEmpty, IsArray } from "class-validator"
@Entity()
export class Product extends BaseEntity{
    
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    @IsString()
    @IsNotEmpty()
    name!: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn({select: false})
    updatedAt?: Date

    @Column("text", { array: true, nullable: true })
    @IsArray()
    image?: string[]

    @Column()
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    price!: number

    @Column('boolean', {default: true})
    isAvailable: boolean

    @Column({nullable: true})
    quantity: number

    @Column({nullable: true})
    @IsString()
    author?: string 

    @Column({nullable: true})
    released?: Date
    
    @Column({default: "", nullable: true})
    @IsString()
    description?: string

    @OneToMany(()=> ProductLog, (productLog) => productLog.product)
    @JoinTable()
    productLog: ProductLog[]

    @OneToMany(()=> StockLog, (stockLog) => stockLog.product)
    @JoinTable()
    stockLog: StockLog[]

    @ManyToOne(()=> Category, (category) => category.product)
    @JoinTable()
    category: Category

    @Column()
    categoryId: number

    @OneToMany(()=> StoragePlacement, (storagePlacement) => storagePlacement.product)
    storagePlacement: StoragePlacement[]
}