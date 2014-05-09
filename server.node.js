/*
server for data-integrator
*/


var Percolator = require('percolator').Percolator;

var IAMONTHECLIENT = false;

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

      if(req.url.match(/\.(html|js|jpg|jpeg|gif|png|css|ico|ttf|svg|woff)(\?.*)?$/i)){
        if(!query.action){
          console.log("getting file " + parsed.pathname);
          // this is doing it client-side
          sendFile(parsed.pathname, query, res);
          return;
        }
      }
      if(req.url.match(/^\/widgetlist$/)){
        console.log("getting widgetlist");
        var widgetManager = require("./classes/widget.class.js").WidgetManager();
        var filelist = widgetManager.getWidgetList(function(list){
          var contentType = "application/json";
          res.writeHead(200, {'Content-Type': contentType});
          res.end(JSON.stringify(list));
        });
        return;
      }


      // this is doign it server-side

      var EntityManager = require("./classes/entityManager.class.js").EntityManager();
      var entity = EntityManager.getEntity(req.url, function(entity){
        console.log("got entity");
        console.log(entity);
        var contentType = "application/json";
        res.writeHead(200, {'Content-Type': contentType});
        res.end(JSON.stringify(entity));

      });


//      res.object({message : 'Hello World!'}).send();

    },
    PUT : function(req, res){
    	// creating a NEW resource, or updating it.
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@ PUT REQUEST");
      console.log(req.url) ;
      console.log(req.headers) ;
      var contentType = "application/json";
      req.onJson(function(err, obj){
        if(err){
          console.log("PUT error in json "+ err);
          res.writeHead(200, {'Content-Type': contentType});
          res.end(JSON.stringify({message : "insert ERROR"}));
          return;
        }
        console.log("json");
        console.log(obj);
        // do something with json data
        var db = require("./classes/db.class.js").DbManager();
        db.insertDoc(obj, function(result){
          res.writeHead(200, {'Content-Type': contentType});
          res.end(JSON.stringify(result));
         
        });

      });
     
    },
  },
  '/widgetlist',  {
    GET : function(req, res){
      console.log("getting widgetlist");
      var widgetManager = require("classes/widget.class.js");
      var filelist = widgetManager.getWidgetList(function(list){
        var contentType = "application/json";
        res.writeHead(200, {'Content-Type': contentType});
        res.end(JSON.stringify(list));
      });
    }
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



