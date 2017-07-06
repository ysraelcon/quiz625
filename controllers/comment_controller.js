var models = require('../models/models.js');
var Sequelize=require('sequelize'); 

// Autoload :id de comentarios
 exports.load = function(req, res, next, commentId) {
   models.Comment.find({
             where: {
                 id: Number(commentId)
             }
         }).then(function(comment) {
       if (comment) {
         req.comment = comment;
         next();
       } else{next(new Error('No existe commentId=' + commentId))}
     }
   ).catch(function(error){next(error)});
 };

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


 // GET /quizes/:quizId/comments/:commentId/publish
 exports.publish = function(req, res) {
   req.comment.publicado = true;
 
   req.comment.save( {fields: ['publicado']})
     .then( function(){ res.redirect('/quizes/'+req.params.quizId);} )
     .catch(function(error){next(error)});
 
   };