var mongoose = require('mongoose'),
    Coordinate = mongoose.model('Coordinate');

/**
 * Method to find all coordinates
 * @param {Request} request 
 * @param {Response} response 
 */
exports.find_all = function (request, response) {
    Coordinate.find({}, function (error, value) {
        if (error)
            response.status(500).send(error);
        response.status(200).json(value.sort());
    });
};

/**
 * Method to find the Coordinate by id
 * @param {Request} request 
 * @param {Response} response 
 */
exports.find_by_id = function (request, response) {
    Coordinate.findById(request.params.id, function (error, value) {
        if (error)
            response.status(500).send(error);
        response.status(200).json(value);
    });
};

/**
 * Method to save a list of coordinates
 * @param {Request} request 
 * @param {Response} response 
 */
exports.save = function (request, response) {
    request.body.map(item => {
        var coordinate = new Coordinate(item);
        coordinate.save(function (error, value) {
            if (error)
                response.status(500).send(error);
        });
    });
    response.status(201).send();
};

/**
 * Method to update the Coordinate
 * @param {Request} request 
 * @param {Response} response 
 */
exports.update = function (request, response) {
    Coordinate.findOneAndUpdate({ _id: request.params.id }, request.body,
        function (error, value) {
            if (error)
                response.status(500).send(error);
            response.status(200).send();
        });
};

/**
 * Method to remove the Coordinate
 * @param {Request} request 
 * @param {Response} response 
 */
exports.remove = function (request, response) {
    Coordinate.deleteOne({ _id: request.params.id },
        function (error, value) {
            if (error)
                response.status(500).send(error);
            response.status(200).send();
        });
};