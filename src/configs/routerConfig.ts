import { Express, Router } from'express'
import fs from 'fs'

const dir = './src/routers'
const files = fs.readdirSync(dir)

export const routerConfig = (app: Express): void => {
   
   //routers
      // '/api/product'

   files.forEach(file => {
      const nameRouter = file.toLowerCase().replace("router.ts","")
      const router: Router = require(`../routers/${nameRouter}Router`)
      app.use(`/api/${nameRouter}`, router)
   })
}