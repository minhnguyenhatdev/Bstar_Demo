import { User } from './user';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from "typeorm"


@Entity()
export class SocialAccount extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    username!: string

    @OneToOne(()=> User, (user) => user.id)
    @JoinColumn()
    user: User

    @Column()
    userId: number
}
