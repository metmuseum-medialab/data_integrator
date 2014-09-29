// this is a specific widget that does stuff, that the Thing can call

//var util = require("util");

function TemplateRendererWidget(){


	var BaseWidgetManager = require(GLOBAL.params.root_dir+"/classes/widget/widget.js").WidgetManager();


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
			console.log(defaultWidgets);

			var realthis = this;

			for(var index in defaultWidgets){

				var defaultWidget= defaultWidgets[index];
				console.log(defaultWidget);
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
					var setval = $(label).attr('data-set');
					$(label).attr('data-set', (setval == "false" ? "true" : "false"));
					$(label).attr('class', 'label '+ (setval == "true" ? "label-default" : "label-success"));
					var depname = $(label).attr('data-name');
					if(setval == "false"){
						// setting to true, so set it
						console.log("adding " + depname);
						realthis.config.widgetDependencies[depname] = depname;
					}else{
						// otherwise, remove it
						console.log("removing" + depname);
						delete realthis.config.widgetDependencies[depname];
					}
					console.log(realthis.config.widgetDependencies);
					ThingManager.saveThingType(realthis.thingType, function(result){
						// do thing with result here
						console.log(result);
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
					console.log("hiding");
					console.log($(editorElem).val());
					thiswidget.config.template = $(editorElem).val();
					console.log(ThingManager);
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
			console.log("this widgetInstance Loaded, templaterenderer");
		}

		widgetInstance.allLoaded = function(params){
			console.log("all WidgetInstances Loaded, templaterenderer");
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