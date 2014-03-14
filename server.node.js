/*
server for data-integrator
*/


var Percolator = require('percolator').Percolator;

var $ = require("jquery");
var secrets = require("./secrets.js").secrets();

var db_name = secrets.db_name;
var nano = require('nano')('http://localhost:5984');
var db = nano.use(db_name);


var server = new Percolator();

/*
URL examples:
object
type: objet
children: 123, 345, etc...

object/123
type: object
children: facedata, catdata, etc

object/123/facedata
type: object/facedata
children: face1, face2, etc

object/123/facedata/face1
type: object/facedata
children: issmiles, frownlevel, etc.

object/123/facedata/face1/issmiles
type: object/facedata/issmiles




*/

server.route('data/*', {  GET : function(req, res){
								// get from db and return
								console.log("data");
								console.log(req.uri.child());
								console.log(req.uri.path());
                              res.object({message : 'Hello World!'}).send();
                            },
                            PUT : function(req, res){
                            	// creating a NEW resource, or updating it.
                            },
                        },
			'children/*', {  GET : function(req, res){
								// get from db and return
								console.log("children");
								console.log(req.uri.child());
								console.log(req.uri.path());
                              res.object({message : 'Hello World!'}).send();
                            },
                            PUT : function(req, res){
                            	// creating a NEW resource, or updating it.
                            },
                        }

              );
server.listen(function(err){
  console.log('server is listening on port ', server.port);
});



