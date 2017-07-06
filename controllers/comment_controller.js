var models = require('../models/models.js');
var Sequelize=require('sequelize');
 
 // GET /quizes/:quizId/comments/new
 exports.new = function(req, res) {
   res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
 };
 
 // POST /quizes/:quizId/comments
 exports.create = function(req, res) {
   var comment = models.Comment.build(
       { texto: req.body.comment.texto,          
         QuizId: req.params.quizId
         });
 
   comment
   .save()
   .then( function(){ res.redirect('/quizes/'+req.params.quizId)})
   .catch(Sequelize.ValidationError, function (err) {
      res.render('comments/new.ejs', {comment: comment, errors: err.errors});
     }).catch(function(error){next(error)});
   
 };