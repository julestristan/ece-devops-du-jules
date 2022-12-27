const express = require('express')
const userRouter = require('./routes/user')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000

const db = require('./dbClient')
db.on("error", (err) => {
  console.error(err)
})

function get_hit_count(callback) {
  db.incr('hits', () => {
    db.get('hits', (err, res) => {
      if(err)
        console.log(err)
      else
        console.log(res)
      callback(res)
    })
  });
}

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  get_hit_count((count) => {
    res.send('Hello World from Docker! I have been seen ' + count + ' times');
  })
})

app.use('/user', userRouter)

const server = app.listen(port, (err) => {
  if (err) throw err
  console.log("Server listening the port " + port)
})

process.on('SIGINT', () => {
  server.close()
})


module.exports = server
