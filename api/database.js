import { connect } from "mongoose";

const URI =
  "mongodb+srv://user:pass@clustertcc.nc0rltn.mongodb.net/TCC?retryWrites=true&w=majority&appName=ClusterTCC";

connect(URI)
  .then(() => console.log("DB is Up!"))
  .catch((err) => {
    console.error("Failed to connect to the database.");
    console.error(err);
  });
