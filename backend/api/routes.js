module.exports = function (app) {
    var coordinates = require('./controllers/coordinatesController');

    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
      next();
    });

    app.route('/coordinates')
        .get(coordinates.find_all)
        .post(coordinates.save);

    app.route('/coordinates/:id')
        .get(coordinates.find_by_id)
        .put(coordinates.update)
        .delete(coordinates.remove);
}
