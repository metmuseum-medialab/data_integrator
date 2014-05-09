
/* 
I think we need one place in teh code where entities have ids generated, and where ids can be turned back nto entities

from id:
- returned the realized entity, appropriately handling GET, PUT, etc

from entity
- generate id used to save that entity.

entities are anything that can be represented by a url:
- thingtype
- thing
- widgetType
- widget
- widgetInstance

this code is a factory that turns ids into the appropriate entity. 
*/
function EntityManager(){


	var EntityManager = {

		entityToID : function (entity){
			var id;
			/*
				this conde can be as ad-hoc as it needs to be, so long as we can correctly turn entities into ids.
				// improve it later.
			*/


			return id;
		},

		getEntity : function(id, callback){
			console.log("path : "+ id);
			if(id.match(/^\//)){
				id = id.substring(1);
			}
			var split = id.split("/");
			var entityType = split.shift();
			var entity = false;
			console.log("entityType " + entityType);
			if(entityType == "thingType"){
				console.log("got thingtype");
				thingTypeName = split.shift();
				console.log("thingType " + thingTypeName);
				var thingManager;
				if(typeof IAMONTHECLIENT === 'undefined'  || IAMONTHECLIENT == false){
					thingManager = require("./thing.class.js").ThingManager();
				}else{
					thingManager = require("./classes/thing.class.js").ThingManager();
				}
				thingManager.loadThingType(thingTypeName, callback);
				console.log("setting thingType to " + entity);
			}else if (entityType == "thing"){
				thingTypeName = split.shift();
				thingId = split.shift();
				thingManager.getThing(thingTypeName, thingId, callback);
			}else if (entityType == "widgetType"){

			}else if (entityType == "widget"){

			}
			// etc for widgettypes, widgets, widgetinstances
			
			return entityType;
		},

		LoadWidgetInstancesForThing : function(thing){
			thing.startedLoadingWidgetInstances = true;
			thing.allWidgetsLoaded = false;
			async.eachSeries(thing.data.WidgetInstanceIds, 
				function(widgetInstanceId, callback){
					var widgetInstance = IDToUnpopulatedEntity(widgetInstanceId);
					PopulateEntity(widgetInstance);
					thing.addWidgetInstance(widgetInstance);
					callback();
				},
				function(err){
					thing.startedLoadingWidgetInstances = false;
					thing.allWidgetsLoaded = true;
				}
			);
		},

		LoadDefaultWidgetsForThingType : function(thingType){
			thing.startedLoadingDefaultWidgetTypes = true;
			thing.allDefaultWidgetsLoaded = false;
			async.eachSeries(thing.data.DefaultWidgetIds, 
				function(defaultWidgetId, callback){
					var widget = IDToUnpopulatedEntity(defaultWidgetId);
					PopulateEntity(widget);
					thingType.addDefaultWidget(widget);
					callback();
				},
				function(err){
					thing.startedLoadingDefaultWidgetTypes = false;
					thing.allDefaultWidgetsLoaded = true;
				}
			);
		},




		PopulateEntity : function(entity){

			var dbdata = getFromDb(entity);

			switch (category) {
				case "ThingType" :
					var config = dbdata.config;
					entity.config = config;

					// load up default widgets, allowed widgets, etc
					LoadDefaultWidgetsForThingType(entity);
					break;
				case "Thing" :
					var data = dbdata.data;
					entity.data = data;
					// load up widgetInstances
					LoadWidgetInstancesForThing(entity);
					break;
				case "WidgetType" :
					// nothing to do, the obect just has code
					break;
				case "Widget" :
					var config = dbdata.config;
					entity.config = config;
					entity.uniqueName = dbdata.uniqueName;
					break;
				case "WidgetInstance" :
					var data = dbdata.data;
					break;

				default:
			}
			return entity;

		},


		ReqToEntity : function(req){
			// this code can be as convoluted as it needs to be,
			// so long as it turns as Request into an entity,
			// and passes along the appropriate REQ to be handled as needed.
			var entity;

			return entity;

		},

		loadEntity : function(req){

		}


	};

	return EntityManager;


}

module.exports.EntityManager = EntityManager;

