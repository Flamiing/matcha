import express, { json } from 'express';
import 'dotenv/config';

const app = express();
const port = process.env.BACKEND_PORT ?? 3001;

// App config
app.disable('x-powered-by') // Disable 'x-powered-by' header
app.use(json()) // middleware

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})