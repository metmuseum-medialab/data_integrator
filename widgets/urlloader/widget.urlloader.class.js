// this is a specific widget that does stuff, that the Thing can call

//var util = require("util");

function UrlLoaderWidget(){


	var BaseWidgetManager = require("./classes/widget.class.js").WidgetManager();


	function getWidgetType(){
		base = BaseWidgetManager.getBaseWidgetType();
		var widgetType = Object.create(base);
		widgetType.typeName = "UrlLoader";


		/*
		CODE TO ADD FUNCTIONALITY GOES HERE, I THINK 

		*/



		return widgetType;
	}

	function getWidget(){
		base = BaseWidgetManager.getBaseWidget();
		var widget = Object.create(base);
		widget.widgetType = getWidgetType();

		// widget has a config array, which holds the values that get edited here.

		// GO FOR RENDERING CONFIG FOR VIEWING AND EDITING GOES HERE, I THINK. ADD FUNCITONS TO THE WIDGET
		BaseWidgetManager.attachBaseWidgetRenderCode(widget);


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

		return widget;
	}

	function getWidgetInstance(){
		base = BaseWidgetManager.getBaseWidgetInstance();
		var widgetInstance = Object.create(base);
		widgetInstance.widget = getWidget();
		return widgetInstance;
	}



	var  Manager = {
		getWidgetType : getWidgetType,
		getWidget : getWidget,
		getWidgetInstance : getWidgetInstance,
	}


	return Manager;

}

module.exports.Manager = UrlLoaderWidget;