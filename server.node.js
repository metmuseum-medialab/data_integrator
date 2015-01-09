/*
server for data-integrator
*/
//var GLOBAL = {};




var Percolator = require('percolator').Percolator;

var IAMONTHECLIENT = false;

var urlparser = require("url");
var pathparser = require("path");
var fs = require("fs");

//var jsdom = require("jsdom"); 
//$ = require("jquery");//(jsdom.jsdom().createWindow()); 



var jsdom = require('jsdom');
var $;

jsdom.env({  
  html: "<html><body></body></html>",
  scripts: [
    'http://code.jquery.com/jquery-1.5.min.js'
  ],
  done : function (err, window) {
    $ = window.jQuery;
    GLOBAL.$ = $;
    get_server_started();
  } 
});



var secrets = require("./secrets.js").secrets();

var db_name = secrets.db_name;
var nano = require('nano')('http://localhost:5984');
var db = nano.use(db_name);


var server = new Percolator();

console.log(process.env);

GLOBAL.context = "server";

GLOBAL.params = {
  foo : "var",
  root_dir : __dirname,
  require_prefix : __dirname
};


//var PageManager = require("./classes/page.class.js").PageManager();

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
var WidgetManager;
var widgetServerSideFunctions;

function get_server_started(){


// call the widgetMananger and find out if there are any server-side functions for widgets.
   WidgetManager = require("./classes/widget/widget.js").WidgetManager();

   widgetServerSideFunctions;

  WidgetManager.registerServerSideWidgetFunctions(function(list){
    widgetServerSideFunctions = list;
  });


  server.route(

    '*', {  
      GET : function(req, res){
    		// get from db and return
        var parsed = urlparser.parse(req.url, true)
        var query = parsed.query;


        // CLIENT OR server-sidE GENERATION? DECIDE HERE. HOW?

        console.log("@@@@@@@@@@@@@@@@@@@@@@@@ REQUEST");
        console.log(req.url) ;
   

        if(req.url.match(/^\/widgetlist$/)){
          var widgetManager = require("./classes/widget/widget.js").WidgetManager();
          var filelist = widgetManager.getWidgetList(function(list){
            var contentType = "application/json";
            res.writeHead(200, {'Content-Type': contentType});
            res.end(JSON.stringify(list));
          });
          return;
        }

        if(req.url.match(/^\/proxy\//)){
          var split = req.url.split("/");
          split.shift(); split.shift();
          var url = split.join("/");
          console.log("url is " + url);
          
          var proxy = require("./classes/proxy/proxy.js").ProxyManager();
          var result = proxy.callUrl(url, function(data){
            var contentType = "application/json";
            res.writeHead(200, {'Content-Type': contentType});
            res.end(JSON.stringify(data));
          });

          return;
        }

        // this is doign it server-side
        if(req.url.match(/^\/couchdb\//)){

          var couchid = req.url.replace(/^\/couchdb\//, "");
          var  db = require("./classes/db/db.js").DbManager();
          db.loadDoc(couchid, function(doc){
            var contentType = "application/json";
            res.writeHead(200, {'Content-Type': contentType});
            res.end(JSON.stringify(doc));
          });
          return;
        }
        if(req.url.match(/\.(json|html|js|jpg|jpeg|gif|png|css|ico|ttf|svg|woff)(\?.*)?$/i)){
          if(!query.action){
            // this is doing it client-side
            sendFile(parsed.pathname, query, res);
            return;
          }
        }

        $.each(widgetServerSideFunctions.GET, function(index, theFunction){
          console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
          console.log(req.url);
          if(req.url.match(theFunction.match)){
              theFunction.theFunction(req, res);
          }
        });

        return;

        var EntityManager = require(GLOBAL.params.root_dir+"/classes/entity/entity.js").EntityManager();

        var entity = EntityManager.generateEntity(req.url, function(entity){
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
        var contentType = "application/json";
        req.onJson(function(err, obj){
          if(err){
            console.log("PUT error in json "+ err);
            res.writeHead(200, {'Content-Type': contentType});
            res.end(JSON.stringify({message : "insert ERROR"}));
            return;
          }
          // do something with json data
          var db = require("./classes/db/db.js").DbManager();
          db.insertDoc(obj, function(result){
            res.writeHead(200, {'Content-Type': contentType});
            res.end(JSON.stringify(result));
           
          });

        });
       
      },
    },
    '/widgetlist',  {
      GET : function(req, res){
        var widgetManager = require("./classes/widget/widget.js");
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
}


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
    case ".json":
      contentType = "application/json";
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
        //dataCache[path] = data;
        res.end(data);
      }
    });
  }else{
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(dataCache[path]);
  }
}



