//container for all the environments
var environments = {};

//Staging default environment
environments.staging = {
    'port' : 3000,
    'envName' : 'staging',
    'hashingSecret' : 'thisIsASecret'
};

// Production environment
environments.production = {
    'port' : 5000,
    'envName' : 'production',
    'hashingSecret' : 'thisIsASecret'
};

//Determine which environment was passed as a command-line
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.NODE_ENV.toLowerCase() : '';

//check that the current environment is one of the env
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//Export the module
module.exports = environmentToExport;
