const User           = require('../Models/User');
var   passport       = require('passport');
const RequestService = require('../Services/RequestService');
const UserRepo   = require('../Data/UserRepo');
const _userRepo  = new UserRepo();


// Displays registration form.
exports.Register = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    res.render('User/Register', {errorMessage:"", user:{}, reqInfo:reqInfo})
};

// Handles 'POST' with registration form submission.
exports.RegisterUser  = async function(req, res){
   
    var password        = req.body.password;
    var passwordConfirm = req.body.passwordConfirm;

    if (password == passwordConfirm) {

        // Creates user object with mongoose model.
        // Note that the password is not present.
        var newUser = new User({
            firstName:    req.body.firstName,
            lastName:     req.body.lastName,
            email:        req.body.email,
            username:     req.body.username,
        });
       
        // Uses passport to register the user.
        // Pass in user object without password
        // and password as next parameter.
        User.register(new User(newUser), req.body.password, 
                function(err, account) {
                    // Show registration form with errors if fail.
                    if (err) {
                        let reqInfo = RequestService.reqHelper(req);
                        return res.render('User/Register', 
                        { user : newUser, errorMessage: err, 
                          reqInfo:reqInfo });
                    }
                    // User registered so authenticate and redirect to Home  
                    // page.
                    passport.authenticate('local') (req, res, 
                            function () { res.redirect('/'); });
                });

    }
    else {
      res.render('User/Register', { user:newUser, 
              errorMessage: "Passwords do not match.", 
              reqInfo:reqInfo})
    }
};

// Shows login form.
exports.Login = async function(req, res) {
    let reqInfo      = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage; 

    res.render('User/Login', { user:{}, errorMessage:errorMessage, 
                               reqInfo:reqInfo});
}

// Receives login information & redirects 
// depending on pass or fail.
exports.LoginUser = (req, res, next) => {

  passport.authenticate('local', {
      successRedirect : '/', 
      failureRedirect : '/User/Login?errorMessage=Invalid login.', 
  }) (req, res, next);
};

// Log user out and direct them to the login screen.
exports.Logout = (req, res) => {
    req.logout();
    let reqInfo = RequestService.reqHelper(req);

    res.render('User/Login', { user:{}, isLoggedIn:false, errorMessage : "", 
                               reqInfo:reqInfo});
};

exports.Profile = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let userObj = req.user;
    if (reqInfo.authenticated) {
        res.render('User/Profile', { user:userObj, reqInfo:reqInfo, errorMessage:"" });
    }
    else {
        res.redirect('/User/Login?errorMessage=You ' + 
                     'must be logged in to view your profile.')
    }
};

// Displays 'edit' form and is accessed with get request.
exports.EditProfile = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let userUsername  = request.query.username;
    let userObj = await _userRepo.getUserByUsername(userUsername);
    response.render('User/EditProfile', {user:userObj, reqInfo:reqInfo, errorMessage:""});
}

// Receives posted data that is used to update the item.
exports.UpdateProfile = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let user = await _userRepo.getUserByUsername(reqInfo.username)
    let userUsername = user.obj.username

    console.log("The user name is: " + userUsername);

    // Parcel up data in a 'User' object.
    let tempUserObj  = new User( {
        username: userUsername,
        firstName:    request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
    });

    // Call update() function in repository with the object.
    let responseObject = await _userRepo.update(tempUserObj);

    // Update was successful. Show detail page with updated object.
    if(responseObject.errorMessage == "") {
        response.render('User/Profile', { user:responseObject.obj, 
                                            errorMessage:"", reqInfo:reqInfo });
    }

    // Update not successful. Show edit form again.
    else {
        console.log('An error occurred. Item not updated.')
        response.render('User/Profile', { 
            user:      responseObject.obj, 
            errorMessage: responseObject.errorMessage,
            reqInfo: reqInfo });
    }
}