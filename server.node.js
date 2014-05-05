/*
server for data-integrator
*/


var Percolator = require('percolator').Percolator;

var urlparser = require("url");
var pathparser = require("path");
var fs = require("fs");

var jsdom = require("jsdom"); 
$ = require("jquery")(jsdom.jsdom().createWindow()); 

var secrets = require("./secrets.js").secrets();

var db_name = secrets.db_name;
var nano = require('nano')('http://localhost:5984');
var db = nano.use(db_name);


var server = new Percolator();

var PageManager = require("./classes/page.class.js").PageManager();

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

server.route(
  '*', {  
    GET : function(req, res){
  		// get from db and return
      var parsed = urlparser.parse(req.url, true)
      var query = parsed.query;


      // CLIENT OR server-sidE GENERATION? DECIDE HERE. HOW?

      console.log("@@@@@@@@@@@@@@@@@@@@@@@@ REQUEST");
      console.log(req.url) ;
      console.log(req.headers) ;

      if(req.url.match(/\.(html|js|jpg|jpeg|gif|png|css|ico)(\?.*)?$/i)){
        if(!query.action){
          // this is doing it client-side
          sendFile(parsed.pathname, query, res);
          return;
        }
      }


      // this is doign it server-side
  		console.log("get");
      var page = PageManager.createPage(req,res);

      PageManager.populatePage(page);

      console.log("got page");
      PageManager.renderPage(page);

//      res.object({message : 'Hello World!'}).send();

    },
    PUT : function(req, res){
    	// creating a NEW resource, or updating it.
    },
  },
  'children/*', {  
    GET : function(req, res){
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

var dataCache = {};
function sendFile(path, query, res){

  if(path == "/"){
    path = "/index.html";
  }

  var extname = pathparser.extname(path);
  var contentType = 'text/html';
  if(path.match(/secrets\.js/)){
        res.writeHead(404, {'Content-Type': contentType});
        //indexhtml = data;
        res.end("I'm afraid I can't do that.");
        return;
  }

  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.jpg':
      contentType = 'image/jpeg';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.ico':
      contentType = 'image/vnd.microsoft.icon';
      break;
  }

  if(!dataCache[path]){
    fs.readFile("."+path, function(err, data){
      if(err){
        console.log("file read error");
        console.log(err);
        res.writeHead(404, {'Content-Type': contentType});
        //indexhtml = data;
        res.end(data);
      }else{
        res.writeHead(200, {'Content-Type': contentType});
        console.log("writing file " + path);
     //   console.log(data);
        //dataCache[path] = data;
        res.end(data);
      }
    });
  }else{
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(dataCache[path]);
  }
}



