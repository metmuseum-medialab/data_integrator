// this is a specific widget that does stuff, that the Thing can call

var util = require("util");

function UrlLoaderWidget(){


	var BaseWidgetManager = require("./widget.class.js").WidgetManager();

	function WidgetType(){};



	WidgetType.prototype = {
		typeName : "UrlLoader",
		foo : function(){
			return "foo1";
		}

	};

	function Widget(){};

	Widget.prototype = {
		widgetType : false,
		config : {}
	};
	function WidgetInstance(){};

	WidgetInstance.prototype = {
		widget : false,
		data : {}
	};


	var  Manager = {
		WidgetType : WidgetType,
		Widget : Widget,
		WidgetInstance : WidgetInstance,

	}


	return Manager;

}

module.exports.Manager = UrlLoaderWidget;