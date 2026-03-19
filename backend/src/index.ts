import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { healthRouter } from './routes/health';
import { developmentRouter } from './routes/development';
import { pregnancyRouter } from './routes/pregnancy';
import { medicationRouter } from './routes/medication';
import { appointmentRouter } from './routes/appointment';
import { kickRouter } from './routes/kick';
import { articleRouter } from './routes/article';
import { userRouter } from './routes/user';
import { chatRouter } from './routes/chat';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/development', developmentRouter);
app.use('/api/v1/pregnancy', pregnancyRouter);
app.use('/api/v1/medications', medicationRouter);
app.use('/api/v1/appointments', appointmentRouter);
app.use('/api/v1/kicks', kickRouter);
app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/chat', chatRouter);

// Welcome route
app.get('/', (_req, res) => {
    res.json({
        name: 'Ponnyxinchao! API',
        version: '1.0.0',
        status: '🌸 Running',
        message: 'Chào mừng đến với Ponnyxinchao! API 🎉',
        endpoints: {
            health: '/api/v1/health',
            development: '/api/v1/development/week/:week',
            pregnancy: '/api/v1/pregnancy/calculate',
            medications: '/api/v1/medications',
            appointments: '/api/v1/appointments',
            kicks: '/api/v1/kicks/session',
            articles: '/api/v1/articles',
            user: '/api/v1/user/profile',
        },
    });
});

// Start server
app.listen(config.port, () => {
    console.log(`\n🌸 Ponnyxinchao! API đang chạy tại http://localhost:${config.port}`);
    console.log(`\n📋 Endpoints:`);
    console.log(`   GET  /api/v1/health`);
    console.log(`   GET  /api/v1/development/week/24`);
    console.log(`   POST /api/v1/pregnancy/calculate`);
    console.log(`   GET  /api/v1/medications`);
    console.log(`   GET  /api/v1/medications/analysis?week=24`);
    console.log(`   GET  /api/v1/appointments/recommended?week=24`);
    console.log(`   POST /api/v1/kicks/session`);
    console.log(`   GET  /api/v1/articles?week=24`);
    console.log(`   GET  /api/v1/articles/daily-tip?week=24`);
    console.log(`   GET  /api/v1/user/profile`);
    console.log(`   PUT  /api/v1/user/theme`);
    console.log(`\n🩷 Pink Mode | 💙 Blue Mode\n`);
});

export default app;
