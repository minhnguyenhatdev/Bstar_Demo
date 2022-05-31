import { SocialAccount } from './../entities/socialAccount';
import { SystemAccount } from './../entities/systemAccount';
import { User, Role, Status, Type } from './../entities/user';
import argon2 from 'argon2';
import { Like } from 'typeorm';

export const registerSystemAccount = async (body : any) => {
    const createUser = await User.create({
        name: body.name,
        role: Role.USER,
        email: body.email,
        phone: body.phone,
        status: Status.Spending
    }).save();

    if (!createUser){
        return false
    }

    const passwordHash = await argon2.hash(body.password);
    const createSysAccount = await SystemAccount.create({
        username: String(body.username).toLowerCase(),
        password: passwordHash,
        userId: createUser.id
    }).save();

    if (!createSysAccount){
        return false
    }

    return createUser;
}

export const addSystemAccount = async (body : any) => {
    const createUser = await User.create({
        name: String(body.name).toLowerCase(),
        role: body.role,
        email: body.email,
        phone: body.phone,
        status: body.status
    }).save();

    if (!createUser){
        return false
    }

    const passwordHash = await argon2.hash(body.password);
    const createSysAccount = await SystemAccount.create({
        username: String(body.username).toLowerCase(),
        password: passwordHash,
        userId: createUser.id
    }).save();

    if (!createSysAccount){
        return false
    }

    return createUser;
}

export const checkUsernameSystemAccount = async (username: string) => {
    const account = await SystemAccount.findOne({
        select:{
            id: true,
        },
        where: {
            username: username
        }
    })

    if (!account){
        return false
    }

    return true
}

export const getTypeUser = async (id: number) => {
    const user = await User.findOne({
        select:{
            id: true,
            type: true,
        },
        where: {
            id: id
        }
    })

    return user?.type
}

export const checkPasswordSystem = async (userId: number, password: string) => {
    const user = await SystemAccount.findOne({
        select:{
            id: true,
            password: true
        },
        where: {
            userId: userId
        }
    })

    if(!user){
        return false
    }

    const verify = await argon2.verify(user.password, password)

    if(!verify){
        return false
    }

    return true
}

export const loginSystemAccount = async (username: string, password: string) => {
    const account = await SystemAccount.findOne({
        select:{
            id: true,
            password: true
        },
        relations:{
            user: true
        },
        where: {
            username: username,
            user: {
                status: Status.Avaiable
            }
        }
    })
    if (!account){
        return false
    }

    const verify = await argon2.verify(account.password, password)
    if (!verify){
        return false
    }

    return account;
}

export const loginSocialAccount = async (data: any) => {
    
    const account = await SocialAccount.findOne({
        relations:{
            user: true
        },
        where: {
            username: data.id,
            user: {
                status: Status.Avaiable
            }
        }
    })
    if (account){
        return account
    }

    const createUser = await User.create({
        name: data.name,
        role: Role.USER,
        email: data.email,
        status: Status.Avaiable,
        phone: "",
        type: Type.SOCIAL
    }).save();
    console.log(createUser)
    if (!createUser){
        return false
    }

    const createSysAccount = await SocialAccount.create({
        username: data.id,
        userId: createUser.id
    }).save();

    if (!createSysAccount){
        return false
    }

    return await SocialAccount.findOne({
        relations:{
            user: true
        },
        where:{
            id: createSysAccount.id
        }
    })
}

//paginating product list
//input: page number & limit product per page 
//optional: sort by Category | Name | Price
export const queryUserService = async (pageIndex: number, pageLimit: number, sortBy?: String, sortOrder?: String, searchInput?: String): Promise<User[]> => {
    try {
        //create number of product to skip on db based on pageIndex and pageLimit
        const skipNumber = (pageIndex-1)*pageLimit

        let users: User[]

        switch(sortBy) {
            case "Name": {
                users = await User.find({
                    order: {
                        name: sortOrder === "ascending" ? "ASC": "DESC"
                    },
                    take: pageLimit,
                    skip: skipNumber,
                    where:{
                        name: Like(`%${searchInput}%`) 
                    }
                })
                break;
            }
            //default is sort by date
            default: {
                users = await User.find({
                    order: {
                        id: sortOrder === "ascending" ? "ASC": "DESC"
                    },
                    take: pageLimit,
                    skip: skipNumber,
                    where:{
                        name: Like(`%${searchInput}%`) 
                    }
                })
            }
        }  
        return users
    } catch (error) {
        console.log(error)
        return []
    }
}