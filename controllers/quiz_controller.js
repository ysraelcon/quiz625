// GET /quizes/question
 exports.question = function(req, res) {
    res.render('quizes/question', {pregunta: 'Capital de Cojedes'});
 };
 
 // GET /quizes/answer
 exports.answer = function(req, res) {
    if (req.query.respuesta === 'San Carlos'){
       res.render('quizes/answer', {respuesta: 'que geografo!'});
    } else {
       res.render('quizes/answer', {respuesta: 'mal mal'});
    }
 };