import express, {Request, Response} from 'express'
import cookieParser from 'cookie-parser'
import UserDocument from './@types/express'

import { PORT } from './config/env';

import userRouter from './routes/user.routes';
import authRouter from './routes/auth.routes';
import subscriptionRouter from './routes/subscriptions.routes';
import connectToDatabase from './database/mongodb';
import errorMiddleware from './middlewares/error.middleware';
import arcjetMiddleware from './middlewares/arcjet.middleware';
import workflowRouter from './routes/workflow.routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware)

app.get('/', (req: Request, res: Response) => {
   res.send('Voltrack API is live!')
});

// app.listen(PORT, async () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

app.listen(PORT, async () => {
    console.log(`Voltrack API is running on http://localhost:${PORT}`);

    connectToDatabase();
});


export default app;