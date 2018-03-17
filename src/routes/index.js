// src/_routes/index.js
'use strict';

const router = require('express').Router();
const jsonParser = require('body-parser').json;
const CardPrompt = require('../models/card.model').CardPrompt;
const mongoose = require('mongoose');

module.exports = router;

/*
  LIST
*/
router.get('/', function(req, res){  
  CardPrompt.find({deleted: {$ne: true}}, function(err, prompts){
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    res.render('index', { title: 'Prompt List', cardPrompts: prompts });
  });
  
});

/*
  CREATE
*/

router.get('/add', function(req, res){
  res.render('addcard', { title: 'Add Prompt' });
});

router.post('/add', function(req, res){
  console.log(req.body);
  const cardData = {
    "japanesePhrase": `${req.body.japanesePhrase}`,
    "englishTranslation": `${req.body.englishTranslation}`
  };

  CardPrompt.create(cardData, function(err, cardData) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    console.log(cardData);
    // res.json(cardData);
    res.redirect('/');
  });
});

/*
  READ
*/

router.get('/cards/:cardId', function(req, res){
  CardPrompt.findOne({ _id: `${req.params.cardId}` }, function(err, prompt){
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    res.render('card', { title: 'Prompt List', cardPrompt: prompt });
  });

});

/*
  UPDATE
*/

router.get('/editcard/:cardId', function(req, res){
  const id = req.params.cardId
  CardPrompt.findOne({ _id: `${id}` }, function(err, prompt){
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    res.render('editcard', { title: 'Prompt List', cardPrompt: prompt, cardId: prompt._id });
  });
});

router.put('/editcard/:cardId', function(req, res){
  const id = req.params.cardId
  CardPrompt.findOne({ _id: `${id}` }, function(err, card){
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    if (!card) {
      return res.status(404).json({message: "File not found"});
    }

    card.japanesePhrase = req.body.japanesePhrase;
    card.englishTranslation = req.body.englishTranslation;
  
    card.save(function(err, savedCard) {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json(savedCard);
    });
  });
});

/*
  DELETE
*/

router.delete('/cards/:cardId', function(req, res){
  const cardId = req.params.cardId;

  CardPrompt.findById(cardId, function(err, card) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    if (!card) {
      return res.status(404).json({message: "File not found"});
    }

    card.deleted = true;

    card.save(function(err, doomedFile) {
      res.json(doomedFile);
    })
  })
});
