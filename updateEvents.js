const sqlite3 = require('sqlite3').verbose();
const reader = require('xlsx');

let db = new sqlite3.Database('./info.db');
const file = reader.readFile('./Events Sheet.xlsx')

let people = [];
const sheets = file.SheetNames;

for (let i = 0; i < sheets.length; i++) {
  const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
  temp.forEach((res) => {
    for (let person in res) {
      if (typeof people[res[person]] != "object") {
        people[res[person]] = [];
      }
      people[res[person]].push(`${person} ${file.SheetNames[i]}`);
    }
   })
}

for (let i = 0; i < Object.keys(people).length; i++) {
  let events = [];
  for (let event of people[Object.keys(people)[i]]) {
    if (event.match(/(.* .*)_(.*)/)) {
      let heatNumber = event.replace(/(.* .*)_(.*) (.*)/, "$2");
      event = event.replace(/(.* .*)_(.*) (.*)/, `$1 $3 Heat ${parseInt(heatNumber) + 1}`);
    }
    events.push({"title": event, "time": "Unknown"})
  }

  if (!Object.keys(people)[i].match(/.* .*/)) continue;

  db.run(`UPDATE students SET Events=? WHERE Name=?`, [JSON.stringify(events), Object.keys(people)[i].toLowerCase()], (err) => {
    if (err) {
        return console.log(err.message);
    }
    console.log(`This worked.`, Object.keys(people)[i]);
  });
}