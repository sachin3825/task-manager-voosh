import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { userRoutes, taskRoutes } from './routes/index.js';
import { cloudinaryConnect } from './config/cloudinary.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
connectDB();
cloudinaryConnect();

const apiRouter = express.Router();

apiRouter.use('/user', userRoutes);
apiRouter.use('/task', taskRoutes);

app.use('/api/v1', apiRouter);

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
