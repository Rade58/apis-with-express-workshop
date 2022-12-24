import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import app from "./files_server";

dotenv.config();

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
});
