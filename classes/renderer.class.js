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
			var div = $("<div class='container thingTypeEditable' ></div>");
			$(container).append(div);

			var defaultRow = $("<div class='row defaultWidgetList' />");
			$(div).append(defaultRow);


			function addDefaultWidgetPageItem(container, widget){
            	var col = $('<div class="col-md-4 widget '+widget.uniqueName+'"></div>');
            	$(container).append(col);

            	var widgetDiv = $('<div class="panel panel-info"></div>');
            	var widgetHeader = $('<div class="panel-heading"></div>');
            	var widgetBody = $('<div class="panel-body"></div>');
            	var widgetFooter = $('<div class="panel-footer"></div>');
            	$(col).append(widgetDiv);
            	$(widgetDiv).append(widgetHeader);
            	$(widgetDiv).append(widgetBody);
            	$(widgetDiv).append(widgetFooter);
            	widget.renderWidgetConfigEdit(widgetHeader, widgetBody, widgetFooter);

			}

			$.each(thingType.defaultWidgets, function(index, widget){
            	addDefaultWidgetPageItem($(defaultRow), widget);
			});

			// add an all-pupose modal that can be filled with various content, and fired via javascript
			var modal = $('<div id="allPurposeModal" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content">...</div></div></div>');
			$(div).append(modal);

            thingType.addListener("addDefaultWidget", function(params){
            	var widget = params.widget;
            	addDefaultWidgetPageItem($(defaultRow), widget);

            });

            thingType.addListener("removeDefaultWidget", function(params){
            	var widgetUniqueName = params.widgetUniqueName;
            	var selector = ".defaultWidgetList ."+widgetUniqueName;
            	$(".defaultWidgetList ."+widgetUniqueName).remove();
            });


		},

		renderThingTypeNav : function (thingType, container){
			$(".entityDescriptor", container).text(thingType.category + " : " + thingType.typeName);


			var action1 = $(".actionDropdown", container);
			var action2 = $(action1).clone();

			function createAddAllowedWidgetButton(thingType, container, name){
				var widgetAddDiv = $('<li class="addAllowedWidget ' + name + '"><span class="glyphicon glyphicon-plus"></span>Add '+name+'</li>');
				$(".dropdown-menu", action1).append(widgetAddDiv);
				$(widgetAddDiv).click(function(evt){
					thingType.addAllowedWidgetType(name);
					var ThingManager = require("./classes/thing.class.js").ThingManager();
					ThingManager.saveThingType(thingType, function(result){
						// do thing with result here
					});

				});

			}

			function createRemoveAllowedWidgetButton(thingType, container, name){
				var widgetAddDiv = $('<li class="removeAllowedWidget ' + name + '"><span class="glyphicon glyphicon-remove"></span>Remove '+name+'</li>');
				$(container).append(widgetAddDiv);
				$(widgetAddDiv).click(function(evt){
					thingType.removeAllowedWidgetType(name);
					var ThingManager = require("./classes/thing.class.js").ThingManager();
					ThingManager.saveThingType(thingType, function(result){
						// do thing with result here
					});
				});
			}

			$(".actionLabel", action1).text('Add Allowed Widget');
	        var widgetManager = require("./classes/widget.class.js").WidgetManager();
            widgetManager.getWidgetList(function(list){

				$.each(list, function(name, info){
					if($.inArray(name, thingType.allowedWidgetTypes) > -1){
						return true;
					}
					createAddAllowedWidgetButton(thingType, $(".dropdown-menu", action1), name)
				});        	
				$.each(list, function(name, info){
					if($.inArray(name, thingType.allowedWidgetTypes) == -1){
						return true;
					}
					createRemoveAllowedWidgetButton(thingType, $(".dropdown-menu", action1), name)
				});        	
            });



            // once and allowedWidgetType is added, it doesn't need to be an option anymore.
            thingType.addListener('addAllowedWidgetType', function(params){
            	var name = params.widgetTypeName;
            	var targetThingType = params.entity;
            	$("."+name, action1).remove();
            	createRemoveAllowedWidgetButton(thingType, $(".dropdown-menu", action1), name);
            });

            // once and allowedWidgetType is added, it doesn't need to be an option anymore.
            thingType.addListener('removeAllowedWidgetType', function(params){
            	var name = params.widgetTypeName;
            	var targetThingType = params.entity;
            	$("."+name, action1).remove();
            	createAddAllowedWidgetButton(thingType, $(".dropdown-menu", action1), name);
            });


            // dropdown for adding default widgets
			$(".actionLabel", action2).html('Add Default Widget');
			$(action1).after(action2); 
			function addDefaultWidgetOption(widgetTypeName, dropdownContainer){
				var widgetAddDiv = $('<li class="addDefault	Widget ' + widgetTypeName + '"><span class="glyphicon glyphicon-plus"></span>Add '+widgetTypeName+'</li>');
				$(".dropdown-menu", dropdownContainer).append(widgetAddDiv);
				$(widgetAddDiv).click(function(evt){
					// need to get the uniuename
					$('#allPurposeModal .modal-content').html('<h4>Enter Unique Name for this instance of this widget</h4>');
					var formElem = $('<input type="text" class="form-control" placeholder="Username" />');
					$('#allPurposeModal .modal-content').append(formElem);
					$('#allPurposeModal').modal('show');
					$('#allPurposeModal').off('hide.bs.modal');
					$('#allPurposeModal').on('hide.bs.modal', function(evt){
						// this code may also need to tell if the uniqueName is taken or not.
						var widgetUniqueName = $(formElem).val();
						thingType.addDefaultWidget(widgetTypeName, widgetUniqueName);
						// if there's a problem, return false;
					});
				});				
			}

			function removeDefaultWidgetOption(widgetTypeName, dropdownContainer){
				$("."+widgetTypeName, dropdownContainer).remove();
			
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
			// when a new allowedWidgetType is added, adding to the options.
            thingType.addListener('removeAllowedWidgetType', function(params){
            	var widgetTypeName = params.widgetTypeName;
            	var targetThingType = params.entity;
				removeDefaultWidgetOption(widgetTypeName, action2);
            });




		}

	};

	return RenderManager;


}

module.exports.RenderManager = RenderManager;

