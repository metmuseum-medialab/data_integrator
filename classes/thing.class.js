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

		addDefaultWidget : function(widget){

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

		getDefaultWidget : function(widgetUniqueName){
			var index = this.defaultWidgetNames.indexOf(widgetUniqueName);
			if(index >= 0){
				return this.defaultWidgets[index];
			}
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
			if(!this.listeners[listenerName]){
				this.listeners[listenerName] = [];
			}
			this.listeners[listenerName].push(callback);
		},

		fireEvent : function(listenerName, params){
			console.log(this.listeners);
			if(this.listeners[listenerName]){
				$.each(this.listeners[listenerName], function(index, callback){
					callback(params);
				});
			}
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


		getWidgetManager : function(){
			var WidgetManager = false;

			if(typeof IAMONTHECLIENT === 'undefined'  || IAMONTHECLIENT == false){
				WidgetManager = require("./widget.class.js").WidgetManager();
			}else{
				WidgetManager = require("./classes/widget.class.js").WidgetManager();
			}
			return WidgetManager;
		},

		getDbManager : function(){
			var db; 
			if(typeof IAMONTHECLIENT === 'undefined'  || IAMONTHECLIENT == false){
				db = require("./db.class.js").DbManager();
			}else{
				db = require("./classes/db.class.js").DbManager();
			}
			return db;
		},

		createThingType : function(typeName){
			// either load existing, or create new
			var thingType = new ThingType();
			thingType.typeName = typeName;
			thingType.manager = this;
			return thingType;
		},

		generateThingType : function(typeName, callback){

			var db = this.getDbManager();
			var WidgetManager = this.getWidgetManager();

			var thingType = this.createThingType(typeName);
			thingType.db= db;

			db.loadThingType(typeName, function(doc){
				console.log("doc");
				console.log(doc);
				if(doc){
					thingType._rev = doc._rev;
					thingType.allowedWidgetTypes = doc.allowedWidgetTypes;

					// iterate through the defaultwidgetname, deserialize
					if(doc.defaultWidgets instanceof Array){
						$.each(doc.defaultWidgets, function(index, widgetDoc){
							var widgetTypeName = widgetDoc.widgetTypeName;
							var uniqueName = widgetDoc.uniqueName;
							var defaultWidget = WidgetManager.createWidget(widgetTypeName, uniqueName);
							WidgetManager.attachWidgetData(defaultWidget, widgetDoc);
							thingType.addDefaultWidget(defaultWidget);
						});
					}
				}
				callback(thingType);	
			},
			function(notFoundDoc){
				thingType.new = true;
				callback(thingType);
			});
		}, // returns ThingType 

		saveThingType : function(thingType, callback){
			var db = this.getDbManager();
			db.saveThingType(thingType, callback);
		},
		renderThingType : function(thingType, format){},
		initializeThingType : function(thing){},


		createThing : function(){
			// either load existing, or create new

			var thing = new Thing();
			thing.manager = this;
			return thing;
		},



		generateThing : function(typeName, id, callback){
			// either get existing, or create new if no id, or id doesn't exist
			console.log("getting thing " + typeName + " " + id);
			var db = this.getDbManager();
			var WidgetManager = this.getWidgetManager();
			var thisManager = this;

			var thing = this.createThing();
			thing.id = id;
			this.generateThingType(typeName, function(thingType){
				thing.type = thingType;
				thing.db = db;

				db.loadThing(id, function(doc){

					if(!doc){
						console.log("no doc in db");
					}else{
						//load doc into thing, create widgets, etc.

					}
					thing.data = doc.data;
					this._rev = doc._rev;
					// iterate through the defaultwidgetname, deserialize
					if(doc.widgetInstances instanceof Array){
						$.each(doc.widgetInstances, function(index, widgetInstanceDoc){
							var widgetTypeName = widgetInstanceDoc.widgetTypeName;
							var uniqueName = widgetInstanceDoc.uniqueName;

							var defaultWidget = thing.type.getDefaultWidget(uniqueName);

							var widgetInstance = WidgetManager.createWidgetInstance(thing, defaultWidget);
							WidgetManager.attachWidgetInstanceData(widgetInstance, widgetInstanceDoc.data);
							thing.addWidgetInstance(widgetInstance);

						});
					}

					// add widget instances for thing, based on thingType.
					thisManager.resolveThingWidgets(thing, callback);

				},
				function(notFoundDoc){
					thisManager.resolveThingWidgets(thing, callback);
				});
			});
		},


		resolveThingWidgets : function(thing, callback){
			// go through the default widgets, add them to this thing as instances if it doesn't already have them.
			var WidgetManager = this.getWidgetManager();
			var db = this.getDbManager();

			$.each(thing.type.defaultWidgets, function(index, defaultWidget){
				console.log(defaultWidget);
				var widgetInstance = false;
				var index = thing.widgetInstanceNames.indexOf(defaultWidget.uniqueName);
				if(index >= 0){
					widgetInstance = thing.widgetInstances[index];
					// all good, the instance is already there
				}else{
					// create the widget instance and add it.
					widgetInstance = WidgetManager.createWidgetInstance(thing, defaultWidget);
					thing.addWidgetInstance(widgetInstance);
					console.log("adding WidgetInstance " + widgetInstance.widget.uniqueName);
				}
				widgetInstance.widget.widgetType.onLoad(widgetInstance);
			});

			$.each(thing.widgetInstances, function(index, widgetInstance){
				widgetInstance.widget.widgetType.allLoaded(widgetInstance);

			});

			db.saveThing(thing, function(rdata){
				console.log("thing saved");
				console.log(rdata);
			});


			callback(thing);
		},

		createNewThing : function(type){}, // returns thing
		loadThing : function(type, id){

		}, // returns thing
		saveThing : function(thing){
		}, 
		renderThing : function(thing, format){}, // returns string, or dom, or JSON, or ...
		initializeThing : function(thing){},

		attachWidgetAsDefaultToThingType :  function(thingType, widgetType, config){},
		runThingWidgets : function(thing){},

	}

	return Manager;
}

module.exports.ThingManager = ThingManager;
