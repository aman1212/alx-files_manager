import express from 'express';
import routes from './routes/index';

const app = express();
const port = 5000;

app.use(express.json());
app.use('/', routes);

app.listen(port, () => {
  console.log(`server started at localhost at ${port}`);
});

export default app;
