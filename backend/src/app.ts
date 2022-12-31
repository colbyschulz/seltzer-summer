import express from 'express';
import cors from 'cors';
import raceRoutes from './routes/race.routes';
import userRoutes from './routes/user.routes';

const app = express();
const port = process.env.APP_PORT || 3000;

// enable CORS for local dev
const corsOptions = {
  origin: 'http://localhost:8080',
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/', raceRoutes);
app.use('/api/', userRoutes);

app.listen(port, () => {
  console.log('App is listening on port', port);
});
