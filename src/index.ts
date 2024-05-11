import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { configureExpressApp, dbConnection } from "@/server";
import logger from "@/shared/logger";
import { configuration } from "@/utils";

const startServer = async () => {

  const app = express();
  const httpServer = createServer(app);
  //-------------- connect to database---------------------
  await dbConnection();
  //-------------- end database connecivity      ---------------------
  // -----------------Message broker--------------------------
  // -----------------End Message broker---------------------
  await configureExpressApp(app);
  const port = configuration.port ?? 0;
  httpServer.listen(port, () => {
    logger.info("Aapp listening in port port: " + port);
  });
};

startServer();
