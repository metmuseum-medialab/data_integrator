
/* 
I think we need one place in teh code where entities have ids generated, and where ids can be turned back nto entities

This code renders the different entities for various purposes.

ultimately, this code will need to get refactored, I haven't put much thought into how it's set up,
i just wanted to be able to show the entities and edit them in the browser.

long-term, we need to tie this in to a template engine, so the views are more configurable. 
For now, we're jsut building out a bootstrap-based view
*/
function RenderManager(){


	var RenderManager = {


		renderEntityEditable : function(entity, nav, body){
			if(entity.category == "ThingType"){
				this.renderThingTypeNav(entity, nav);
				this.renderThingTypeEditable(entity, body);
			}
		},

		renderDataAsText : function (dataObj){
			var string = JSON.stringify(dataObj);

			return id;
		},



		renderThingTypeEditable : function (container, thingType){
			/*
			 thingTypes need to be able to add: 
			 	- allowable widgetTypes (that's ust the name of the widgetTypes)
			 	thingType.allowedWidgetTypes
			 	thingType.defaultWidgets
				- default widgets that's the Widget with the config data
				// the widget edit renderer should reveal the config data and make it editable
			*/
			var div = $("<div class='container />");
			var allowedRow = $("<div class='row' />");
			$(div).append(allowedRow);

			$.each(thingType.allowedWidgetTypes, function(index, value){
				allowedRow.append("<div class='col-md-4'>" + value.typeName + "</div>");
			});

			var defaultRow = $("<div class='row' />");
			$(div).append(defaultRow);

			$.each(thingType.defaultWidgets, function(index, value){
				defaultRow.append("<div class='col-md-4'>" + value.widgetType.typeName + " : " + value.uniqueName+ "</div>");
			});


		},

		renderThingTypeNav : function (thingType, container){
			$(".entityDescriptor", container).text(thingType.category + " : " + thingType.typeName);


			var action1 = $(".actionButton", container);
			$(".actionLabel", action1).text("add Allowed Widget");
			var action2 = $(action1).clone();
			$(".actionLabel", action2).text("add Default Widget");
			$(action1).after(action2); 

		}

	};

	return RenderManager;


}

module.exports.RenderManager = RenderManager;

