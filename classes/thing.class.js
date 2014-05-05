function ThingManager(){

	function ThingType(){};

	ThingType.prototype = {

		category : "ThingType",
		typeName : "",
		defaultWidgets : [], // array of {widgetType, Config }
		allowedWidgetTypes : [], // array of {wdigetType}
		defaultWidgetNames : [],

		listeners : {};

		addListener : function(listenerName, callback){
			if(!listeners[listenerName]){
				listeners[listenerName] = [];
			}
			listeners[listenerName].push(callback);
		}

		fireEvent : function(listenerName, params){
			$.each(listeners[listenerName], function(index, callback){
				callback(params);
			});
		}
		

		hasWidgetNamed : function(name){
			return (Array.indexOf(name) >= 0);
		},

		addDefaultWidget : function(widget){
			widget.thingType = this;
			defaultWidgets.push(widget);
			this.defaultWidgetNames.push(widget.uniqueName);

			this.fireEvent("addDefaultWidget", {widget : widget, entity: this});
		},

		removeDefaultWidget : function(name){
			var index = defaultWidgetNames.indexOf(name);
			if(index >= 0){
				this.defaultWidgets.splice(index, 1);
				this.defaultWidgetNames.splice(index, 1);
			}
			this.fireEvent("removeDefaultWidget", {name : name, entity : this});
		}

	}


	function Thing(){};

	Thing.prototype = {


		category : "Thing",
		id : false,
		type: false,
		widgetInstances : [],
		widgetInstanceNames : [],

		listeners : {};

		addListener : function(listenerName, callback){
			if(!listeners[listenerName]){
				listeners[listenerName] = [];
			}
			listeners[listenerName].push(callback);
		}

		fireEvent : function(listenerName, params){
			$.each(listeners[listenerName], function(index, callback){
				callback(params);
			});
		}

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
			console.log("in getThignType");
			var thingType = new ThingType();
			thingType.typeName = typeName;
			return thingType;
		}, 
		createNewThingType : function(typeName){},
		loadThingType : function(typeName){}, // returns ThingType 
		saveThingType : function(thingType){},
		renderThingType : function(thingType, format){},
		initializeThingType : function(thing){},


		getThing : function(typeName, id){
			// either get existing, or create new if no id, or id doesn't exist
			console.log("in getThing");
			var thingType = this.getThingType(typeName);
			var thing = new Thing();
			thing.type = thingType;
			thing.id = id;
			return thing;
		},
		createNewThing : function(type){}, // returns thing
		loadThing : function(type, id){}, // returns thing
		saveThing : function(thing){}, 
		renderThing : function(thing, format){}, // returns string, or dom, or JSON, or ...
		initializeThing : function(thing){},

		attachWidgetAsDefaultToThingType :  function(thingType, widgetType, config){},
		loadThingsWidgets : function(thing){},
		runThingsWidgets : function(thing){},

	}

	return Manager;
}

module.exports.ThingManager = ThingManager;
