// this is a specific widget that does stuff, that the Thing can call

//var util = require("util");

function UrlLoaderWidget(){


	var BaseWidgetManager = require("./classes/widget.class.js").WidgetManager();


	function decorateWidgetType(widgetType, callback){
		widgetType.typeName = "UrlLoader";


		/*
		CODE TO ADD FUNCTIONALITY GOES HERE, I THINK 
		*/
		widgetType.onLoad = function(widgetInstance){
			// to run when this widget is loaded
			console.log("this widgetInstance Loaded, urlloader");
		};

		widgetType.allLoaded = function(widgetInstance){
			console.log("all WdigetInstances Loaded, urlloader");
		//	widgetInstance.data.random = Math.random();
		};



		if(callback){
			callback(widgetType);
		}
		return widgetType;

	}

	function decorateWidget(widget, callback){
		widget.renderWidgetConfigEditBody  = function (widgetBody){
			var form = $("<div></div>")
			$(widgetBody).append(form);			

			var url = (this.config.url ? this.config.url : "");

			var input1 = $('<div class="input-group"><span class="input-group-addon">url</span><input type="text" class="form-control" value="'+url+'"></div>');

			var thiswidget = this;

			$(input1).change(function(evt){
				var newurl = evt.target.value;
				thiswidget.config.url = newurl;
				var ThingManager = require("./classes/thing.class.js").ThingManager();
				ThingManager.saveThingType(thiswidget.thingType, function(result){
					// do thing with result here
				});
			});

			$(form).append(input1);
		}
		if(callback){
			callback(widget);
		}
		return widget;



	}


	function decorateWidgetInstance(widgetInstance, callback){

		widgetInstance.renderWidgetInstancePageItemBody = function(container){
			console.log(this.widget.config);
			$(container).append("<h1>"+this.widget.config.url+"<BR>"+this.data.random+"</h1>")
		}

		if(callback){
			callback(widgetInstance);
		}
		return widgetInstance;

	}

	var  Manager = {
		decorateWidgetType : decorateWidgetType,
		decorateWidget : decorateWidget,
		decorateWidgetInstance : decorateWidgetInstance,

	}


	return Manager;

}

module.exports.Manager = UrlLoaderWidget;