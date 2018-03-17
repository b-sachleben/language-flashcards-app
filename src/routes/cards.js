'use strict';

const router = require('express').Router();
const jsonParser = require('body-parser').json;
const CardPrompt = require('../models/card.model').CardPrompt;

module.exports = router;

router.get('/', function(req, res){  
    CardPrompt.find({}, function(err, cards){
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      res.json(cards);
    });
  });
  
  router.get('/:cardId', function(req, res, next) {
    const {cardId} = req.params;
  
    const card = CardPrompt.find(entry => entry.id === cardId);
    if (!card) {
      return res.status(404).end(`Could not find file '${cardId}'`);
    }
  
    res.json(card);
  });