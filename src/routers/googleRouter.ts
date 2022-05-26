import { googleController } from '../controllers/googleController';
import {Router} from 'express';

const router = Router();
/**
 * @swagger
 * components:
 *      schema:
 *          loginSocial:
 *              type: object
 *              properties:
 *                  token:
 *                      type: string
 */

/**
 * @swagger
 * /api/google/getToken:
 *  get:
 *      summary: 'getToken Account With Social [PUBLIC]'
 *      tags: [GOOGLE]
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
 router.get("/getToken" ,googleController.getToken)
 router.get("/redirect" ,googleController.redirect)

 /**
 * @swagger
 * /api/google/login:
 *  post:
 *      summary: 'Login Account With System Account [PUBLIC]'
 *      tags: [GOOGLE]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/loginSocial'
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
  router.post("/login" ,googleController.login)
module.exports = router; 