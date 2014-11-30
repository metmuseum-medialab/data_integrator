// this is a specific widget that does stuff, that the Thing can call

//var util = require("util");

function TemplateRendererWidget(){


	var BaseWidgetManager = require("./classes/widget/widget.js").WidgetManager();


	function decorateWidgetType(widgetType, callback){
		widgetType.typeName = "TemplateRenderer";
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
			// template design widget
			var templatestring = (thiswidget.config.template ? thiswidget.config.template : "");
			thiswidget.config.template = templatestring;
			var input1 = $('<h5>Open Editor</h5>');
			$(".widgetConfig", accordion).append(input1);
			$(input1).click(function(evt){
				$('#allPurposeModalLarge .modal-header').html('<h4>Edit Content</h4>');
				var editorElem = $('<textarea></textarea>');
				$('#allPurposeModalLarge .modal-body').html(editorElem);
				$('#allPurposeModalLarge').modal('show');
				$('#allPurposeModalLarge').off('hide.bs.modal');
				$(editorElem).ckeditor(function(elem){},
										{
											baseFloatZIndex : 9000,
										});
				$(editorElem).val(templatestring);

				$('#allPurposeModalLarge').on('hide.bs.modal', function(evt){
					var ThingManager = require("./classes/thing/thing.js").ThingManager();

					thiswidget.config.template = $(editorElem).val();
					templatestring = thiswidget.config.template;
					ThingManager.saveThingType(thiswidget.thingType, function(result){
						// do thing with result here
					});
					$('#allPurposeModalLarge').off('hide.bs.modal');
				});
			});
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

			var parsedContentElem = $("<div>"+this.data.parsedTemplate+"</div>");

			this.addListener("templateParsed", function(params){
				$(parsedContentElem).html(realthis.data.parsedTemplate);
			});

			container.append(parsedContentElem);
		}


		widgetInstance.run = function(){
			var realthis = this;

			var parsed = this.processTemplate(this.widget.config.template);

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

module.exports.Manager = TemplateRendererWidget;