// this is a specific widget that does stuff, that the Thing can call

//var util = require("util");

/*
<!-- 
	 curl --data "html=<html>hi</html>&javascript=&css=" http://localhost:3100/api/save
{
  "html": "<html>hi</html>",
  "settings": "{ processors: {} }",
  "length": 7,
  "url": "jop",
  "revision": 1,
  "streamingKey": "41ae2c47b6bf52027b24d15943128752",
  "id": 12,
  "summary": "hi"
127.0.0.1 - - [Mon, 10 Nov 2014 03:49:15 GMT] "POST /api/save HTTP/1.1" 200 200 "-" "curl/7.30.0"
-->



*/

function JsBinWidget(){


	var BaseWidgetManager = require(GLOBAL.params.require_prefix+"/classes/widget/widget.js").WidgetManager();


	function decorateWidgetType(widgetType, callback){
		widgetType.typeName = "JsBin";
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

			// jsbin design widget
			var templatestring = (thiswidget.config.template ? thiswidget.config.template : "");
			thiswidget.config.template = templatestring;
			var input1 = GLOBAL.$('<h5>Open Editor</h5>');
			GLOBAL.$(".widgetConfig", accordion).append(input1);
			GLOBAL.$(input1).click(function(evt){
				GLOBAL.$('#allPurposeModalLarge .modal-header').html('<h4>Edit Content</h4>');
				var editorElem = GLOBAL.$('<textarea></textarea>');
				GLOBAL.$('#allPurposeModalLarge .modal-body').html(editorElem);
				GLOBAL.$('#allPurposeModalLarge').modal('show');
				GLOBAL.$('#allPurposeModalLarge').off('hide.bs.modal');
				GLOBAL.$(editorElem).ckeditor(function(elem){},
										{
											baseFloatZIndex : 9000,
										});
				GLOBAL.$(editorElem).val(templatestring);

				GLOBAL.$('#allPurposeModalLarge').on('hide.bs.modal', function(evt){
					var ThingManager = require(GLOBAL.params.require_prefix+"/classes/thing/thing.js").ThingManager();

					thiswidget.config.template = GLOBAL.$(editorElem).val();
					templatestring = thiswidget.config.template;
					ThingManager.saveThingType(thiswidget.thingType, function(result){
						// do thing with result here
					});
					GLOBAL.$('#allPurposeModalLarge').off('hide.bs.modal');


				});

			});



/*
// when the template is saved set the data into thte config, save it, etc.
				ThingManager.saveThingType(thiswidget.thingType, function(result){
					// do thing with result here
				});
*/


		});
		if(callback){
			callback(widget);
		}
		return widget;



	}


	function decorateWidgetInstance(widgetInstance, callback){

		widgetInstance.renderWidgetInstancePageItemBody = function(container){
			var realthis = this;

			var parsedContentElem = GLOBAL.$("<div>"+this.data.parsedTemplate+"</div>");

			this.addListener("templateParsed", function(params){
				GLOBAL.$(parsedContentElem).html(realthis.data.parsedTemplate);
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

module.exports.Manager = JsBinWidget;