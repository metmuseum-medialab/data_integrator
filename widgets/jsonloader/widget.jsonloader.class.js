// this is a specific widget that does stuff, that the Thing can call

//var util = require("util");

function JsonLoaderWidget(){


	var BaseWidgetManager = require("./classes/widget/widget.js").WidgetManager();


	function decorateWidgetType(widgetType, callback){
		widgetType.typeName = "JsonLoader";
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

			// making an accordian for different parts of config.

			var accordion = $('<div class="panel-group" id="accordion">' +
'  <div class="panel panel-default">' +
'    <div class="panel-heading">' +
'      <h4 class="panel-title">' +
'        <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">' +
'          Dependencies' +
'        </a>' +
'      </h4>' +
'    </div>' +
'    <div id="collapseOne" class="panel-collapse collapse in">' +
'      <div class="panel-body widgetDependencies">' +
'      </div>' +
'    </div>' +
'  </div>' +
'  <div class="panel panel-default">' +
'    <div class="panel-heading">' +
'     <h4 class="panel-title">' +
'        <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">' +
'          Layout' +
'        </a>' +
'      </h4>' +
'    </div>' +
'    <div id="collapseTwo" class="panel-collapse collapse">' +
'      <div class="panel-body widgetLayout">' +
'      </div>' +
'    </div>' +
'  </div>' +
'  <div class="panel panel-default">' +
'    <div class="panel-heading">' +
'      <h4 class="panel-title">' +
'        <a data-toggle="collapse" data-parent="#accordion" href="#collapseThree">' +
'          Configuration ' +
'        </a>' +
'      </h4>' +
'    </div>' +
'    <div id="collapseThree" class="panel-collapse collapse">' +
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

				var label = $("<span class='label "+classname+"' data-set='"+set+"'>"+ name+"</span>");
				$(".widgetDependencies", accordion).append(label);

				label.click(function(target){
					var setval = $(label).attr('data-set');
					console.log(setval);
					$(label).attr('data-set', (setval == "false" ? "true" : "false"));
					$(label).attr('class', 'label '+ (setval == "true" ? "label-default" : "label-success"));

					if(setval == "false"){
						// setting to true, so set it
						realthis.config.widgetDependencies[name] = name;
					}else{
						// otherwise, remove it
						delete realthis.config.widgetDependencies[name];
					}
					var ThingManager = require("./classes/thing/thing.js").ThingManager();

					ThingManager.saveThingType(realthis.thingType, function(result){
						// do thing with result here
					});

				});

			}


			// url entry widget
			var url = (this.config.url ? this.config.url : "");
			var input1 = $('<div class="input-group"><span class="input-group-addon">url</span><input type="text" class="form-control" value="'+url+'"></div>');
			var thiswidget = this;
			$(input1).change(function(evt){
				var newurl = evt.target.value;
				thiswidget.config.url = newurl;
				var ThingManager = require("./classes/thing/thing.js").ThingManager();
				ThingManager.saveThingType(thiswidget.thingType, function(result){
					// do thing with result here
				});
			});
			$(".widgetConfig", accordion).append(input1);


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
				var ThingManager = require("./classes/thing/thing.js").ThingManager();
				ThingManager.saveThingType(thiswidget.thingType, function(result){
					$('.layoutWidthValue', input2).text(newWidth);
					// do thing with result here
				});
			});	

		

			$(".widgetLayout", accordion).append(input2);



		}
		if(callback){
			callback(widget);
		}
		return widget;



	}


	function decorateWidgetInstance(widgetInstance, callback){

		widgetInstance.renderWidgetInstancePageItemBody = function(container){
			var url = this.processTemplate(this.widget.config.url);
			$(container).append("<h1>"+url+"<BR></h1>");
		}


		widgetInstance.run = function(){
			console.log("in jsonloader, run");
			var realthis = this;
			var url = this.processTemplate(this.widget.config.url);
			var proxy = require("/classes/proxy/proxy.js").ProxyManager();
			proxy.callUrl(url, function(result){
				console.log("in widgetInstance, got result!");
				console.log(result);
				realthis.data.json = JSON.parse(result);
				console.log("in widgetInstance, got result!");
				console.log(realthis.data.json);
			});
			this.fireEvent("run", {widgetInstance : this});
		}


		widgetInstance.onLoad = function(){
			// to run when this widget is loaded
			realThis = this;
			this.thing.addListener("allWidgetInstancesLoaded", function(params){
				console.log("listener called");
				realThis.allLoaded(params);
			});
			console.log("this widgetInstance Loaded, jsonloader");
		}

		widgetInstance.allLoaded = function(params){
			console.log("all WidgetInstances Loaded, jsonloader");
			this.run();
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

module.exports.Manager = JsonLoaderWidget;