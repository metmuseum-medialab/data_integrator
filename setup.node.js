/*
creating db structure, other setup and configuration stuff


*/


var nano = require('nano')('http://localhost:5984');
var secrets = require("./secrets.js").secrets();

var db_name = secrets.db_name;
var db = nano.use(db_name);

console.log("db_name " + db_name);

var design = {};


// set up db:
db.get("_design/" + db_name, function(err, body){
  if(err){
    console.log("error getting design");
    console.log(err);
    db.insert(design,
      function (error,http_body,http_headers) {
        if(error) {
          if(error.message === 'no_db_file') {
            // create database and retry
            return nano.db.create(db_name, function () {
              console.log("created");
            });
          }
          else { return console.log(error); }
        }
      
        console.log(http_body);
    });    
  }else{
    console.log("got design, going to destroy " + body);
    db.destroy(body._id, body._rev, function(err2, body2){
      if(err){  
        console.log("error destroying design");
        console.log(err);
      }else{
        db.insert(design,
          function (error,http_body,http_headers) {
            if(error) {
              if(error.message === 'no_db_file') {
                // create database and retry
                return nano.db.create(db_name, function () {
                  console.log("created");
                });
              }
              else { return console.log(error); }
            }
          
            console.log(http_body);
        });      
      }
    });
  }
});

