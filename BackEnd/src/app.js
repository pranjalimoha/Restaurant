import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json());

// app.get('/', (req, res) => {
//     res.json({ message: 'Backend is running' });
// });
app.use(express.urlencoded({ extended: true }));

// app.get()

app.get('/health', (req, res) => {
    res.status(200).json({
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

//Routes
app.use('/api/auth', authRoutes);


// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;