/*
run an entity server side. The output may vary, depending on arguments, but probably is either nothing, error message, or entity data
- mostly the point is to run all the widgets, update their data, etc.
- and this is an important component of a crawler.
*/




console.log("starting");
var argv = require('minimist')(process.argv.slice(2));
var entityId = argv._[0];
console.log(argv);
console.log(entityId);

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
    console.log("running entitye " + entityId);
    $ = window.jQuery;
    GLOBAL.$ = $;
    run_entity(entityId);
  } 
});


function run_entity(entityId){
  var EntityManager = require(GLOBAL.params.root_dir+"/classes/entity/entity.js").EntityManager();

  function callback(entity){
    console.log("in final callback");
    console.log(entity);
    console.log("done showing entity");
    entity.addListener("allWidgetsRan", function(params){
      console.log("this thing is all done!");
      console.log(params);
      console.log("done now?");
    });
    return;
  }

  EntityManager.generateEntity(entityId, callback);
  return;

}





console.log("done");