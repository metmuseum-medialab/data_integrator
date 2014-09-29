

// a widget is attached to a THING, and does stuff. All widgets have common methods that the thing can call when assembling them
// a thing might have multiple widgets of the same type, with different data attached to it.

function WidgetManager(){


	var baseWidgetType = false;
	function getBaseWidgetType(){
		// the WidgetType defines what the Widget can DO : it has the FUNCTIONS


		if(baseWidgetType){
			return baseWidgetType;
		}
		var baseWidgetType = {
			typeName : false,
			category : "WidgetType",
			id : false,


		};

		return baseWidgetType;
	}


	var baseWidget = false;
	function getBaseWidget(){
		// the widget defines how the widget will behave in a certain context. It has the CONFIG
		if(baseWidget){
			return baseWidget;
		}
		var baseWidget = {
			// everything that relates to the presence of a widget of this type on a thing of a particular type
			// ie.: the "art object thing" will get 3 "UrlLoader" widgets. That counts as 3 Widgets, each with theri own config.
			category : "Widget",
			widgetType : false, // points to teh widgetType object
			thingType : false, // the thingType this particular widget is attached to
			config : {},
			id : false,
			uniqueName : false,


			listeners : {},

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


			setConfig : function(config){
				this.config = config; 
			},

			setUniqueName : function(name){
				// make sure it's unique for all widgets in this thingL
				if(!this.thingType.hasWidgetNamed(name)){
					this.uniqueName = name;
					return true;
				}
				return false;
			},


			saveConfig : function(){


			},


			createWidgetInstance : function(thing){
				// create a widget instance and attach it to the provided thing (?)

			}
		}
		return baseWidget;
	}


	function attachBaseWidgetRenderCode(widget){


		widget.renderWidgetConfigEdit = function (widgetHeader, widgetBody, widgetFooter){
			this.renderWidgetConfigEditFooter(widgetFooter);
			this.renderWidgetConfigEditHeader(widgetHeader);
			this.renderWidgetConfigEditBody(widgetBody);
		},



		widget.renderWidgetConfigEditFooter = function(container){
			var deletebutton = $('<button type="button" class="btn btn-default btn-md"><span class="glyphicon glyphicon-trash"></span> Remove</button>');
			$(container).append(deletebutton);

			thewidget = this;
			deletebutton.click(function(){
				thewidget.thingType.removeDefaultWidget(widget.uniqueName);
				var ThingManager = require("./classes/thing/thing.js").ThingManager();

				ThingManager.saveThingType(thewidget.thingType, function(result){
					// do thing with result here
				});

			});
		};

		widget.renderWidgetConfigEditHeader = function(container){
			$(container).append("<h4>"+ this.widgetType.typeName  + " : " +  this.uniqueName);
		};

		widget.renderWidgetConfigEditBody = function(container){
			var configEdit = $("<div>renderWidgetConfigEdit not set up for this widget</div>");
			$(container).append(configEdit);
		};

	}


	var baseWidgetInstance = false;
	function getBaseWidgetInstance(){
		// the widetInstance defines the contents and state of a widget as attached to a specific THING. 
		// it hs the DATA
		if(baseWidgetInstance){
			return baseWidgetInstance;
		}
		var baseWidgetInstance = {
			category : "WidgetInstance",
			widget : false,
			thing : false, // the thing this particular widgetinstance is attached to.
			id : false,
			data : {},


			listeners : {},

			addListener : function(listenerName, callback){
				if(!this.listeners[listenerName]){
					this.listeners[listenerName] = [];
				}
				this.listeners[listenerName].push(callback);
			},

			fireEvent : function(listenerName, params){
				console.log(this.widget.uniqueName + " in fireevent " + listenerName);
				if(this.listeners[listenerName]){
					console.log("firing");
					$.each(this.listeners[listenerName], function(index, callback){
						callback(params);
					});
				}
			},			

			init  : function(widgetInstance){
				// to run when this widget is loaded
				console.log("this widgetInstance Loaded");
			},

			loadData : function(){
				// we'll assume couchdb for now
			},

			saveData : function(){

			},


			processTemplate : function(templateString, callback){
				console.log("in processTemplate");
				console.log(this);
				var dot = require(GLOBAL.params.root_dir+'/node_modules/dot/doT.js');
				var deps = {};
				for (var depname in this.widget.config.widgetDependencies){
					console.log("adding deps data" + depname);
					deps[depname] = this.thing.widgetInstances[depname].data;
				}
				var tpldata = {thing: this.thing, config: this.widget.config, data : this.data, deps: deps};
				console.log("about to call with ");
				console.log(tpldata);
				var tplfn = dot.template(templateString);
				var string = tplfn(tpldata);
				if(callback){
					callback(string);
				}
				return string;
			}

		};
		return baseWidgetInstance;
	}


	function attachBaseWidgetInstanceRenderCode(widgetInstance){


		widgetInstance.renderWidgetInstancePageItem = function (widgetInstanceHeader, widgetInstanceBody, widgetInstanceFooter){
			this.renderWidgetInstancePageItemFooter(widgetInstanceFooter);
			this.renderWidgetInstancePageItemHeader(widgetInstanceHeader);
			this.renderWidgetInstancePageItemBody(widgetInstanceBody);
		},



		widgetInstance.renderWidgetInstancePageItemFooter = function(container){
		};

		widgetInstance.renderWidgetInstancePageItemHeader = function(container){
			console.log(widgetInstance.widget);
			$(container).append("<h4>"+ widgetInstance.widget.widgetType.typeName  + " : " +  widgetInstance.widget.uniqueName);
		};

		widgetInstance.renderWidgetInstancePageItemBody = function(container){
			var configEdit = $("<div>renderWidgetInstance not set up for this widget</div>");
			$(container).append(configEdit);
		};

	}



	var  Manager = {

		widgetDir : "widgets",

		getBaseWidgetType : getBaseWidgetType,
		getBaseWidget : getBaseWidget,
		getBaseWidgetInstance : getBaseWidgetInstance,
		attachBaseWidgetRenderCode : attachBaseWidgetRenderCode,
		attachBaseWidgetInstanceRenderCode : attachBaseWidgetInstanceRenderCode,

		createWidgetType : function(typeName){
			base = this.getBaseWidgetType();
			var widgetType = Object.create(base);

			var manager = require(GLOBAL.params.root_dir+ "/widgets/"+typeName+"/widget."+typeName+".class.js").Manager();

			var widgetType = manager.decorateWidgetType(widgetType, false);
			return widgetType;
		},


		createWidget : function(typeName, uniqueName){
			var path = GLOBAL.params.root_dir+ "/widgets/"+typeName+"/widget."+typeName+".class.js";
			var manager = require(path).Manager();

			var widgetType = this.createWidgetType(typeName);

			base = this.getBaseWidget();
			var widget = Object.create(base);
			this.attachBaseWidgetRenderCode(widget);
			widget.widgetType = widgetType;
			widget.uniqueName = uniqueName;			
			widget.widgetType = widgetType;

			var widget = manager.decorateWidget(widget, false);

			console.log("created widget  " + uniqueName);
			return widget;
		},
		attachWidgetData : function(widget, data){
			widget.uniqueName = data.uniqueName;
			widget.config = data.config;
		},

		createWidgetInstance : function(thing, widget, data){
			var typeName = widget.widgetType.typeName;
			var uniqueName = widget.uniqueName;

			var manager = require(GLOBAL.params.root_dir+ "/widgets/"+typeName+"/widget."+typeName+".class.js").Manager();

			base = this.getBaseWidgetInstance();
			var widgetInstance = Object.create(base);

			this.attachBaseWidgetInstanceRenderCode(widgetInstance);
			widgetInstance.widget = widget;
			widgetInstance.thing = thing;
			widgetInstance = manager.decorateWidgetInstance(widgetInstance, false);

			if(data){
				widgetInstance.data = data;
			}

			return widgetInstance;			
		},

		attachWidgetInstanceData :  function(widgetInstance, data){
			widgetInstance.data = data;

		},

		serializeWidget : function(widget){
			var doc = {};
			doc.uniqueName = widget.uniqueName;
			doc.widgetType = widget.widgetType;
			doc.config = widget.config;
			return doc;
		},

		deserializeWidget : function(widget, doc){
			widget.uniqueName = doc.uniqueName;
			widget.widgetType = doc.widgetType;
			widget.config = doc.config;
		},

		renderWidget : function (widget, format){},



		// need to enable widgets to be able to register server-side urls,
		// so they can call code on the server that executes ... stuff.
		registerServerSideWidgetFunctions : function(callback){
			this.getWidgetList(function(widgetFileList){
				// go through list of widgets, and ask each one if it has any server-side functions
				callback(widgetFileList);

				var serverSideFunctions = {
					GET :{},
					PUT :{},
					POST :{},
				};

				$.each(widgetFileList, function(typeName, file){
					console.log(typeName);

					console.log(GLOBAL.params);

					var manager = require(GLOBAL.params.root_dir+"/widgets/"+typeName+"/widget."+typeName+".class.js").Manager();
					if(manager.registerServerSideFunctions){
						var theFunctions = manager.registerServerSideFunctions();
						$.extend(serverSideFunctions.GET, theFunctions.GET);
						$.extend(serverSideFunctions.PUT, theFunctions.PUT);
						$.extend(serverSideFunctions.POST, theFunctions.POST);
					}
				});

				callback(serverSideFunctions);

//			var manager = require("./widgets/"+typeName+"/widget."+typeName+".class.js").Manager();



			});

		},


		getWidgetList : function(callback2){
			// this code will only run server-side
			// how to determine? if we can determine here, we can call the server and run this code, so other code can just call this class directly, regardless of where it's running.


			try{
				var fs= require("fs");
			}catch(error){
				console.log(error);
				console.log("calling with ajax");
				// we're on the client: call the server instead.
				$.ajax({
					url : "./widgetlist" ,
					type : "GET",
				//	processData : false,
					contentType : 'json',
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

			var async = require("async");
			var filelist = fs.readdirSync(this.widgetDir);
			var realthis = this
			var newList = {};
			async.eachSeries(filelist, 
				function(file, callback){
				  var path = realthis.widgetDir +"/"+ file;
				  var stat = fs.statSync(path);
				  if(stat.isDirectory()){
					  newList[file] = {file: file};
					  newList[file].stat = stat;
				  }
				  callback();
				},
				function(){
				  callback2(newList);
				}
			);
		},

	}

	return Manager;

}

module.exports.WidgetManager = WidgetManager;