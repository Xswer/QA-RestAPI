'use strict'

var express = require('express');
var Question = require('../models/').Question;

var router = express.Router();


router.param("qID", function(req, res, next, id){
    Question.findById(id, function(err, doc){
        if(err) return next(err);
        if(!doc) {
            err = new Error("Not Found");
            err.status = 404;
            return next(err);
        }
        req.question = doc;
        next();
    });
});

router.param("aID", function(req, res, next, id){
    req.answer = req.question.answers.id(id);
    if(!req.answer) {
        err = new Error("Not Found");
        err.status = 404;
        return next(err);
    }
    next();
});
// GET /questions
// Return all the questions
router.get('/', function(req, res, next){
    Question.find({})
            .sort({createdAt: -1})
            .exec(function(err, questions){
                if (err) return next(err);
                res.json(questions);
            });
});

// POST /questions
// Create a question
router.post('/', function(req, res){
    var question = new Question(req.body);
    question.save(function(err, question, next){
        if(err) return next(err);
        res.status(201);
        res.json(question);
    });
});

// GET /questions/:qID
// Return the question
router.get('/:qID', function(req, res, next){
    res.json(req.question);
});

// POST /questions/:qID/answers
// Create an answer
router.post('/:qID/answers', function(req, res, next){
    req.question.answers.push(req.body);
    req.question.save(function(err, question, next){
        if(err) return next(err);
        res.status(201);
        res.json(question);
    });
});

// PUT /questions/:qID/answers/:aID
// Edit an answer
router.put('/:qID/answers/:aID', function(req, res, next){
    req.answer.update(req.body, function(err, result){
        if(err) return next(err);
        res.json(result);
    });
});

// DELETE /questions/:qID/answers/:aID
// delete an answer
router.delete('/:qID/answers/:aID', function(req, res){
    req.answer.remove(function(err){
        req.question.save(function(err, question) {
            if(err) return next(err);
            res.json(question);
        });
    });
});

// POST /questions/:qID/answers/:aID/vote-up
// POST /questions/:qID/answers/:aID/vote-down
// Vote on an answer
router.post('/:qID/answers/:aID/vote-:dir', function(req, res, next){
    if(req.params.dir.search(/^(up|down)$/) === -1) {
        var err = new Error("Not found");
        err.status = 404;
        next(err);
    } else {
        req.vote = req.params.dir;
        next();
    }
}, 
function(req, res, next){
    req.answer.vote(req.vote, function(err, question){
        if(err) return next(err);
        res.json(question);
    });
});


module.exports = router;