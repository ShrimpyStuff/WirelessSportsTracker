const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./info.db');

db.run(`CREATE TABLE IF NOT EXISTS students (Name VARCHAR(100), Grade NUMBER, DOB VARCHAR(100), Events VARCHAR(100), UNIQUE(Name, DOB))`);

db.run(`INSERT INTO students (Name, Grade, DOB, Events)
    VALUES (?, ?, ?, ?)`, ["Sajid Monowar", 8, "10/17/2008", "ok"], (err) => {
      if (err) {
        return console.log(err.message);
      }
      console.log(`This worked.`);
    });

let lookupsql = `SELECT Events events,
                        Grade grade,
                        DOB dob
                 FROM students
                 WHERE Name = ?
`;

db.get(lookupsql, ["Sajid Monowar"], (err, row) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(row);
});