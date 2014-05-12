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

		console.log("got widget");
		// GO FOR RENDERING CONFIG FOR VIEWING AND EDITING GOES HERE, I THINK. ADD FUNCITONS TO THE WIDGET


		widget.renderWidgetConfigEditBody  = function (widgetBody){


			var form = $("<div></div>")
			$(widgetBody).append(form);			

			var input1 = $('<div class="input-group"><span class="input-group-addon">url</span><input type="text" class="form-control"></div>');

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