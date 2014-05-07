

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


			}
		}
		return baseWidget;
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

			loadData : function(){
				// we'll assume couchdb for now
			},

			saveData : function(){

			}
		};
		return baseWidgetInstance;
	}


	var  Manager = {

		widgetDir : "widgets",

		getBaseWidgetType : getBaseWidgetType,
		getBaseWidget : getBaseWidget,
		getBaseWidgetInstance : getBaseWidgetInstance,

		getWidgetType : function(typeName){
			var manager = require("./widget."+typeName+".class.js").Manager();
			var type = manager.getWidgetType();
			return type;
		},
		getWidget : function(typeName){
			var manager = require("./widget."+typeName+".class.js").Manager();
			var widgetType = manager.getWidgetType(typeName);
			var widget = manager.getWidget();
			widget.widgetType = widgetType;
			return widget;
		},
		getWidgetInstance : function(typeName){
			var manager = require("./widget."+typeName+".class.js").Manager();
			var widgetInstance = manager.getWidgetInstance();
			widgetInstance.widget = widget;
			return widgetInstance;			
		},

		renderWidget : function (widget, format){},

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