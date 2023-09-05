// import thư viện express
var express = require("express");
var _ = require("underscore");

var app = express();
// khai báo cổng chạy dịch vụ
var PORT = process.env.PORT || 3001;
var bodyParser = require("body-parser");
var todoNextId = 4;

app.use(bodyParser.json());
// "To do API Root" sẽ được trả về khi thực hiện get request trên trang home page của ứng dụng
app.get("/", function (req, res) {
  res.send("To do API Root");
});

app.listen(PORT, function () {
  console.log("Express listening on port" + PORT + "!");
});
// GET /todos
app.get("/todos", function (req, res) {
  res.json(todos);
});
app.get("/todos/:id", function (req, res) {
  // params được gửi thuộc kiểu string do đó phải convert params về kiểu integer

  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, { id: todoId });
  // duyệt từng phần tử trong todos
  todos.forEach(function (todo) {
    if (todoId == todo.id) {
      matchedTodo = todo;
    }
  });
  // nếu tồn tại kết quả thì trả về dưới dạng json nếu không trả về status 404
  if (matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send();
  }
});
app.post("/todos", function (req, res) {
  var body = _.pick(req.body, "description", "completed"); //never trust parameters from the scary internet

  if (
    !_.isBoolean(body.completed) ||
    !_.isString(body.description) ||
    body.description.trim().length == 0
  ) {
    return res.status(400).send();
  }

  body.id = todoNextId++;

  todos.push(body);

  res.json(body);
});

app.delete("/todos/:id", function (req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, { id: todoId });

  if (!matchedTodo) {
    res.status(404).json({ error: "no todo found with that id" });
  } else {
    todos = _.without(todos, matchedTodo);
    res.json(matchedTodo);
  }
});

// PUT /todos/:id
app.put("/todos/:id", function (req, res) {
  var body = _.pick(req.body, "description", "completed");
  var validAttributes = {};

  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, { id: todoId });

  if (!matchedTodo) {
    return res.status(404).json();
  }

  if (body.hasOwnProperty("completed") && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty("completed")) {
    return res.status(404).json();
  }

  if (
    body.hasOwnProperty("description") &&
    _.isString(body.description) &&
    body.description.trim().length > 0
  ) {
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty("description")) {
    return res.status(404).json();
  }

  _.extend(matchedTodo, validAttributes);
  res.json(matchedTodo);
});
var todos = [
  {
    id: 1,
    description: "Build a simple API - nodejs",
    completed: false,
  },
  {
    id: 2,
    description: "Go to T-beer - team building",
    completed: false,
  },
  {
    id: 3,
    description: "Feed the dog ",
    completed: true,
  },
];
