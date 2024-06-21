import express from "express";
import morgan from "morgan";
import cors from "cors";

import salonHandler from "./src/routes/salon.routes.js";
import clientHandler from "./src/routes/client.routes.js";
import servicesHandler from "./src/routes/services.routes.js";
import collaboratorHandler from "./src/routes/collaborator.routes.js";
import timeHandler from "./src/routes/time.routes.js";
import schedulingHandler from "./src/routes/scheduling.routes.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.set("port", 8000);

app.use("/salon", salonHandler);
app.use("/client", clientHandler);
app.use("/services", servicesHandler);
app.use("/collaborator", collaboratorHandler);
app.use("/time", timeHandler);
app.use("/scheduling", schedulingHandler);

app.listen(app.get("port"), function () {
  console.log("API escutando porta " + app.get("port"));
});
