/*
Author : Sofian Hussein, Léo del Duca, Milo Soupper, Rodrigo Silva Riço
Date : 04.03.2026
Title : app.js
Desc : This file is the entry point of the application
*/
import express from "express";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import orderRoute from "./routes/orderRoutes.js";
import employeeRouter from "./routes/employeeRoutes.js";
import errorMiddleware from './middlewares/errorMiddleware.js'
import mealRouter from "./routes/mealRoutes.js";
import authRouter from "./routes/authRoutes.js";
import {swaggerServe, swaggerSetup} from "./config/swagger.js";
import cors from 'cors';

const app = express();

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true // Allow cookies and auth headers on cross-origin requests
}));

app.use(express.json());

// Max 100 requests every 15 minutes
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use(helmet());

app.use("/api-docs", swaggerServe, swaggerSetup);

app.use("/orders", orderRoute);

app.use("/meals", mealRouter);

app.use("/auth", authRouter);

app.use("/employees", employeeRouter );

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger UI → http://localhost:${PORT}/api-docs`);
});