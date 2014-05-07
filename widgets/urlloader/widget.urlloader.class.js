// this is a specific widget that does stuff, that the Thing can call

var util = require("util");

function UrlLoaderWidget(){


	var BaseWidgetManager = require("./widget.class.js").WidgetManager();


	function getWidgetType(){
		base = BaseWidgetManager.getBaseWidgetType();
		var widgetType = Object.create(base);
		widgetType.typeName = "UrlLoader",
		return widgetType;
	};

	function getWidget(){
		base = BaseWidgetManager.getBaseWidget();
		var widget = Object.create(base);
		widget.widgetType = getWidgetType();
		return widget;
	};

	function getWidgetInstance(){
		base = BaseWidgetManager.getBaseWidgetInstance();
		var widgetInstance = Object.create(base);
		widgetInstance.widget = getWidget();
		return widgetInstance;
	};


	var  Manager = {
		getWidgetType : getWidgetType,
		getWidget : getWidget,
		getWidgetInstance : getWidgetInstance,
	}


	return Manager;

}

module.exports.Manager = UrlLoaderWidget;