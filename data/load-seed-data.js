const client = require('../lib/client');
// import our seed data:
const games = require('./games.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      games.map(game => {
        return client.query(`
                    INSERT INTO games (name, genre, price, rating, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
        [game.name, game.genre, game.price, game.rating, game.mature, user.id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
