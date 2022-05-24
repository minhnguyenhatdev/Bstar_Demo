import { Product } from './product';
import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne } from "typeorm"
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

@Entity()
export class StoragePlacement extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    @IsNumber()
    @IsNotEmpty()
    row!: number

    @Column()
    @IsNumber()
    @IsNotEmpty()
    index!: number

    @Column()
    @IsNumber()
    @IsNotEmpty()
    area!: number

    @Column()
    @IsNumber()
    @IsPositive()
    quantity: number

    @Column()
    productId: number

    @ManyToOne(() => Product,(product)=>product.storagePlacement)
    product: Product
}
