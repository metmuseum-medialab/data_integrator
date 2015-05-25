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
			}else{
				if(!this.connected){
					var nano = require('nano')('http://localhost:5984');
					var db_name = "integrator";
					this.db = nano.use(db_name);

					this.connected = true;
				}
			}

		},


		saveThingType : function(thingType, callback){
			// check if server or client side here. if client side, route through server
			var doc = {};
			doc._id = "thingType/" + thingType.getUniqueId();
			if(typeof thingType._rev !== "undefined"){
				doc._rev = thingType._rev;
			}

			doc.allowedWidgetTypes = thingType.allowedWidgetTypes;

			doc.defaultWidgets = [];
			GLOBAL.$.each(thingType.defaultWidgets, function (index, defaultWidget){
				var widgetDoc = {uniqueName : defaultWidget.uniqueName,
								config : defaultWidget.config,
								widgetTypeName : defaultWidget.widgetType.typeName};
				doc.defaultWidgets.push(widgetDoc);	
			});

			this.insertDoc(doc, function(rdata){
				thingType._rev = rdata.rev;
				callback(rdata);
			});
		},


		saveThing : function(thing, callback){
			var doc = {};
			doc._id = "thing/"+thing.id;
			if(typeof thing._rev !== "undefined"){
				doc._rev = thing._rev;
			}
			doc.widgetInstances = [];
			GLOBAL.$.each(thing.widgetInstances, function (index, widgetInstance){
				var widgetInstanceDoc = {
					data: widgetInstance.data,
					widgetTypeName : widgetInstance.widget.widgetType.typeName,
					uniqueName : widgetInstance.widget.uniqueName
				};
				doc.widgetInstances.push(widgetInstanceDoc);
			});
			this.insertDoc(doc, function(rdata){
				console.log("updating rev from " + thing._rev + " to " + rdata.rev);
				console.log(rdata);
				thing._rev = rdata.rev;
				callback(rdata);
			});
		},

		loadThingType : function(thingTypeId, callback, notFoundCallback){
			
			var id = "thingType/"+ thingTypeId;
			this.loadDoc(id, callback, notFoundCallback);
			return false;
		},


		loadThing : function(thingId, callback, notFoundCallback){
			var id = "thing/" + thingId;
			this.loadDoc(id, callback, notFoundCallback);
			return false;
		},

		loadDoc : function(id, callback, notFoundCallback){
			this.connect();
			if(this.thiscodeonclient){
				var url = "./couchdb/"+id;
				GLOBAL.$.ajax({
					url : url,
					type : "GET",
					contentType : 'application/json',
			  		success : function(rdata, status){

			  			callback(rdata);
			  		},
			  		error : function(jqXHR, status, message){
			  			console.log("error !!!!  ");
			  			console.log(status);
			  			console.log(message);
			  			if(message.message == "missing"){
			  				notFoundCallback(message);
			  			}else{
				  			callback(message);
				  		}
			  		},
			  		complete : function (jqXHR, textStatus){
			  			console.log("complete " + url);
			  			console.log(textStatus);
			  		}
				});
				return;
			}

			this.db.get(id, {}, function(err, body){
				if(err){
					console.log("db error!!!");
					err.notfound = true;
					callback(err);
					return;
				}
				callback(body);
			});

		},

		insertDoc : function(doc, callback2, errorCallback){
			this.connect();

console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");

			if(this.thiscodeonclient){
				GLOBAL.$.ajax({
					url : "./"+ doc._id ,
					type : "PUT",
					data : JSON.stringify(doc),
				//	processData : false,
					contentType : 'application/json',
			  		success : function(rdata, status){
			  			callback2(rdata);
			  		},

			  		error : function(jqXHR, status, message){
			  			console.log("error ");
			  			console.log(status);
			  			console.log(message);
			  			if(errorCallback){
			  				errorCallback(message);
			  			}else{
				  			callback2(message);
			  			}
			  		}
				});		


				return;
			}



			this.db.insert(doc,
				function (error,http_body,http_headers) {
					if(error) {
						console.log("error message in insert");
						console.log(doc._id);
						console.log(doc._rev);
					  console.log(error);
					  if(errorCallback){
					  	errorCallback(error);
					  }else{
						  callback2(error);
					  }
					  return error;
					}
					console.log("iiiinserted");
					console.log(http_body);
					callback2(http_body);
	    		}
    		);

		}

	}

	return db;

}

module.exports.DbManager = DbManager;