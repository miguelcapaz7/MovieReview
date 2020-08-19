var mongoose         = require('mongoose');

var movieSchema    = mongoose.Schema({
        // The _id property serves as the primary key. 

        // _id property is created by default when data is inserted.
        _id:            {"type" : Number, required: true},
        movieName: {"type": 'String'},
        rating: [{"type": Number, min: 1, max: 5, required: true}],
        reviews: [{"type": "String"}],
        author: [{"type": "String"}],
        date: [{"type": "String"}],
    }, 
    {   
        versionKey: false 
    });
var Movie  = mongoose.model('Movie', movieSchema);
module.exports = Movie;
