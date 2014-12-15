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
var async = require("async");



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
    crawl_entities(startid, endid);
  } 
});


var EntityManager = require(GLOBAL.params.root_dir+"/classes/entity/entity.js").EntityManager();


function crawl_entities(startid, endid){
  console.log("in crawl_entities " + startid + " to " + endid);
  var currentid = startid;

  async.whilst(
    function(){return currentid <= endid},
    function(callback){
      var entityId = entityIdTemplate.replace(/\{\{id\}\}/, currentid);

      console.log("calling " + entityId);

      function callback2(entity){
        entity.addListener("allWidgetsRan", function(params){
          console.log("got entity");
          console.log(params.thing);
          console.log(params.thing.widgetInstances);
          console.log("done now?");
        });
      }
      console.log("calling with " + currentid);
      try{
        EntityManager.generateEntity(entityId, callback2);
      }catch(exception){
        console.log("got error ");
        console.log(exception);
      }
      currentid++;
      callback();
    },
    function(err){
      if(err){
        console.log("error");
        console.log(err);
      }
    }
  );

}





console.log("done with crawler");