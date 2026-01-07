// seed.js
const Anime = require('../../../models/Anime');
// ... connect to mongo
const seedDB = async () => {
  await Anime.deleteMany({});
  await Anime.insertMany(yourDataArray);
  console.log("Database Seeded");
};