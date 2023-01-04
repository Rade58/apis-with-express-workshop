import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import config from "./config";
// import app from "./files_server";
import app from "./server";

dotenv.config();

// const PORT = 3001;

app.listen(config.port, () => {
  console.log(`Server listening on http://127.0.0.1:${config.port}`);
});
