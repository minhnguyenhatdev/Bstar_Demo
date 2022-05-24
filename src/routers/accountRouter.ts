import { verifyAll } from '../middlewares/authorization';
import {Router} from 'express';
import { accountController } from '../controllers/accountController';

const router = Router();
/**
 * @swagger
 * components:
 *      schema:
 *          account:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                  password :
 *                      type: string
 *                  name:
 *                      type: string
 *                  email:
 *                      type: string
 *                  phone:
 *                      type: string
 *          login:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                  password :
 *                      type: string
 */

/**
 * @swagger
 * /api/account/register:
 *  post:
 *      summary: 'Register Account With System Account'
 *      tags: [ACCOUNT]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/account'
 *      responses:
 *          '200':
 *              description: 'The server successfully returned the requested data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 *          '400':
 *              description: 'There was an error in the request sent, and the server did not create or modify data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 */
router.post("/register" ,accountController.register)

/**
 * @swagger
 * /api/account/login:
 *  post:
 *      summary: 'Login Account With System Account'
 *      tags: [ACCOUNT]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/login'
 *      responses:
 *          '200':
 *              description: 'The server successfully returned the requested data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 *          '400':
 *              description: 'There was an error in the request sent, and the server did not create or modify data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 */
 router.post("/login" ,accountController.login)

  /**
 * @swagger
 * /api/account/info:
 *  get:
 *      summary: 'Return User Information With AccessToken'
 *      tags: [ACCOUNT]
 *      responses:
 *          '200':
 *              description: 'The server successfully returned the requested data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 *          '400':
 *              description: 'There was an error in the request sent, and the server did not create or modify data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 */
  router.get("/info", verifyAll, accountController.info)
module.exports = router; 