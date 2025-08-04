import express, {Request, Response} from 'express'

import { PORT } from './config/env';

const app = express();

app.get('/', (req: Request, res: Response) => {
   res.send('Voltrack API is live!')
});

app.listen(PORT, () => {
    console.log(`Voltrack API is running on http://localhost:${PORT}`)
});


export default app;