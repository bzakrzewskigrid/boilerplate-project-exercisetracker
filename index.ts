import { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import { AddressInfo } from 'net';
import routes from './routes/routes';
import { initDb } from './src/initDb';

const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.static('public'));

initDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_: Request, res: Response) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.use('/api', routes);

const listener = app.listen(process.env.PORT || 3000, () => {
  const port = (listener.address() as AddressInfo).port;
  console.log('Your app is listening on port ' + port);
  console.log(`Visit: http://localhost:${port}/`);
});
