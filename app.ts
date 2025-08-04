import express, {Request, Response} from 'express'

const app = express();

app.get('/', (req: Request, res: Response) => {
   res.send('Voltrack API is live!')
});

app.listen(3000, () => {
    console.log('Voltrack API is running on http://localhost:3000')
});


export default app;