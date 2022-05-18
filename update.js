const sqlite3 = require('sqlite3').verbose();
const reader = require('xlsx');

let db = new sqlite3.Database('./info.db');
const file = reader.readFile('./Students.xlsx')
  
let data = []

const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], { raw: false})
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

for (let i = 0; i < data.length; i++) {
  let peopleDOB = data[i].dob;
  if (data[i].dob.match(/^([0-9]{1})\/([0-9]{2})\/([0-9]{2})$/)) {
    peopleDOB = data[i].dob.replace(/^([0-9]{1})\/([0-9]{2})\/([0-9]{2})$/, "$2/0$1/20$3")
  }
  if (data[i].dob.match(/^([0-9]{2})\/([0-9]{2})\/([0-9]{2})$/)) {
    peopleDOB = data[i].dob.replace(/^([0-9]{2})\/([0-9]{2})\/([0-9]{2})$/, "$2/$1/20$3")
  }
  if (data[i].dob.match(/^([0-9]{1})\/([0-9]{1})\/([0-9]{2})$/)) {
    peopleDOB = data[i].dob.replace(/^([0-9]{1})\/([0-9]{1})\/([0-9]{2})$/, "0$2/0$1/20$3")
  }
  if (data[i].dob.match(/^([0-9]{2})\/([0-9]{1})\/([0-9]{2})$/)) {
    peopleDOB = data[i].dob.replace(/^([0-9]{2})\/([0-9]{1})\/([0-9]{2})$/, "0$2/$1/20$3")
  }

  let peopleName = data[i].name.replace(/(.*), ([^\s]+).*/, "$2 $1");

  db.run(`INSERT INTO students (Name, Grade, DOB, Events)
      VALUES (?, ?, ?, ?)`, [peopleName.toLowerCase(), data[i].grade, peopleDOB, ''], (err) => {
    if (err) {
        return console.log(err.message);
    }
    console.log(`This worked.`, peopleName);
  });
}