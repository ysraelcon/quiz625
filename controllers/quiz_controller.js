var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
 exports.load = function(req, res, next, quizId) {
   //no find, sino findById
   models.Quiz.findById(quizId).then(
     function(quiz) {
       if (quiz) {
         req.quiz = quiz;
         next();
       } else { next(new Error('No existe quizId=' + quizId)); }
     }
   ).catch(function(error) { next(error);});
 };


// GET /quizes
 exports.index = function(req, res) {
   models.Quiz.findAll().then(function(quizes) {
     res.render('quizes/index.ejs', { quizes: quizes,errors:[]});
   })
   .catch(function(error){next(error);})
 };
 
 // GET /quizes/:id
 exports.show = function(req, res) {
   
     res.render('quizes/show', { quiz: req.quiz,errors:[]});
   
 };

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  //no find, sino findById
  var resultado = 'mal mal, mapeate';
   if (req.query.respuesta === req.quiz.respuesta) {
     resultado = 'que Inteligenteeeje';
   }
   res.render(
     'quizes/answer', 
     { quiz: req.quiz, 
       respuesta: resultado, 
       errors: []
     }
   );
  };

// GET /quizes/new
 exports.new = function(req, res) {
   var quiz = models.Quiz.build(
     {pregunta: "", respuesta: ""}//los valores del form, crear pregunta
   );
 
   res.render('quizes/new', {quiz: quiz,errors:[]});
 };
 
 // POST /quizes/create
 exports.create = function(req, res) {
   var quiz = models.Quiz.build( req.body.quiz );
 
 quiz
   .validate()
   .then(
     function(err){
       if (err) {
         res.render('quizes/new', {quiz: quiz, errors: err.errors});
       } else {
         quiz // save: guarda en DB campos pregunta y respuesta de quiz
         .save({fields: ["pregunta", "respuesta"]})
         .then( function(){ res.redirect('/quizes')}) 
       }      // res.redirect: Redirección HTTP a lista de preguntas
     }
   );
 };
