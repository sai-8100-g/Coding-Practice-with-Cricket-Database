const express = require('express')
const path = require('path')
const dbPath = path.join(__dirname, 'cricketTeam.db')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())
let db = null

const initializer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000)
  } catch (e) {
    console.log(`DB error: ${e.message}`)
  }
}

initializer()

app.get('/players/', async (request, response) => {
  const getAllPlayersQuery = `SELECT 
                                 *
                                 FROM
                                 cricket_team;`
  const result = await db.all(getAllPlayersQuery)
  response.send(result)
})

app.post('/players/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body

  const postingQuery = `INSERT INTO cricket_team (player_name, jersey_number, role)
                            VALUES (${playerName}, ${jerseyNumber}, ${role});`

  const dbResponse = await db.run(postingQuery)
  const id = dbResponse.lastID
  response.send(`Player Added to Team`)
})
