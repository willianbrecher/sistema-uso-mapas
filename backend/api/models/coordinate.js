const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Attribute = new Schema({
    name: {
        type: String,
        required: 'A name is required'
    },
    value: {
        type: String,
        require: 'A value is required'
    },
    Coordinate: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Coordinate' 
    }
});

const Coordinate = new Schema({
    name: {
        type: String,
        required: 'A name is required'
    },
    color: {
        type: String,
        require: 'A color is required'
    },
    longitude: {
        type: String,
        required: 'A longitude is required'
    },
    latitude: {
        type: String,
        required: 'A latitude is required'
    },
    attributes: [Attribute]
});

module.exports = mongoose.model('Coordinate', Coordinate);