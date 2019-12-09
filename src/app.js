import express from 'express';
import routes from './routes';

import './database';

class App {
  //O método constructor é executado automáticamente
  //Sempre que a class for chamada.
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;