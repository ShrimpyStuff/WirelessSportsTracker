const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./info.db');

db.run(`CREATE TABLE IF NOT EXISTS students (Name VARCHAR(100), Grade NUMBER, Event VARCHAR(100))`);

db.run(`INSERT INTO students (Name, Grade, Event)
VALUES (?, ?, ?)`, ["Sajid Monowar", 8, "ok"], (err) => {
  if (err) {
    return console.log(err.message);
  }
  console.log(`Coolio`);
});

let lookupsql = `SELECT Event event,
                        Grade grade
                 FROM students
                 WHERE Name = ?
`;

db.each(lookupsql, ["Sajid Monowar"], (err, row) => {
  if (err) {
    console.log(err);
    return;
  }
});