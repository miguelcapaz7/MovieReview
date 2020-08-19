const MovieRepo   = require('../Data/MovieRepo');
const _movieRepo  = new MovieRepo();
const RequestService = require('../Services/RequestService');

exports.Index = async function(req, res) {
    let movies = await _movieRepo.allMovies();

    if(movies!= null) {
        let reqInfo = RequestService.reqHelper(req);
        res.render('Home/Index', { movies:movies, reqInfo:reqInfo, errorMessage:""
        })
    }
    else {
        response.render('Home/Index', { movies:[] })
    }
};
    