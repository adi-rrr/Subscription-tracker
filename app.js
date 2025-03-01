import express from 'express';
import { PORT } from './Config/Env.js';
import userRouter from './Routes/User.routes.js';
import authRouter from './Routes/Auth.routes.js';
import subscriptionRouter from './Routes/Subscription.routes.js';
import connecttodb from './database/mongodb.js';
import errorMiddleware from './Middlewares/Error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './Middlewares/Arcjet.midleware.js';
import workflowRouter from './Routes/Workflow.routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);
app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Welcome to subscription tracker api!');
});

app.listen(PORT, async () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  await connecttodb();
});

export default app;