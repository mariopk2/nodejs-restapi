//define the hendlers

//dependencies
var _data = require('./data');
var helpers = require('./helpers');

var handlers = {};

//users
handlers.users = function(data, callback){
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data, callback);
    }else{
        callback(405);
    }
};

//container for the users submethods
handlers._users = {};

//users - post
//requred data: firstName, lastName, phone, password, tosAgreement
//optional data: none
handlers._users.post = function(data, callback){
    //check that all reqired fields are filled out
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().lenght > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().lenght > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().lenght > 1 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().lenght > 0 ? data.payload.password.trim() : false;
    console.log(data);
    if(firstName){
        //make sure that the user doent exist
        _data.read('users', phone, function(err, data){
            if(err){
                //hash the password
                var hashedPassword = helpers.hash(password);
                if(hashedPassword){
                    //create the user object
                    var userObject = {
                        'firstName' : firstName,
                        'lastName' : lastName,
                        'phone' : phone,
                        'hashedPassword' : hashedPassword,
                        'tosAgreement' : true
                    };

                    //store the user
                    _data.create('users', phone, userObject, function(err){
                        if(!err){
                            callback(200);
                        }else{
                            console.log(err);
                            callback(500, {'Error' : 'Could not create the new user!'});
                        }
                    });
                }else{
                    callback(500, {'Error' : 'Could not to hash password!'});
                }
                

            }else{
                //users already exist
                callback(400, {'Error' : 'A user with that phone number already exist!'});
            }
        });
    }else{
        callback(400, {'Error' : 'Missing required fields!'});
    }
};

//users - get
handlers._users.get = function(data, callback){

};

//users - put
handlers._users.put = function(data, callback){

};

//users - delete
handlers._users.delete = function(data, callback){

};

//Ping handler
handlers.ping = function(data, callback){
    callback(200);
};

//Not found handlers
handlers.notFound = function(data, callback){
    callback(404);
};

//export module
module.exports = handlers;