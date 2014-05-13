function ThingManager(){

	function ThingType(){};


	ThingType.prototype = {

		category : "ThingType",
		typeName : "",
		allowedWidgetTypes : [], // array of widgetType names (string[])
		defaultWidgets : [], // array of {widgetType, Config }
		defaultWidgetNames : [],

		listeners : {},


		getUniqueId : function(){
			return this.typeName;
		},

		addListener : function(listenerName, callback){
			if(!this.listeners[listenerName]){
				this.listeners[listenerName] = [];
			}
			this.listeners[listenerName].push(callback);
		},

		fireEvent : function(listenerName, params){
			if(this.listeners[listenerName]){
				$.each(this.listeners[listenerName], function(index, callback){
					console.log("firing event with " + index);
					console.log(params);
					callback(params);
				});
			}
		},
		

		hasWidgetNamed : function(name){
			return (Array.indexOf(name) >= 0);
		},

		addDefaultWidget : function(widgetTypeName, widgetUniqueName){
			var WidgetManager = require("./classes/widget.class.js").WidgetManager();
			var widget = WidgetManager.getWidget(widgetTypeName, widgetUniqueName);

			widget.thingType = this;

			this.defaultWidgets.push(widget);
			this.defaultWidgetNames.push(widget.uniqueName);

			this.fireEvent("addDefaultWidget", {widget : widget, entity: this});
			return widget;
		},

		removeDefaultWidget : function(widgetUniqueName){
			var index = this.defaultWidgetNames.indexOf(widgetUniqueName);
			if(index >= 0){
				this.defaultWidgets.splice(index, 1);
				this.defaultWidgetNames.splice(index, 1);
			}
			this.fireEvent("removeDefaultWidget", {widgetUniqueName : widgetUniqueName, entity : this});
		},

		addAllowedWidgetType : function(widgetTypeName){
			this.allowedWidgetTypes.push(widgetTypeName);
			this.fireEvent("addAllowedWidgetType", {widgetTypeName : widgetTypeName, entity: this});
		},

		removeAllowedWidgetType : function(widgetTypeName){
			var index = this.allowedWidgetTypes.indexOf(widgetTypeName);
			if(index >= 0){
				this.allowedWidgetTypes.splice(index, 1);
			}
			this.fireEvent("removeAllowedWidgetType", {widgetTypeName : widgetTypeName, entity : this});
		}

	}


	function Thing(){};

	Thing.prototype = {


		category : "Thing",
		id : false,
		type: false,
		widgetInstances : [],
		widgetInstanceNames : [],

		listeners : {},

		addListener : function(listenerName, callback){
			if(!listeners[listenerName]){
				listeners[listenerName] = [];
			}
			listeners[listenerName].push(callback);
		},

		fireEvent : function(listenerName, params){
			$.each(listeners[listenerName], function(index, callback){
				callback(params);
			});
		},

		addWidgetInstance : function(widgetInstance){
			widgetInstance.thing = this;
			this.widgetInstances.push(widgetInstance);
			this.widgetInstanceNames.push(widgetInstance.widget.uniqueName);
			this.fireEvent("addWidgetInstance", {widgetInstance : widgetInstance, entity : this});	
		},

		removeWidgetInstance : function(widgetUniqueName){
			var index = widgetInstanceNames.indexOf(widgetUniqueName);
			if(index >= 0){
				this.widgetInstances.splice(index, 1);
				this.widgetInstanceNames.splice(index, 1);
			}
			this.fireEvent("removeWidgetInstance", {widgetUniqueName : widgetUniqueName, entity : this});	
		},

		runWidgets : function(){

		},

	};


	var Manager = {


		getThingType : function(typeName){
			// either load existing, or create new
			var thingType = new ThingType();
			thingType.typeName = typeName;
			return thingType;
		}, 
		createNewThingType : function(typeName){},
		loadThingType : function(typeName, callback){

			var db; 
			if(typeof IAMONTHECLIENT === 'undefined'  || IAMONTHECLIENT == false){
				db = require("./db.class.js").DbManager();
			}else{
				db = require("./classes/db.class.js").DbManager();
			}

			var thingType = this.getThingType(typeName);
			db.loadThingType(typeName, function(doc){
				if(doc){
					thingType._rev = doc._rev;
					thingType.allowedWidgetTypes = doc.allowedWidgetTypes;

					// iterate through the defaultwidgetname, deserialize
					if(doc.defaultWidgets instanceof Array){
						$.each(doc.defaultWidgets, function(index, widgetDoc){
							var widgetTypeName = widgetDoc.widgetTypeName;
							var uniqueName = widgetDoc.name;
							var defaultWidget = thingType.addDefaultWidget(widgetTypeName, uniqueName);
							defaultWidget.config = widgetDoc.config;
						});
					}
				}
				callback(thingType);	
			});
		}, // returns ThingType 
		saveThingType : function(thingType, callback){
			var db; 
			if(typeof IAMONTHECLIENT === 'undefined'  || IAMONTHECLIENT == false){
				db = require("./db.class.js").DbManager();
			}else{
				db = require("./classes/db.class.js").DbManager();
			}
			db.saveThingType(thingType, callback);
		},
		renderThingType : function(thingType, format){},
		initializeThingType : function(thing){},


		getThing : function(typeName, id){
			// either get existing, or create new if no id, or id doesn't exist
			var thingType = this.getThingType(typeName);
			var thing = new Thing();
			thing.type = thingType;
			thing.id = id;
			return thing;
		},
		createNewThing : function(type){}, // returns thing
		loadThing : function(type, id){}, // returns thing
		saveThing : function(thing){
		}, 
		renderThing : function(thing, format){}, // returns string, or dom, or JSON, or ...
		initializeThing : function(thing){},

		attachWidgetAsDefaultToThingType :  function(thingType, widgetType, config){},
		loadThingsWidgets : function(thing){},
		runThingsWidgets : function(thing){},

	}

	return Manager;
}

module.exports.ThingManager = ThingManager;
