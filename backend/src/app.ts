import express, { Express, Request, Response } from 'express';
import cors from 'cors';

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Expense Tracking API is running');
});

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

export default app;
