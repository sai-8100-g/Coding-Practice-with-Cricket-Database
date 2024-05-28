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
    process.exit(1)
  }
}

initializer()

app.get('/players/', async (request, response) => {
  const getAllPlayersQuery = `SELECT 
                                 *
                                 FROM
                                 cricket_team;`
  const result = await db.all(getAllPlayersQuery)
  response.send(
    result.map(eachObj => {
      return {
        playerId: eachObj.player_id,
        playerName: eachObj.player_name,
        jerseyNumber: eachObj.jersey_number,
        role: eachObj.role,
      }
    }),
  )
})

app.post('/players/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const query = `INSERT INTO cricket_team (player_name, jersey_number, role)
                            VALUES ('${playerName}', '${jerseyNumber}', '${role}');`

  await db.run(query)
  response.send('Player Added to Team')
})

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const query = `
  SELECT 
  *
  FROM
  cricket_team
  WHERE
  player_id = '${playerId}';
  `
  const result = await db.get(query)

  console.log(result)
  response.send({
    playerId: result.player_id,
    playerName: result.player_name,
    jerseyNumber: result.jersey_number,
    role: result.role,
  })
})

app.put('/players/:playerId/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const {playerId} = request.params
  const query = `UPDATE 
                    cricket_team
                  SET 
                  player_name='${playerName}',
                  jersey_number='${jerseyNumber}',
                  role='${role}'
                  WHERE 
                  player_id='${playerId}';`

  await db.run(query)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const query = `DELETE FROM cricket_team WHERE player_id = ${playerId};`
  await db.run(query)
  response.send('Player Removed')
})

module.exports = app
