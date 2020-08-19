const Movie = require('../Models/Movie');

class MovieRepo {
    
    // This is the constructor.
    MovieRepo() {        
    }

    // Gets all movies.
    async allMovies() {     
        let movies = await Movie.find().exec();
        return   movies;
    }

    async getMovie(id) {  
        let movie = await Movie.findOne({_id:id}).exec();
        return   movie;
    }

    async create(editedObj) {   
    
        // Set up response object which contains original movie object and empty error message.
        let response = {
            obj:          editedObj,
            errorMessage: "" };
    
        try {
            // Ensure the content submitted by the user validates.
            var error = await editedObj.validateSync();
            if(error) {
                response.errorMessage = error.message;
                return response;
            } 
    
            // Load the actual corresponding object in the database.
            let movieObject = await this.getMovie(editedObj.id);
    
            // Check if movie exists.
            if(movieObject) {
    
                // Movie exists so update it.
                let updated = await Movie.updateOne(
                    { _id: editedObj.id
                    }, // Match id.
    
                    // Set new attribute values here.
                    {$push: { reviews: editedObj.reviews, rating: editedObj.rating,
                    author: editedObj.author, date: editedObj.date }});
                    
                // No errors during update.
                if(updated.nModified!=0) {
                    response.obj = editedObj;
                    return response;
                }
                // Errors occurred during the update.
                else {
                    response.errorMessage = 
                        "An error occurred during the update. The item did not save." 
                };
                return response; 
            }
                
            // Movie not found.
            else {
                response.errorMessage = "An item with this id cannot be found." };
                return response; 
            }
    
                    // An error occurred during the update. 
        catch (err) {
            response.errorMessage = err.message;
            return  response;
        }    
    } 
    
    async update(editedObj, index) {   
    
        // Set up response object which contains origianl movie object and empty error message.
        let response = {
            obj:          editedObj,
            errorMessage: "" };
    
        try {
            // Ensure the content submitted by the user validates.
            var error = await editedObj.validateSync();
            if(error) {
                response.errorMessage = error.message;
                return response;
            } 
    
            // Load the actual corresponding object in the database.
            let movieObject = await this.getMovie(editedObj._id);
    
            // Check if movie exists.
            if(movieObject) {
                // Movie exists so update it.
                let updated = await Movie.updateOne(
                    { _id: editedObj._id
                    }, // Match id.
                    // Set new attribute values here.
                    {$set: { [`rating.${index}`]: editedObj.rating, [`reviews.${index}`]: editedObj.reviews,
                    [`author.${index}`]: editedObj.author, [`date.${index}`]: editedObj.date}}); 
    
                // No errors during update.
                if(updated.nModified!=0) {
                    response.obj = editedObj;
                    return response;
                }
                // Errors occurred during the update.
                else {
                    respons.errorMessage = 
                        "An error occurred during the update. The item did not save." 
                };
                return response; 
            }
                
            // Movie not found.
            else {
                response.errorMessage = "An item with this id cannot be found." };
                return response; 
            }
    
                    // An error occurred during the update. 
        catch (err) {
            response.errorMessage = err.message;
            return  response;
        }    
    }  

    async delete(movie, index) {
        await Movie.updateOne(
            {_id: movie._id}, //matches id of movie
            { 
                // sets value of deleted attributes to null
                $set: {
                [`rating.${index}`]: null,
                [`reviews.${index}`]: null,
                [`author.${index}`]: null,
                [`date.${index}`]: null
                }
            }
        );
        let deletedItem = await Movie.updateOne(
            {_id: movie._id},
            // deletes the attributes 
            { $pull: {rating: null, reviews: null, author: null, date: null}}
        )
        return deletedItem;
    }
}
module.exports = MovieRepo;