//dependencies
var fs = require('fs');
var path = require('path');

//container for the module (to be exported)
var lib = {};

//Base direcotory of data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// write data to a file
lib.create = function(dir, file, data, callback){
    //open the file for writing
    fs.open(lib.baseDir+dir+"/"+file+".json", 'wx', function(err, fileDescriptor){
        if(!err && fileDescriptor){
            //convert data to string
            var stringData = JSON.stringify(data);

            //Write to file and close it
            fs.writeFile(fileDescriptor, stringData, function(err){
                if(!err){
                    fs.close(fileDescriptor, function(err){
                        if(!err){
                            callback(false);
                        }else{
                            callback("Error closing new file");
                        }
                    }) 
                }else{
                    callback("Error writing to new file!");
                }
            });
        }else{
            callback('Could not create new file, it may already exist!');
        }
    });
};

//read data from file
lib.read = function(dir, file, callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf8', function(err, data){
        callback(err, data);
    });
};

//update data inside a file
lib.update = function(dir, file, data, callback){
    //open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', function(err, fileDescriptor){
        if(!err && fileDescriptor){
            var stringData = JSON.stringify(data);

            //truncate the file
            fs.ftruncate(fileDescriptor, function(err){
                if(!err){
                    //Write write to the file and close
                    fs.writeFile(fileDescriptor, stringData, function(err){
                        if(!err){
                            fs.close(fileDescriptor, function(err){
                                if(!err){
                                    callback(false);
                                }else{
                                    callback('Error closing existing file!');
                                }
                            });
                        }else{
                            callback('error writing the existing file!');
                        }
                    });
                }else{
                    callback('Error truncation file!');
                }
            });
        }else{
            callback('Could not open the file for updating, it may not exist yet!');
        }
    });
};

//Delete a file
lib.delete = function(dir, file, callback){
    //unlink
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
        if(!err){
            callback(false);
        }else{
            callback('Error deleting file!');
        }
    });
};


//Export the module
module.exports = lib;