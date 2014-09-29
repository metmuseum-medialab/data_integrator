// this is a specific widget that does stuff, that the Thing can call

//var util = require("util");

function UrlLoader2Widget(){


	var BaseWidgetManager = require(GLOBAL.params.root_dir+"/classes/widget/widget.js").WidgetManager();


	function getWidgetType(){
		base = BaseWidgetManager.getBaseWidgetType();
		var widgetType = Object.create(base);
		widgetType.typeName = "UrlLoader2";
		return widgetType;
	}

	function getWidget(){
		base = BaseWidgetManager.getBaseWidget();
		var widget = Object.create(base);
		BaseWidgetManager.attachBaseWidgetRenderCode(widget);
		
		widget.widgetType = getWidgetType();
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

module.exports.Manager = UrlLoader2Widget;