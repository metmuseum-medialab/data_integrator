function ThingManager(){

	function Thing(){};

	Thing.prototype = {
		id : false,
		type: false,

		foo : function (){
			return "foo1";
		},


		attachWidget : function(widget){},


	};


	function ThingType(){}
	ThingType.prototype = {
		typeName : "",
		defaultWidgets : [], // array of {widgetType, Config }
		allowedWidgets : [] // array of {wdigetType}

	};

	var Manager = {

		createNewThingType : function(typeName){},
		loadThingType : function(typeName){}, // returns ThingType 
		saveThingType : function(thingType){},

		createNewThing : function(type){}, // returns thing
		loadThing : function(type, id){}, // returns thing
		saveThing : function(thing){}, 
		renderThing : function(thing, format){}, // returns string, or dom, or JSON, or ...
		initializeThing : function(thing){},
		attachWidgetAsDefaultToThingType :  function(thingType, widgetType, config){},
		loadThingsWidgets : function(thing){},
		runThingsWidgets : function(thing){},

	}

	return Manager;
}

module.exports.ThingManager = ThingManager;
