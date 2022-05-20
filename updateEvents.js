const sqlite3 = require('sqlite3').verbose();
const reader = require('xlsx');

let db = new sqlite3.Database('./info.db');
const file = reader.readFile('./Events Sheet.xlsx')
  
let data = []
const sheets = file.SheetNames

for(let i = 0; i < sheets.length; i++)
{
  let event = {};
  event[file.SheetNames[i]] = {};
   const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
   temp.forEach((res) => {
      event[file.SheetNames[i]].push(res);
   })
   data.push(event);
}

for (let i = 0; i < data.length; i++) {
  let peopleName = data[i].name.replace(/(.*), ([^\s]+).*/, "$2 $1");

  db.run(`UPDATE students SET Events=? WHERE Name=?)`, [events, peopleName.toLowerCase()], (err) => {
    if (err) {
        return console.log(err.message);
    }
    console.log(`This worked.`, peopleName);
  });
}