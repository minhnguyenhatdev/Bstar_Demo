import { ProductLog } from '../entities/productLog';
import { Category } from '../entities/category';
import { DataSource } from 'typeorm';
import { Product } from '../entities/product';
import { SocialAccount } from '../entities/socialAccount';
import { StockLog } from '../entities/stockLog';
import { StoragePlacement } from '../entities/storagePlacement';
import { SystemAccount } from '../entities/systemAccount';
import { User } from '../entities/user';

export const AppDataSource = new DataSource({ 
    type: "postgres",
    host:  process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
    synchronize: true,
    logging: false,
    entities: [Product, Category, ProductLog, SocialAccount, StockLog, StoragePlacement, SystemAccount, User],
    subscribers: [],
    migrations: [],
})