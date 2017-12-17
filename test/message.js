//During the test the env variable is set to test 
process.env.NODE_ENV = 'test'; 
 
var mongoose = require('mongoose');  
let Message = require('../model/Message');