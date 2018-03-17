// Load mongoose package
const mongoose = require('mongoose');

const CardPromptSchema = new mongoose.Schema({  
  japanesePhrase: String,
  englishTranslation: String,
  deleted: {type: Boolean, default: false}
});

const CardPrompt = mongoose.model('cards', CardPromptSchema);

CardPrompt.count({}, function(err, count) {
  if (err) {
    throw err;
  }

  if (count > 0) return;

  const cards = require('./card.seed.json');
  CardPrompt.create(cards, function(err, newFiles) {
    if (err) {
      throw err;
    }
    console.log("DB seeded")
  });

});

module.exports.CardPrompt = CardPrompt;
