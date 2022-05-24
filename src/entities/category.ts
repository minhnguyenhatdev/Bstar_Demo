import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, OneToMany } from "typeorm"
import { Product } from "./product"
import { IsString, IsNotEmpty } from 'class-validator'
@Entity()
export class Category extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    @IsString()
    @IsNotEmpty()
    name!: string

    @Column({default: true})
    isAvailable: boolean

    @CreateDateColumn()
    createdAt: Date

    @OneToMany(()=> Product, (product) => product.category)
    product: Product[]
}