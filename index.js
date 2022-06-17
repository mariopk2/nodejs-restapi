//Dependencies
var http = require('http');
var url = require('url');
var config = require('./lib/config');
var _data = require('./lib/data');
var handlers = require('./lib/handlers');
var helpers = require('./lib/helpers');


//add new file
//_data.create('test','newFile', {'foo' : 'bar'}, function(err){
//    console.log('This was the error '+err);
//});

//read file
//_data.read('test','newFile', function(err, data){
 //   console.log('This was the error '+err+ ' and this was data ',data);
//});

//update file
//_data.update('test','newFile',{'abv' : 'cde'}, function(err){
//    console.log('This was the error '+err);
//});

//delete file
_data.delete('test','newFile', function(err){
    console.log('This was the error '+err);
});


//the server listen on port 3000
var server = http.createServer(function(req, res){
    
    //get the url and parse it
    var parsedURL = url.parse(req.url, true);

    //get the path
    var path = parsedURL.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'')
    
    //get the query string as object
    var queryStringObject = parsedURL.query;

    //get the HTTP Method
    var method = req.method.toLowerCase();

    //Get the headers as an object
    var headers = req.headers;

    //get the payload, 
    
    var buffer = '';
    req.on('data', function(data){
       
    });
    req.on('end', function(){
       
        //choose handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        //construct the data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer)
        };

        //Route the request to the handler specified in the router
        chosenHandler(data, function(statusCode,payload){
            //use the status code called by the handler
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            //use the payload called back by the handler, or default to empty object
            payload = typeof(payload) == 'object' ? payload : {};

            //convert the payload to string 
            var payloadString = JSON.stringify(payload);

            //return the resposnse
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log('Returning this response: ', statusCode, payloadString);
        });  

    });

    //send the response
    //res.end('Hello\n');
    //log the request path
       
});

server.listen(config.port, function(){
    console.log("The server listening on port "+config.port+" in "+config.envName+" mode");
});




//define a requyest router
var router = {
    'ping' : handlers.ping,
    'users' : handlers.users
};
