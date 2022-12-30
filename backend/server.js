import express from 'express';
import cors from 'cors';
import raceRoutes from './routes/race.routes.js';

const app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log('App is listening on port', port);
});
