// src/_routes/index.js
'use strict';

const router = require('express').Router();
const jsonParser = require('body-parser').json;
const CardPrompt = require('../models/card.model').CardPrompt;
const mongoose = require('mongoose');

module.exports = router;

/*
  REUSEABLE FUNCTIONS
*/

function checkForError(err) {
  if (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}

function checkIfCardExists(card) {
  if (!card) {
    return res.status(404).json({message: "File not found"});
  }
}

/*
  LIST
*/

// render root path for site
router.get('/', function(req, res){  
  CardPrompt.find({deleted: {$ne: true}})
            .limit(10)
            .exec((err, cards) => {
              checkForError(err);
              CardPrompt.count({deleted: {$ne: true}}).exec(function(err, count) {
                checkForError(err);
                res.render('index', { 
                  title: 'Card List', 
                  cardPrompts: cards, 
                  current: 1,
                  totalPages: Math.ceil(count / 10)
                });
              });
  });
  
});

// just return cards as JSON data
router.get('/load-cards', ( req, res ) => {
  CardPrompt.find({deleted: {$ne: true}}, (err, cards) => {
    checkForError(err);
    res.json(cards);
  });
});

// paginate results
router.get('/load-cards/:numPerPage/:pageNum', ( req, res ) => {
  const numPerPage = parseInt(req.params.numPerPage);
  const pageNum = parseInt(req.params.pageNum);
  const skipValue = numPerPage * (pageNum - 1);
  CardPrompt.find({deleted: {$ne: true}})
            .skip(skipValue)
            .limit(numPerPage)
            .exec((err, cards) => {
              checkForError(err);
              CardPrompt.count({deleted: {$ne: true}}).exec(function(err, count) {
                checkForError(err);
                // console.log(cards);
                res.json({
                  cardPrompts: cards,
                  current: pageNum,
                  totalPages: Math.ceil(count / numPerPage)
                });
              });
            });
});

/*
  CREATE
*/

// GET path for addcard
router.get('/add', function(req, res){
  res.render('addcard', { title: 'Add Prompt' });
});

//POST path for addcard
router.post('/add', function(req, res){
  const cardData = {
    "japanesePhrase": `${req.body.japanesePhrase}`,
    "englishTranslation": `${req.body.englishTranslation}`
  };

  CardPrompt.create(cardData, function(err, cardData) {
    checkForError(err);
    res.redirect('/');
  });
});

/*
  READ
*/

// GET details of one card when adding/removing/editing cards
router.get('/cards/:cardId', function(req, res){
  CardPrompt.findOne({ _id: `${req.params.cardId}` }, function(err, card){
    checkForError(err);
    checkIfCardExists(card);
    res.render('card', { title: 'Prompt List', mode: { admin: true }, cardPrompt: card });
  });

});

// GET details of card when taking quiz
router.get('/quiz/:cardId', function(req, res){
  CardPrompt.findOne({ _id: `${req.params.cardId}` }, function(err, card){
    checkForError(err);
    checkIfCardExists(card);
    res.render('card', { title: 'Prompt List', mode: { admin: false }, cardPrompt: card });
  });

});

/*
  UPDATE
*/

// GET path to editcard form
router.get('/editcard/:cardId', function(req, res){
  const id = req.params.cardId
  CardPrompt.findOne({ _id: `${id}` }, function(err, card){
    checkForError(err);
    checkIfCardExists(card);
    res.render('editcard', { title: 'Prompt List', cardPrompt: card, cardId: card._id });
  });
});

// PUT path to update card from form data
router.put('/editcard/:cardId', function(req, res){
  const id = req.params.cardId
  CardPrompt.findOne({ _id: `${id}` }, function(err, card){
    checkForError(err);
    checkIfCardExists(card);

    card.japanesePhrase = req.body.japanesePhrase;
    card.englishTranslation = req.body.englishTranslation;
  
    card.save(function(err, savedCard) {
      checkForError(err);
      res.json(savedCard);
    });
  });
});

/*
  DELETE
*/

// DELETE path to soft delete one card
router.delete('/cards/:cardId', function(req, res){
  const cardId = req.params.cardId;

  CardPrompt.findById(cardId, function(err, card) {
    checkForError(err);
    checkIfCardExists(card);

    card.deleted = true;

    card.save(function(err, doomedFile) {
      res.json(doomedFile);
    })
  })
});

// greeting to begin card prompts
router.get('/greeting', function(req, res){
  res.render('greeting');
});

// return random card
router.get( '/cards', ( req, res ) => {
  res.render('randomcard')
});

// return random card
router.get( '/quiz', ( req, res ) => {
  res.render('randomcard')
});

