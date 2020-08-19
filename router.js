var HomeController = require('./Controllers/HomeController');
var UserController = require('./Controllers/UserController');
var MovieController = require('./Controllers/MovieController');

// Routes
module.exports = function(app){  
    // Main Routes
    app.get('/',      HomeController.Index);

    app.get('/User/Register', UserController.Register);
    app.post('/User/RegisterUser', UserController.RegisterUser);
    app.get('/User/Login', UserController.Login);
    app.post('/User/LoginUser', UserController.LoginUser);
    app.get('/User/Logout', UserController.Logout);
    app.get('/Movie/MyReviews', MovieController.MyReviews);
    app.get('/Movie/WriteReview', MovieController.WriteReview);
    app.get('/Movie/Reviews', MovieController.Reviews);
    app.post('/Movie/Create', MovieController.Create);
    app.get('/User/Profile', UserController.Profile);
    app.get('/User/EditProfile', UserController.EditProfile);
    app.post('/User/UpdateProfile', UserController.UpdateProfile);
    app.post('/Movie/Delete', MovieController.Delete);
    app.get('/Movie/EditReview', MovieController.EditReview)
    app.post('/Movie/UpdateReview', MovieController.UpdateReview)
};
