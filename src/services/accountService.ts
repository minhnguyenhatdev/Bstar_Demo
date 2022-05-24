import { SocialAccount } from './../entities/socialAccount';
import { SystemAccount } from './../entities/systemAccount';
import { User, Role, Status, Type } from './../entities/user';
import argon2 from 'argon2';

export const registerSystemAccount = async (body : any) => {
    const createUser = await User.create({
        name: body.name,
        role: Role.USER,
        email: body.email,
        phone: body.phone,
        status: Status.Avaiable
    }).save();

    if (!createUser){
        return false
    }

    const passwordHash = await argon2.hash(body.password);
    const createSysAccount = await SystemAccount.create({
        username: body.username,
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
            username: username
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
            username: data.id
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