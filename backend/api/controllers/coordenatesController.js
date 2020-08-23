var mongoose = require('mongoose'),
    Coordenate = mongoose.model('Coordenate');

/**
 * Method to find all coordenates
 * @param {Request} request 
 * @param {Response} response 
 */
exports.find_all = function (request, response) {
    Coordenate.find({}, function (error, value) {
        if (error)
            response.status(500).send(error);
        response.status(200).json(value.sort());
    });
};

/**
 * Method to find the coordenate by id
 * @param {Request} request 
 * @param {Response} response 
 */
exports.find_by_id = function (request, response) {
    Coordenate.findById(request.params.id, function (error, value) {
        if (error)
            response.status(500).send(error);
        response.status(200).json(value);
    });
};

/**
 * Method to save the coordenate
 * @param {Request} request 
 * @param {Response} response 
 */
exports.save = function (request, response) {
    request.body.map(item => {
        var coordenate = new Coordenate(item);
        coordenate.save(function (error, value) {
            if (error)
                response.status(500).send(error);
        });
    });
    response.status(201).send();
};

/**
 * Method to update the coordenate
 * @param {Request} request 
 * @param {Response} response 
 */
exports.update = function (request, response) {
    Coordenate.findOneAndUpdate({ _id: request.params.id }, request.body,
        function (error, value) {
            if (error)
                response.status(500).send(error);
            response.status(200).send();
        });
};

/**
 * Method to remove the coordenate
 * @param {Request} request 
 * @param {Response} response 
 */
exports.remove = function (request, response) {
    Coordenate.deleteOne({ _id: request.params.id },
        function (error, value) {
            if (error)
                response.status(500).send(error);
            response.status(200).send();
        });
};