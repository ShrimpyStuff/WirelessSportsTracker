const sqlite3 = require('sqlite3').verbose();
const reader = require('xlsx');

let db = new sqlite3.Database('./info.db');
const file = reader.readFile('./Students.xlsx')
  
let data = []

const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]])
temp.forEach((res) => {
    var firstKey = Object.keys(res)[0];
    delete res[firstKey];
    res.name = res.__EMPTY;
    res.dob = res.__EMPTY_1;
    res.grade = res.__EMPTY_2;
    delete res.__EMPTY;
    delete res.__EMPTY_1;
    delete res.__EMPTY_2;
    data.push(res);
})

data.shift();
console.log(data[0])

for (let i = 0; i < data.length - 1; i++) {
    db.run(`INSERT INTO students (Name, Grade, DOB, Events)
        VALUES (?, ?, ?, ?)`, [peopleName, data[i].dob, peopleDOB, ''], (err) => {
    if (err) {
        return console.log(err.message);
    }
    console.log(`This worked.`, peopleName);
    });
}