var models = require('../models/models.js');
var Sequelize=require('sequelize');

// Autoload - factoriza el código si ruta incluye :quizId
 exports.load = function(req, res, next, quizId) {
   //no find, sino findById, aqui find
   models.Quiz.find({
             where: {
                 id: Number(quizId)
             },
             include: [{
                 model: models.Comment
             }]
         }).then(function(quiz) {
       if (quiz) {
         req.quiz = quiz;
         next();
       } else { next(new Error('No existe quizId=' + quizId)) }
     }
   ).catch(function(error) { next(error)});
 };


// GET /quizes
 exports.index = function(req, res) {
   models.Quiz.findAll().then(function(quizes) {
     res.render('quizes/index', { quizes: quizes, errors:[]});
   })
   .catch(function(error){next(error)})
 };
 
 // GET /quizes/:id
 exports.show = function(req, res) {
   
     res.render('quizes/show', { quiz: req.quiz, errors:[]});
   
 }; // req.quiz: instancia de quiz cargada con autoload

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  //no find, sino findById
  var resultado = 'mal mal, mapeate';
   if (req.query.respuesta === req.quiz.respuesta) {
     resultado = 'que Inteligenteeeje';
   }
   res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors:[]});
  };

// GET /quizes/new
 exports.new = function(req, res) {
   var quiz = models.Quiz.build(//crea objeto quiz
     {pregunta: "", respuesta: ""}//los valores del form, crear pregunta
   );
 
   res.render('quizes/new', {quiz: quiz, errors:[]});
 };
 
 // POST /quizes/create
 exports.create = function(req, res) {
   var quiz = models.Quiz.build( req.body.quiz );
 
 
 quiz
   .save({fields: ["pregunta", "respuesta"]})
   .then(
      function(){ res.redirect('/quizes')}
   ).catch(Sequelize.ValidationError, function (err) {
    res.render('quizes/new', {quiz: quiz, errors: err.errors});
   })
   .catch(function(error){next(error)});
 };

// GET /quizes/:id/edit
 exports.edit = function(req, res) {
   var quiz = req.quiz;  // req.quiz: autoload de instancia de quiz
 
   res.render('quizes/edit', {quiz: quiz, errors: []});
 };
 
 // PUT /quizes/:id
 exports.update = function(req, res) {
   req.quiz.pregunta  = req.body.quiz.pregunta;
   req.quiz.respuesta = req.body.quiz.respuesta;
 
   req.quiz
   .save( {fields: ["pregunta", "respuesta"]})
   .then( function(){ res.redirect('/quizes');})
    .catch(Sequelize.ValidationError, function (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      }).catch(function(error){next(error)});
   
 };//update

 // DELETE /quizes/:id
 exports.destroy = function(req, res) {
   req.quiz.destroy().then( function() {
     res.redirect('/quizes');
   }).catch(function(error){next(error)});
 };
 
 //  console.log("req.quiz.id: " + req.quiz.id);