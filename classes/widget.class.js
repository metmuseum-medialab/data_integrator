

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

				console.log("deleting widget ");
				console.log(widget);

				thewidget.thingType.removeDefaultWidget(widget.uniqueName);
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
		attachBaseWidgetRenderCode : attachBaseWidgetRenderCode,

		getWidgetType : function(typeName){
			var manager = require("./widgets/"+typeName+"/widget."+typeName+".class.js").Manager();
			var type = manager.getWidgetType();
			return type;
		},
		getWidget : function(typeName, uniqueName){
			var path = "./widgets/"+typeName+"/widget."+typeName+".class.js";
			console.log("path to widget is  " + path);
			var manager = require(path).Manager();
			var widgetType = manager.getWidgetType(typeName);
			var widget = manager.getWidget();
			widget.widgetType = widgetType;
			widget.uniqueName = uniqueName;
			console.log("returning widget");
			console.log(widget);
			return widget;
		},
		getWidgetInstance : function(typeName){
			var manager = require("./widgets/"+typeName+"/widget."+typeName+".class.js").Manager();
			var widgetInstance = manager.getWidgetInstance();
			widgetInstance.widget = widget;
			return widgetInstance;			
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