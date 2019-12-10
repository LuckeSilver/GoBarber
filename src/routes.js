import { Router } from "express";

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware); // Como ele está vindo após as rotas acima, ele só
//vale para as rotas que vem apos ele

routes.put('/users', UserController.update);

export default routes;
