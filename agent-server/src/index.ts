import express from "express";
import cors from "cors";
import routes from "./routes/routes";
import { initializeAgent } from "./controller";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use("/v1", routes);

async function startServer() {
  try {
    await initializeAgent(); // Initialize the agent before starting the server
    app.listen(port, () => {
      console.log(`[server]: running on: ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
