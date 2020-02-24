import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';

import database from './data-access/config/database';
import { rootHandler, helloHandler } from './handlers';

dotenv.config();

const app = express();
const port = process.env.PORT || '8000';

database.connect();

app.get('/', rootHandler);
app.get('/hello/:name', helloHandler);

app.listen(port, (err) => {
  if (err) return console.error(err);
  return console.log(`Server is listening on ${port}`);
});
