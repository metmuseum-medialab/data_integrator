/*
run an entity server side. The output may vary, depending on arguments, but probably is either nothing, error message, or entity data
- mostly the point is to run all the widgets, update their data, etc.
- and this is an important component of a crawler.
*/




console.log("starting");
var argv = require('minimist')(process.argv.slice(2));
var entityIdTemplate = argv._[0]; // format url/{{id}}
var startid = argv._[1];  
var endid = argv._[2];
console.log(argv);
console.log(entityIdTemplate);
console.log("ID start: " + startid);
console.log("ID End: " +endid);

// requireses
var urlparser = require("url");
var pathparser = require("path");




// set up globals
GLOBAL = {};
GLOBAL.context = "server";
GLOBAL.params = {
  root_dir : __dirname,
  require_prefix : __dirname

};



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
    var currentid = startid;
    crawl_entities(entityIdTemplate, currentid, endid);
  } 
});





function crawl_entities(entityIdTemplate, currentid, endid){
  var EntityManager = require(GLOBAL.params.root_dir+"/classes/entity/entity.js").EntityManager();

  if(currentid > endid){
    return;
  }

  var entityId = entityIdTemplate.replace(/\{\{id\}\}/, currentid);

  function callback(entity){
    entity.addListener("allWidgetsRan", function(params){
      console.log("this thing is all done!");
      console.log(params.thing);
      console.log(params.thing.widgetInstances);
      console.log("done now?");
      currentid++;
      console.log("calling with " + currentid);
      crawl_entities(entityIdTemplate, currentid, endid);
    });
    return;
  }

  EntityManager.generateEntity(entityId, callback);
  return;

}





console.log("done");