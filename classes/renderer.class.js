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
			$(div).append(modal);


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
						var ThingManager = require("./classes/thing.class.js").ThingManager();
						ThingManager.saveThingType(thingType);
						
					});
				});          	
            	// create list for de/selecting allowable widget
            });

            // once and allowedWidgetType is added, it doesn't need to be an option anymore.
            thingType.addListener('addAllowedWidgetType', function(params){
            	var name = params.widgetTypeName;
            	var targetThingType = params.entity;
            	$("."+name, action1).remove();
            });





            // dropdown for adding default widgets
			$(".actionLabel", action2).html('Add Default Widget');
			$(action1).after(action2); 
			function addDefaultWidgetOption(widgetTypeName, dropdownContainer){
				var widgetAddDiv = $('<li class="addDefault	Widget ' + widgetTypeName + '"><span class="glyphicon glyphicon-plus"></span>Add '+widgetTypeName+'</li>');
				$(".dropdown-menu", dropdownContainer).append(widgetAddDiv);
				$(widgetAddDiv).click(function(evt){
					console.log("add clicked 2 " + widgetTypeName);	
					// need to get the uniuename
					$('#allPurposeModal .modal-content').html('<h4>Enter Unique Name for this instance of this widget</h4>');
					var formElem = $('<input type="text" class="form-control" placeholder="Username" />');
					$('#allPurposeModal .modal-content').append(formElem);
					$('#allPurposeModal').modal('show');
					$('#allPurposeModal').off('hide.bs.modal');
					$('#allPurposeModal').on('hide.bs.modal', function(evt){
						// this code may also need to tell if the uniqueName is taken or not.
						var widgetUniqueName = $(formElem).val();
						console.log("uniqueName is " + widgetUniqueName);
						thingType.addDefaultWidget(widgetTypeName, widgetUniqueName);
						// if there's a problem, return false;
					});
				});				
			}

			// when the page loads, adding the existing allowable widgets as options
			$.each(thingType.allowedWidgetTypes, function(index, widgetTypeName){
				addDefaultWidgetOption(widgetTypeName, action2);
			});

			// when a new allowedWidgetType is added, adding to the options.
            thingType.addListener('addAllowedWidgetType', function(params){
            	var widgetTypeName = params.widgetTypeName;
            	var targetThingType = params.entity;
				addDefaultWidgetOption(widgetTypeName, action2);
            });



		}

	};

	return RenderManager;


}

module.exports.RenderManager = RenderManager;

