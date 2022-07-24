// import moment from 'moment';
const moment = require("moment");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

const db = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    password: "123456",
    database: "postgres",
  },
});

app.set("db", db);

function getAllStudents(db) {
  return db
    .select("*")
    .from("CQ.student")
    .then((rows) => rows);
}

function getAllBooks(db) {
  return db
    .select("CQ.books.*", "CQ.student.firstname")
    .from("CQ.books")
    .leftJoin("CQ.student", "CQ.student.id", "CQ.books.student_id")
    .then((rows) => rows);
}

function updateBooks(params) {
  if (params.date_of_borrow === "Invalid date") {
    params.date_of_borrow = null;
  }

  if (params.date_of_return === "Invalid date") {
    params.date_of_return = null;
  }
  console.log("sdadsada", params);
  return db("CQ.books")
    .where({ id: params.id })
    .update(
      {
        student_id: params.student_id,
        name: params.name,
        author: params.author,
        date_of_borrow: params.date_of_borrow,
        date_of_return: params.date_of_return,
      },
      ["id", "student_id", "name", "author", "date_of_borrow", "date_of_return"]
    )
    .then((rows) => rows);
}

function updateStudent(params) {
  return db("CQ.student")
    .where({ id: params.id })
    .update(
      {
        lastname: params.lastname,
        firstname: params.firstname,
      },
      ["id", "lastname", "firstname"]
    )
    .then((rows) => console.log(rows));
}

app.get("/book", function (req, res) {
  getAllBooks(db).then((data) => {
    res.send(data);
  });
});

app.get("/students", function (req, res) {
  getAllStudents(db).then((data) => {
    res.send(data);
  });
});

app.post("/updateStudents", function (req, res) {
  console.log(req.body);
  updateStudent(req.body).then((data) => {
    res.send(200);
  });
});
app.post("/updateBooks", function (req, res) {
  console.log(req.body);
  updateBooks(req.body).then((data) => {
    res.send(200);
  });
});

app.get("/", function (req, res) {
  res.send(200, "Hello");
});

app.listen(PORT);
