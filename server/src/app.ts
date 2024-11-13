import express from "express";
import * as dotenv from "dotenv";
import { existsSync, unlinkSync } from "fs";
import productRoute from "./routes/produto";
import cors from 'cors';

dotenv.config();

//configuração apenas para o ambiente de desenvolvimento
const dbFile = "db.sqlite";
if (existsSync(dbFile)) unlinkSync(dbFile);

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/produtos/", productRoute);

export default app;