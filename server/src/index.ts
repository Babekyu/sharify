import express from 'express';
import dotenv from 'dotenv';

import database from './data-access/config/database';
import routes from './routes';

import './data-access/models/users';
import './config/passport';

dotenv.config();

const app = express();
const port = process.env.PORT || '8000';

database.connect();

app.use('/', routes);

app.listen(port, (err) => {
  if (err) return console.error(err);
  return console.log(`Server is listening on ${port}`);
});
