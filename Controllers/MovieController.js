const MovieRepo   = require('../Data/MovieRepo');
const _movieRepo  = new MovieRepo();
const RequestService = require('../Services/RequestService');
const Movie       = require('../Models/Movie');
const date = require('date-and-time');

exports.MyReviews = async function(request, response){
    let movies = await _movieRepo.allMovies();
    let reqInfo = RequestService.reqHelper(request);
    if(reqInfo.authenticated) {
        response.render('Movie/MyReviews', {movies:movies, errorMessage:"", reqInfo:reqInfo})
    }
    else {
        response.redirect('/User/Login?errorMessage=You ' + 
                     'must be logged in to view your reviews.')
    }
};

exports.WriteReview = async function(request, response){
    let reqInfo = RequestService.reqHelper(request);
    let userName = reqInfo.username;
    let movieID  = request.query._id;
    console.log(movieID)
    let movieObj = await _movieRepo.getMovie(movieID);
    let movie = {}
    movie._id = movieObj._id;
    movie.movieName = movieObj.movieName /// only send data that is needed.
    
    if(reqInfo.authenticated) {
        if(movieObj.author.includes(userName)) {
            response.redirect('/?errorMessage=You ' +
            'have already written a review for this movie.')
        } else {
            response.render('Movie/WriteReview', {movie:movie, errorMessage:"", reqInfo:reqInfo})
        }
    } else {
        response.redirect('/User/Login?errorMessage=You ' + 
                     'must be logged in to write reviews.')
    }
};

exports.Reviews = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let movieID  = request.query._id;
    let movieObj = await _movieRepo.getMovie(movieID); 
    response.render('Movie/Reviews', {movie:movieObj, reqInfo:reqInfo})
};

// Receives posted data that is used to update the item.
exports.Create = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let movieID = request.body._id;
    let authorName = reqInfo.username;
    let today = new Date();
    let dateToday = date.format(today, "DD-MMM-YYYY");
    let movieObj = await _movieRepo.getMovie(movieID);
    console.log(movieID)

    // Parcel up data in a 'Movie' object.
    let tempMovieObj  = new Movie( {
        _id: movieID,
        movieName: movieObj.movieName,
        rating: request.body.rating,
        reviews: request.body.reviews,
        author: authorName,
        date: dateToday
    });

    // Call update() function in repository with the object.
    let responseObject = await _movieRepo.create(tempMovieObj);
    // Update was successful. Show detail page with updated object.
    if(responseObject.errorMessage == "") {
        response.render('Movie/Reviews', { movie:responseObject.obj,
                                            errorMessage:"", reqInfo:reqInfo });
    }

    // Update not successful. Show edit form again.
    else {
        response.render('Movie/WriteReview', { 
            movie:      responseObject.obj, 
            errorMessage: responseObject.errorMessage,
            reqInfo: reqInfo });
        }
}

exports.EditReview = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let movieID  = request.query._id;
    console.log(movieID);
    let reviewObj = await _movieRepo.getMovie(movieID); 
    let movie = {}
    movie._id = reviewObj._id;  
    if(reqInfo.authenticated) {
        response.render('Movie/EditReview', {movie:movie, errorMessage:"", reqInfo:reqInfo})
    }
    else {
        response.redirect('/User/Login?errorMessage=You ' + 
                     'must be logged in to edit your reviews.')
    }
}

exports.UpdateReview = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let userName = reqInfo.username;
    let movieID = request.body._id;
    let movieObj = await _movieRepo.getMovie(movieID);
    let movieName = movieObj.movieName;
    let author = movieObj.author;
    let date = movieObj.date;

    // Parcel up data in a 'Movie' object.
    let tempMovieObj  = new Movie( {
        _id: movieID,
        movieName: movieName,
        rating: request.body.rating,
        reviews: request.body.reviews,
        author: author,
        date: date
    });
    

    let indexNumber = author.indexOf(userName);

    // Call update() function in repository with the object.

    let responseObject = await _movieRepo.update(tempMovieObj, indexNumber);

    // Update was successful. Show detail page with updated object.
    if(responseObject.errorMessage == "") {
        response.render('Movie/MyReviews', { movies:responseObject.obj, 
                                            errorMessage:"", reqInfo:reqInfo });
    }

    // Update not successful. Show edit form again.
    else {
        console.log('An error occurred. Item not updated.')
        response.render('Movie/EditReview', { 
            movie:      responseObject.obj, 
            errorMessage: responseObject.errorMessage,
            reqInfo: reqInfo });
    }
}

exports.Delete = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let userName = reqInfo.username;
    let id = request.body._id;
    let movieObj = await _movieRepo.getMovie(id);
    let index = movieObj.author.indexOf(userName); // gets index of value to be deleted
    let deletedItem  = await _movieRepo.delete(movieObj, index);

    let movies  = await _movieRepo.allMovies();
    response.render('Movie/MyReviews', {movies:movies, reqInfo: reqInfo});
}