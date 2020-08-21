const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Attribute = new Schema({
    name: {
        type: String,
        required: 'Need a name'
    },
    value: {
        type: String,
        require: 'Need a value'
    },
    coordenate: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Coordenate' 
    }
});

const Coordenate = new Schema({
    name: {
        type: String,
        required: 'Need a name'
    },
    color: {
        type: String,
        require: 'Need a color'
    },
    longitude: {
        type: String,
        required: 'Need a logitude'
    },
    latitude: {
        type: String,
        required: 'Need a latitude'
    },
    attributes: [Attribute]
});

module.exports = mongoose.model('Coordenate', Coordenate);