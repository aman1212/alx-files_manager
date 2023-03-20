import express from 'express';
import Appcontroller from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';
import FilesController from '../controllers/FilesController';

const routes = express.Router();

routes.get('/status', Appcontroller.getStatus);
routes.get('/stats', Appcontroller.getStats);
routes.post('/users', UsersController.postNew);
routes.get('/connect', AuthController.getConnect);
routes.get('/disconnect', AuthController.getDisconnect);
routes.get('/users/me', UsersController.getMe);

routes.post('/files', FilesController.postUpload);

export default routes;
