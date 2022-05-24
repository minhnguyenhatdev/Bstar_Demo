import { Product } from './product';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, ManyToOne, JoinTable } from "typeorm"
import { User } from './user';

enum Type {
    Update = "Update",
    Add = "Add",
    Disable = "Disable"
}

@Entity()
export class ProductLog extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number

    @CreateDateColumn()
    createdAt!: Date
    
    @Column()
    description?: string

    @Column({
        type:"enum", 
        enum: Type
    })
    type!: Type

    @Column()
    previousData!: string

    @Column()
    newData!: string

    @ManyToOne(()=> Product, (product) => product.id)
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
