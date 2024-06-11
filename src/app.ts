// src/app.ts

import express from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerDocs from "./mergeYaml";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUI.serve,  swaggerUI.setup(swaggerDocs));




export default app;