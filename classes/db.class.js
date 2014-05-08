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
					var db_name = "test";
					this.db = nano.use(db_name);

					this.connected = true;
				}
			}

		},


		saveThingType : function(thingType){
			// check if server or client side here. if client side, route through server



			var doc = {};
			doc._id = "thingType/" + thingType.getUniqueId();
			doc.test = "12345";

			this.insertDoc(doc);
		},

		loadThingType : function(thingTypeId){
			var doc = this.db.load(thingTypeId);
		},


		insertDoc : function(doc){
			this.connect();

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
			  		}
				});		


				return;
			}



			this.db.insert(doc,
				function (error,http_body,http_headers) {
					if(error) {
					  console.log(error);
					  return error;
					}
					console.log(http_body);
	    		}
    		);

		}

	}

	return db;

}

module.exports.DbManager = DbManager;