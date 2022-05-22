const sqlite3 = require('sqlite3').verbose();
const reader = require('xlsx');

let db = new sqlite3.Database('./info.db');
const file = reader.readFile('./Events Sheet.xlsx')

let people = []
const sheets = file.SheetNames

for (let i = 0; i < sheets.length; i++) {
  const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
  temp.forEach((res) => {
    for (let person in res) {
      if (typeof people[res[person]] != "object") {
          people[res[person]] = [];
      }
      people[res[person]].push(`${file.SheetNames[i]} ${person}`);
    }
  })
}

//for (let i = 0; i < data.length; i++) {
  //Object.keys(people)
  //let peopleName = data[i].name.replace(/(.*), ([^\s]+).*/, "$2 $1");

  //db.run(`UPDATE students SET Events=? WHERE Name=?)`, [events, peopleName.toLowerCase()], (err) => {
    //if (err) {
      //  return console.log(err.message);
    //}
    //console.log(`This worked.`, peopleName);
  //});
//}