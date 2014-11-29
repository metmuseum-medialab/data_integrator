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


	var BaseWidgetManager = require(GLOBAL.params.root_dir+"/classes/widget/widget.js").WidgetManager();


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
		widget.renderWidgetConfigEditBody  = function (widgetBody){
			var ThingManager = require("./classes/thing/thing.js").ThingManager();

			// making an accordian for different parts of config.

			var accordion = $('<div class="panel-group" id="accordion'+this.uniqueName+'">' +
'  <div class="panel panel-default">' +
'    <div class="panel-heading">' +
'      <h4 class="panel-title">' +
'        <a data-toggle="collapse" data-parent="#accordion'+this.uniqueName+'" href="#collapseOne'+this.uniqueName+'">' +
'          Dependencies' +
'        </a>' +
'      </h4>' +
'    </div>' +
'    <div id="collapseOne'+this.uniqueName+'" class="panel-collapse collapse in">' +
'      <div class="panel-body widgetDependencies">' +
'      </div>' +
'    </div>' +
'  </div>' +
'  <div class="panel panel-default">' +
'    <div class="panel-heading">' +
'     <h4 class="panel-title">' +
'        <a data-toggle="collapse" data-parent="#accordion'+this.uniqueName+'" href="#collapseTwo'+this.uniqueName+'">' +
'          Layout' +
'        </a>' +
'      </h4>' +
'    </div>' +
'    <div id="collapseTwo'+this.uniqueName+'" class="panel-collapse collapse">' +
'      <div class="panel-body widgetLayout">' +
'      </div>' +
'    </div>' +
'  </div>' +
'  <div class="panel panel-default">' +
'    <div class="panel-heading">' +
'      <h4 class="panel-title">' +
'        <a data-toggle="collapse" data-parent="#accordion'+this.uniqueName+'" href="#collapseThree'+this.uniqueName+'">' +
'          Configuration ' +
'        </a>' +
'      </h4>' +
'    </div>' +
'    <div id="collapseThree'+this.uniqueName+'" class="panel-collapse collapse">' +
'      <div class="panel-body widgetConfig">' +
'      </div>' +
'   </div>' +
'  </div>' +
'</div>');


			var form = $("<div></div>")
			$(widgetBody).append(accordion);			


			// other widget dependency dropdown
			var widgetDependencies = (this.config.widgetDependencies ? this.config.widgetDependencies : {});
			this.config.widgetDependencies = widgetDependencies;
			var wdInput = $('');
			var defaultWidgets = this.thingType.defaultWidgets;

			var realthis = this;

			for(var index in defaultWidgets){

				var defaultWidget= defaultWidgets[index];
				var name = defaultWidget.uniqueName;
				if(name == this.uniqueName){ continue;}

				var classname = 'label-default';
				var set = false;
				if(this.config.widgetDependencies[name]){
					classname = 'label-success';
					set = true;
				}

				var label = $("<span class='label "+classname+"' data-set='"+set+"' data-name='"+name+"'>"+ name+"</span>");
				$(".widgetDependencies", accordion).append(label);

				label.click(function(target){
					var setval = $(target.currentTarget).attr('data-set');
					$(target.currentTarget).attr('data-set', (setval == "false" ? "true" : "false"));
					$(target.currentTarget).attr('class', 'label '+ (setval == "true" ? "label-default" : "label-success"));
					var depname = $(target.currentTarget).attr('data-name');
					if(setval == "false"){
						// setting to true, so set it
						realthis.config.widgetDependencies[depname] = depname;
					}else{
						// otherwise, remove it
						delete realthis.config.widgetDependencies[depname];
					}
					var ThingManager = require("./classes/thing/thing.js").ThingManager();
					ThingManager.saveThingType(realthis.thingType, function(result){
						// do thing with result here
					});

				});

			}


			// layout width config
			var layoutWidth = (this.config.layoutWidth ? this.config.layoutWidth : "4");
			var input2 = $('<div class="dropdown"><a data-toggle="dropdown" href="#">Layout: <span class="layoutWidthValue">'+layoutWidth+'</a><ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"></ul></div>');
			for(i = 1; i<=12 ;i++){
				$(".dropdown-menu", input2).append("<li data-value='"+i+"'>"+i+"</li>");
			}
			var thiswidget = this;
			$("li", input2).click(function(evt){
				var newWidth = $(evt.target).attr('data-value');
//				console.lgo()
				thiswidget.config.layoutWidth = newWidth;
				ThingManager.saveThingType(thiswidget.thingType, function(result){
					$('.layoutWidthValue', input2).text(newWidth);
					// do thing with result here
				});
			});	
			$(".widgetLayout", accordion).append(input2);



			// template design widget
			var templatestring = (this.config.template ? this.config.template : "");
			this.config.template = templatestring;
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
					thiswidget.config.template = $(editorElem).val();
					templatestring = thiswidget.config.template;
					ThingManager.saveThingType(thiswidget.thingType, function(result){
						// do thing with result here
					});
					$('#allPurposeModalLarge').off('hide.bs.modal');


				});

			});



/*
// when the template is saved set the data into thte config, save it, etc.
				ThingManager.saveThingType(thiswidget.thingType, function(result){
					// do thing with result here
				});
*/


		}
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