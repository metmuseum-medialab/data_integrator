function ThingManager(){

	function ThingType(){};


	ThingType.prototype = {

		category : "ThingType",
		typeName : "",
		allowedWidgetTypes : {}, // array of widgetType names (string[])
		defaultWidgets : {}, // array of {widgetType, Config }
		numDefaultWidgets : 0,

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
					callback(params);
				});
			}
		},
		

		hasWidgetNamed : function(name){
			if(this.defaultWidgets[name]){
				return true;
			}
			return false;
		},

		addDefaultWidget : function(widget){

			widget.thingType = this;

			this.defaultWidgets[widget.uniqueName] = widget;

			this.fireEvent("addDefaultWidget", {widget : widget, entity: this});

			return widget;
		},

		removeDefaultWidget : function(widgetUniqueName){
			if(this.defaultWidgets[widgetUniqueName]){
				delete this.defaultWidgets[widgetUniqueName];
			}
			this.fireEvent("removeDefaultWidget", {widgetUniqueName : widgetUniqueName, entity : this});
		},

		getDefaultWidget : function(widgetUniqueName){
			return this.defaultWidgets[widgetUniqueName];
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
		db: false,
		widgetInstances : {},

		listeners : {},

		widgetsRan : {},		

		addListener : function(listenerName, callback){
			console.log("adding listener " + listenerName);
			if(!this.listeners[listenerName]){
				this.listeners[listenerName] = [];
			}
			this.listeners[listenerName].push(callback);
		},

		fireEvent : function(listenerName, params){
			console.log("calling listener " + listenerName);

			if(this.listeners[listenerName]){
				$.each(this.listeners[listenerName], function(index, callback){
					callback(params);
				});
			}
		},

		addWidgetInstance : function(widgetInstance){
			widgetInstance.thing = this;
			this.widgetInstances[widgetInstance.widget.uniqueName] = widgetInstance;
			this.fireEvent("addWidgetInstance", {widgetInstance : widgetInstance, entity : this});	
		},

		removeWidgetInstance : function(widgetUniqueName){
			if(this.widgetInstances[widgetUniqueName]){
				delete this.widgetInstances[widgetUniqueName];
			}
			this.fireEvent("removeWidgetInstance", {widgetUniqueName : widgetUniqueName, entity : this});	
		},



		// setup each widget to listen to the widgets it depends on.
		setupWidgetDependencies : function(){
			for (var name in this.widgetInstances){
				this.widgetsRun = {};
				var realthis = this;
				var widgetInstance = this.widgetInstances[name];

				// attach a listener for when ALL the widgets have run.
				widgetInstance.addListener("run", function(params){
					realthis.widgetsRun[params.widgetInstance.widget.uniqueName] = params.widgetInstance.widget.uniqueName;
					if(Object.keys(realthis.widgetsRun).length == Object.keys(realthis.widgetInstances).length){
						console.log("all widgets ran");
						console.log(realthis);
						realthis.db.saveThing(realthis, function(rdata){
				
 						});						
						realthis.fireEvent("allWidgetsRan", {thing: realthis});
					}
				});

				var deps = widgetInstance.widget.config.widgetDependencies;
				widgetInstance.depsRan = 0;
				widgetInstance.numDeps = Object.keys(deps).length;
				widgetInstance.hasRun = false;
				for(var  dep in deps){
					var depWidget = this.widgetInstances[dep];
					// setup the widget to listen for its dependency to run.
					depWidget.addListener("run", function(params){
						widgetInstance.depsRan++;
						if(widgetInstance.depsRan == widgetInstance.numDeps && !widgetInstance.hasRun){
							widgetInstance.run();
						}
					});
				}
			}
		},


		runWidgets : function(){
			var realthis = this;
			// 
			var numRan = 1;
			
			var counter = 0;

			for (var name in this.widgetInstances){
				var widgetInstance = this.widgetInstances[name];
				var deps = widgetInstance.widget.config.widgetDependencies;
				if(Object.keys(deps).length == 0){
					widgetInstance.run();
				}			
			}
		}
	};


	var Manager = {


		getWidgetManager : function(){
			var WidgetManager = false;

			if(typeof IAMONTHECLIENT === 'undefined'  || IAMONTHECLIENT == false){
				WidgetManager = require("./widget.class.js").WidgetManager();
			}else{
				WidgetManager = require("./classes/widget/widget.js").WidgetManager();
			}
			return WidgetManager;
		},

		getDbManager : function(){
			var db; 
			if(typeof IAMONTHECLIENT === 'undefined'  || IAMONTHECLIENT == false){
				db = require("./db.class.js").DbManager();
			}else{
				db = require("./classes/db/db.js").DbManager();
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
			console.log(" in generateThingType");
			var db = this.getDbManager();
			var WidgetManager = this.getWidgetManager();

			var thingType = this.createThingType(typeName);
			thingType.db= db;

			db.loadThingType(typeName, function(doc){
				if(doc){
					thingType._rev = doc._rev;
					thingType.allowedWidgetTypes = doc.allowedWidgetTypes;

					// iterate through the defaultwidgetname, deserialize
					if(doc.defaultWidgets instanceof Array){
						$.each(doc.defaultWidgets, function(index, widgetDoc){
							var widgetTypeName = widgetDoc.widgetTypeName;
							var uniqueName = widgetDoc.uniqueName;
							console.log("calling createWidget");
							var defaultWidget = WidgetManager.createWidget(widgetTypeName, uniqueName);
							WidgetManager.attachWidgetData(defaultWidget, widgetDoc);
							thingType.addDefaultWidget(defaultWidget);
						});
					}
				}
				console.log("calling callback");
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
			var db = this.getDbManager();
			var WidgetManager = this.getWidgetManager();
			var thisManager = this;

			var thing = this.createThing();
			thing.id = id;
			console.log("calling generateThingType");
			this.generateThingType(typeName, function(thingType){
				console.log("generateThingTypeCalled, in callback");
				thing.type = thingType;
				thing.db = db;

				db.loadThing(id, function(doc){
					console.log("loadThing done, in callback");
					if(!doc){
						console.log("no doc in db");
					}else{
						//load doc into thing, create widgets, etc.
						thing.data = doc.data;
						this._rev = doc._rev;
						// iterate through the defaultwidgetname, deserialize
						if(doc.widgetInstances instanceof Array){
							console.log("got widgetInstances");
							$.each(doc.widgetInstances, function(index, widgetInstanceDoc){
								var widgetTypeName = widgetInstanceDoc.widgetTypeName;
								var uniqueName = widgetInstanceDoc.uniqueName;

								var defaultWidget = thing.type.getDefaultWidget(uniqueName);

								if (!defaultWidget) {
									console.log("default widget no exist!");
									return true;
								};							

								var widgetInstance = WidgetManager.createWidgetInstance(thing, defaultWidget);
								WidgetManager.attachWidgetInstanceData(widgetInstance, widgetInstanceDoc.data);
								thing.addWidgetInstance(widgetInstance);

							});
						}

					}

					// add widget instances for thing, based on thingType.
					console.log("about to call resolveThingWidgets");
					thisManager.resolveThingWidgets(thing, callback);

				},
				function(notFoundDoc){
					thisManager.resolveThingWidgets(thing, callback);
				});
			});
		},


		resolveThingWidgets : function(thing, callback){


			console.log("in resolveThingWidgets");
			// go through the default widgets, add them to this thing as instances if it doesn't already have them.
			var WidgetManager = this.getWidgetManager();
			var db = this.getDbManager();

			var i =0;
			console.log(Object.keys(thing.type.defaultWidgets).length);
			
			$.each(thing.type.defaultWidgets, function(index, defaultWidget){
				console.log("in each");
				
				var widgetInstance = false;
				if(thing.widgetInstances[defaultWidget.uniqueName]){
					widgetInstance = thing.widgetInstances[index];
					// all good, the instance is already there
				}else{
					// create the widget instance and add it.
					widgetInstance = WidgetManager.createWidgetInstance(thing, defaultWidget);
					thing.addWidgetInstance(widgetInstance);
				}
				widgetInstance.init();
				i++;
				
				if(Object.keys(thing.type.defaultWidgets).length == i){
					console.log("all loaded allWidgetInstancesLoaded " );
					thing.setupWidgetDependencies();
					thing.runWidgets();
//					thing.fireEvent("allWidgetInstancesLoaded", {thing : thing});
				}

				
			});

			if(callback){
				callback(thing);
			}
			
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
