var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const CSVToJSON = require("csvtojson");
const JSONToCSV = require("json-2-csv");
var app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// env
const PORT = 3100;
const ASSETS_PATH = "assets";
const ASSETS_BILL = "bill.csv";
const ASSETS_CATE = "categories.csv";

// for get data
const getJsonByFileName = (fileName) =>
  CSVToJSON().fromFile(path.resolve(__dirname, ASSETS_PATH, fileName));

// for save data
const saveJsonByFileName = (fileName, data) =>
  JSONToCSV.json2csvAsync(data).then(
    (csv) =>
      new Promise((res, rej) => {
        fs.writeFile(
          path.resolve(__dirname, ASSETS_PATH, fileName),
          csv,
          (err) => {
            if (err) {
              rej(err);
            } else {
              res(data);
            }
          }
        );
      })
  );

app.get("/bill", function (req, res) {
  getJsonByFileName(ASSETS_BILL).then((data) => res.send(data));
});

app.get("/categories", function (req, res) {
  getJsonByFileName(ASSETS_CATE).then((data) => res.send(data));
});

app.post("/bill", function (req, res) {
  const data = !!req.body && req.body.data;
  if (data) {
    saveJsonByFileName(ASSETS_BILL, data).then((data) => res.send(data));
  } else {
    res.status(501).send("post not data");
  }
});

app.post("/categories", function (req, res) {
  const data = !!req.body && req.body.data;
  if (data) {
    saveJsonByFileName(ASSETS_CATE, data).then((data) => res.send(data));
  } else {
    res.status(501).send("post not data");
  }
});

app.listen(PORT, function () {
  console.log("Example app listening on port " + PORT + "!");
});
