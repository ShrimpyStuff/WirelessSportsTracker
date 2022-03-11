const express = require('express')
const app = express()
const port = 80

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/site/index.html')
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})