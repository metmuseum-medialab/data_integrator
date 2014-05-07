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



		renderThingTypeEditable : function (thingType, container){
			/*
			 thingTypes need to be able to add: 
			 	- allowable widgetTypes (that's ust the name of the widgetTypes)
			 	thingType.allowedWidgetTypes
			 	thingType.defaultWidgets
				- default widgets that's the Widget with the config data
				// the widget edit renderer should reveal the config data and make it editable
			*/
			var div = $("<div class='container thingTypeEditable' />");
			$(container).append(div);
			var allowedRow = $("<div class='row' />");
			$(div).append(allowedRow);

			console.log(thingType);

			$.each(thingType.allowedWidgetTypes, function(index, value){
				allowedRow.append("<div class='col-md-4'>" + value.typeName + "</div>");
			});

			var defaultRow = $("<div class='row' />");
			$(div).append(defaultRow);

			$.each(thingType.defaultWidgets, function(index, value){
				defaultRow.append("<div class='col-md-4'>" + value.widgetType.typeName + " : " + value.uniqueName+ "</div>");
			});

			// add an all-pupose modal that can be filled with various content, and fired via javascript
			var modal = $('<div id="allPurposeModal" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content">...</div></div></div>');



		},

		renderThingTypeNav : function (thingType, container){
			$(".entityDescriptor", container).text(thingType.category + " : " + thingType.typeName);


			var action1 = $(".actionDropdown", container);
			var action2 = $(action1).clone();


			$(".actionLabel", action1).text('Add Allowed Widget');
	        var widgetManager = require("./classes/widget.class.js").WidgetManager();
            widgetManager.getWidgetList(function(list){
            	console.log(list);

				$.each(list, function(name, info){
					var widgetAddDiv = $('<li class="addAllowedWidget ' + name + '"><span class="glyphicon glyphicon-plus"></span>Add '+name+'</li>');
					$(".dropdown-menu", action1).append(widgetAddDiv);
					$(widgetAddDiv).click(function(evt){
						console.log("add clicked " + name);	
						thingType.addAllowedWidgetType(name);
					});
				});          	
            	// create list for de/selecting allowable widget
            });


            thingType.addListener('addAllowedWidgetType', function(params){
            	var name = params.widgetTypeName;
            	var targetThingType = params.entity;
            	$("."+name, action1).remove();
            });






			$(".actionLabel", action2).html('Add Default Widget');
			$(action1).after(action2); 

			$.each(thingType.allowedWidgetTypes, function(index, name){
				var widgetAddDiv = $('<li class="addDefault	Widget ' + name + '"><span class="glyphicon glyphicon-plus"></span>Add '+name+'</li>');
				$(".dropdown-menu", action1).append(widgetAddDiv);
				$(widgetAddDiv).click(function(evt){
					console.log("add clicked " + name);	
					// need to get the uniuename
					$('#allPurposeModal').modal('show');

//					thingType.addDefaultWidget(name);
				});
			});
            thingType.addListener('addAllowedWidgetType', function(params){
            	var name = params.widgetTypeName;
            	var targetThingType = params.entity;
				var widgetAddDiv = $('<li class="addDefault	Widget ' + name + '"><span class="glyphicon glyphicon-plus"></span>Add '+name+'</li>');
				$(".dropdown-menu", action2).append(widgetAddDiv);
				$(widgetAddDiv).click(function(evt){
					console.log("add clicked " + name);	
					$('#allPurposeModal').modal('show');
					//thingType.addDefaultWidget(name);
				});
            });



		}

	};

	return RenderManager;


}

module.exports.RenderManager = RenderManager;

