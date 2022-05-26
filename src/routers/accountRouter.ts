import { verifyAdmin, verifyAll } from '../middlewares/authorization';
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
 *                      default: "manager"
 *                  password :
 *                      type: string
 *          changepassword:
 *              type: object
 *              properties:
 *                  oldpassword:
 *                      type: string
 *                  password:
 *                      type: string
 *                  repassword:
 *                      type: string
 *          update:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  email:
 *                      type: string
 *                  phone:
 *                      type: string
 *                  role:
 *                      type: string
 *                  password :
 *                      type: string
 */

/**
 * @swagger
 * /api/account/register:
 *  post:
 *      summary: 'Register Account With System Account [PUBLIC]'
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
 *      summary: 'Login Account With System Account [PUBLIC]'
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
 *      summary: 'Return User Information With AccessToken [ALL ROLE]'
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

  /**
 * @swagger
 * /api/account/update/{id}:
 *  put:
 *      summary: 'Change Orther User Information [ADMIN ROLE]'
 *      tags: [ACCOUNT]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/update'
 *      parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: User ID
 *        type: integer
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
  router.put("/update/:id", verifyAdmin, accountController.updateOrtherUser)

/**
 * @swagger
 * /api/account/changepassword/:
 *  put:
 *      summary: 'Change Password User [ALL ROLE]'
 *      tags: [ACCOUNT]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/changepassword'
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
  router.put("/changepassword", verifyAll, accountController.changePassword)

module.exports = router; 