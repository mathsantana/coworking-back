const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3003;
const cors = require("cors");

const routes = require("./routes");

app.use(cors());

app.use(bodyParser.json());
app.use("/", routes);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
