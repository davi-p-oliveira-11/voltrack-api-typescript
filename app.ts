import express, {Request, Response} from 'express'

import { PORT } from './config/env';

import userRouter from './routes/user.routes';
import authRouter from './routes/auth.routes';
import subscriptionRouter from './routes/subscriptions.routes';

const app = express();

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.get('/', (req: Request, res: Response) => {
   res.send('Voltrack API is live!')
});

app.listen(PORT, () => {
    console.log(`Voltrack API is running on http://localhost:${PORT}`)
});


export default app;