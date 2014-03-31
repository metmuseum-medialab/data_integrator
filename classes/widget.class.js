

// a widget is attached to a THING, and does stuff. All widgets have common methods that the thing can call when assembling them
// a thing might have multiple widgets of the same type, with different data attached to it.

function WidgetManager(){

	function WidgetType(){};
	WidgetType.prototype = {
		typeName : false,

		bar : function(){
			return "bar1";
		}		
	} ;

	function Widget(){};
	Widget.prototype = {
		// everything that relates to the presence of a widget of this type on a thing of a particular type
		// ie.: the "art object thing" will get 3 "UrlLoader" widgets. That counts as 3 Widgets, each with theri own config.
		widgetType : false,
		thingType : false, // the thingType this particular widget is attached to
		config : {},


	} ;

	function WidgetInstance(){};

	WidgetInstance.prototype = {
		widget : false,
		thing : false, // the thing this particular widgetinstance is attached to.
		data : {},
	} ;



	var  Manager = {

		WidgetType : WidgetType,
		Widget : Widget,
		WidgetInstance : WidgetInstance,

		loadWidgetType : function(typeName){



			var manager = require("./widget."+typeName+".class.js").Manager();
			var type = new manager.WidgetType();

			return type;

		},
		loadWidget : function(widgetType, id){},
		loadWidgetInstance : function(widget, id){},

		createWidgetType : function(typeName){},
		createWidget : function(widgetType, config){},
		createWidgetInstance : function(widget, data){},

		saveWidgetType : function(widgetType){
			var widgetId = widget.getID();
			var widgetData = widget.getData();
			var widgetConfig = widget.getConfig();
		},
		saveWidgetInstance : function(widget){
			var widgetId = widget.getID();
			var widgetData = widget.getData();
			var widgetConfig = widget.getConfig();
		},
		saveWidgetInstance : function(widgetInstance){
			var widgetId = widgetInstance.getID();
			var widgetData = widgetInstance.getData();
			var widgetConfig = widget.getConfig();
		},

		renderWidget : function (widget, format){},


	}

	return Manager;

}

module.exports.WidgetManager = WidgetManager;