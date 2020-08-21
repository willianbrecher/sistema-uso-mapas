module.exports = function (app) {
    var coordenates = require('./controllers/coordenatesController');

    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    app.route('/coordenates')
        .get(coordenates.find_all)
        .post(coordenates.save);

    app.route('/coordenates/:id')
        .get(coordenates.find_by_id)
        .put(coordenates.update)
        .delete(coordenates.remove);
}
