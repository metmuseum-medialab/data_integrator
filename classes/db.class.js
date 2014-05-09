/*
db manager
// handles saving, retrieving from db (in this case Couch for starters)
This code might get refactored to live somewhere else, I'm just putting it here for now.

*/

function DbManager(){


	var db = {

		db: null,

		serviceRunning : true,
		connected : false,

		dontSave : [],

		defaults : {
			ident : "CouchModel",
		},

		idAttribute : "_id",

		thiscodeonclient : false,


		connect : function (){

			if(typeof IAMONTHECLIENT !== 'undefined' && IAMONTHECLIENT != false){
				this.thiscodeonclient = true;
				console.log("I'm on the client");
			}else{
				console.log("I'm on the server");
				if(!this.connected){
					var nano = require('nano')('http://localhost:5984');
					var db_name = "integrator";
					this.db = nano.use(db_name);

					this.connected = true;
					console.log("got conntected");
				}
			}

		},


		saveThingType : function(thingType, callback){
			// check if server or client side here. if client side, route through server


			console.log(thingType);
			var doc = {};
			doc._id = "thingType/" + thingType.getUniqueId();
			if(typeof thingType._rev !== "undefined"){
				doc._rev = thingType._rev;
			}

			doc.allowedWidgetTypes = thingType.allowedWidgetTypes;

			this.insertDoc(doc, callback);
		},

		loadThingType : function(thingTypeId, callback){
			
			var id = "thingType/"+ thingTypeId;
			console.log("calling load with id " + id);

			this.loadDoc(id, callback);

			
			return false;
		},


		loadDoc : function(id, callback){
			this.connect();
			console.log("calling loadDoc, id" + id);
			if(this.thiscodeonclient){
				var url = "./"+id;
				console.log("this code on client, calling " + url);
				$.ajax({
					url : url,
					type : "GET",
					contentType : 'application/json',
			  		success : function(rdata, status){
			  			console.log("success");
			  			console.log(rdata);
			  			callback(rdata);
			  		},
			  		error : function(jqXHR, status, message){
			  			console.log("error ");
			  			console.log(status);
			  			console.log(message);
			  			callback(message);
			  		}
				});
				return;
			}

			this.db.get(id, {}, function(err, body){
				if(err){
					callback(err);
					return;
				}
				callback(body);
			});

		},

		insertDoc : function(doc, callback2){
			this.connect();

			console.log("calling ajax");
			console.log(doc);
			if(this.thiscodeonclient){
				console.log("this code on client, calling ./" + doc._id);
				$.ajax({
					url : "./"+ doc._id ,
					type : "PUT",
					data : JSON.stringify(doc),
				//	processData : false,
					contentType : 'application/json',
			  		success : function(rdata, status){
			  			console.log("success");
			  			console.log(rdata);
			  			callback2(rdata);
			  		},

			  		error : function(jqXHR, status, message){
			  			console.log("error ");
			  			console.log(status);
			  			console.log(message);
			  			callback2(message);
			  		}
				});		


				return;
			}



			this.db.insert(doc,
				function (error,http_body,http_headers) {
					if(error) {
					  console.log(error);
					  callback2(error);
					  return error;
					}
					console.log(http_body);
					callback2(http_body);
	    		}
    		);

		}

	}

	return db;

}

module.exports.DbManager = DbManager;