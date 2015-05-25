// this is a specific widget that does stuff, that the Thing can call

//var util = require("util");

function HackpadWidget(){


	var BaseWidgetManager = require(GLOBAL.params.require_prefix+"/classes/widget/widget.js").WidgetManager();


	function decorateWidgetType(widgetType, callback){
		widgetType.typeName = "Hackpad";
		/*
		CODE TO ADD FUNCTIONALITY GOES HERE, I THINK 
		*/



		if(callback){
			callback(widgetType); 
		}
		return widgetType;
 
	}

	function decorateWidget(widget, callback){

		widget.addListener("renderWidgetConfigEditBody_after", function(params){
			var widgetBody = params.container;
			var accordion = params.accordion;
			var thiswidget = params.widget;
			console.log(thiswidget);
			widgetBody.append("<b>here</b>");

			// the body of the Wdiget's Config view	

		});

	
/*
// when the template is saved set the data into thte config, save it, etc.
				ThingManager.saveThingType(thiswidget.thingType, function(result){
					// do thing with result here
				});
*/


		
		if(callback){
			callback(widget);
		}
		return widget;



	}


	function decorateWidgetInstance(widgetInstance, callback){



		widgetInstance.renderWidgetInstancePageItemBody = function(container){
			var realthis = this;

			// rendering the body of the widget when it appears in a specific instance.
			var parsedContentElem = GLOBAL.$("<div>"+this.data.parsedTemplate+"</div>");

			this.addListener("templateParsed", function(params){
				GLOBAL.$(parsedContentElem).html(realthis.data.parsedTemplate);
			});

			console.log("showing this info for hackpad widget");
			console.log(this);

			var uniqueID = this.thing.type.typeName + "_" + this.thing.id + "_" +this.widget.uniqueName;
			var link= "https://integrator.hackpad.com/"+uniqueID

			// it may be that I need to do a POST call to create the hackpad before I embed it...
/*
			$.ajax({
				url : "",
				type :"POST",

			})
*/
			console.log(uniqueID);
			container.append("<div id='"+uniqueID+"'></div><BR><a href='"+link+"' target='_blank'>View on Hackpad</a>");
			console.log("rendering hackpad");
			console.log(hackpad);
			hackpad.render("#"+uniqueID, uniqueID, "integrator"); // note, this "integrator" subdomain needs to be configurable.
		}


		// server-side function to create pad if it doesn't exist, find it if it does, and return the padID.

		widgetInstance.run = function(){
			var realthis = this;

			// running the widget
			var parsed = "";

			this.data.parsedTemplate = parsed;
			this.fireEvent("templateParsed", {widgetInstance : this});
			this.fireEvent("run", {widgetInstance : this});
		}


		widgetInstance.init = function(){
			// to run when this widget is loaded
			realThis = this;
		}

		widgetInstance.allLoaded = function(params){
//			this.run();
		//	widgetInstance.data.random = Math.random();
		};



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

module.exports.Manager = HackpadWidget;