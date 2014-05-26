// this is a specific widget that does stuff, that the Thing can call

//var util = require("util");

function JsonLoaderWidget(){


	var BaseWidgetManager = require("./classes/widget.class.js").WidgetManager();


	function decorateWidgetType(widgetType, callback){
		widgetType.typeName = "JsonLoader";
		/*
		CODE TO ADD FUNCTIONALITY GOES HERE, I THINK 
		*/
		widgetType.onLoad = function(widgetInstance){
			// to run when this widget is loaded
			console.log("this widgetInstance Loaded, jsonloader");
		};

		widgetType.allLoaded = function(widgetInstance){
			console.log("all WdigetInstances Loaded, jsonloader");
		//	widgetInstance.data.random = Math.random();
		};

		if(callback){
			callback(widgetType);
		}
		return widgetType;

	}

	function decorateWidget(widget, callback){
		widget.renderWidgetConfigEditBody  = function (widgetBody){

			// making an accordian for different parts of config.

			var form = $("<div></div>")
			$(widgetBody).append(form);			

			var url = (this.config.url ? this.config.url : "");
			var input1 = $('<div class="input-group"><span class="input-group-addon">url</span><input type="text" class="form-control" value="'+url+'"></div>');
			var thiswidget = this;
			$(input1).change(function(evt){
				var newurl = evt.target.value;
				thiswidget.config.url = newurl;
				var ThingManager = require("./classes/thing.class.js").ThingManager();
				ThingManager.saveThingType(thiswidget.thingType, function(result){
					// do thing with result here
				});
			});

			$(form).append(input1);

			var layoutWidth = (this.config.layoutWidth ? this.config.layoutWidth : "3");
			var input2 = $('<div class="dropdown"><a data-toggle="dropdown" href="#">Layout: <span class="layoutWidthValue">'+layoutWidth+'</a><ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"></ul></div>');


			for(i = 1; i<=12 ;i++){
				$(".dropdown-menu", input2).append("<li data-value='"+i+"'>"+i+"</li>");
			}
			var thiswidget = this;

			$("li", input2).click(function(evt){
				var newWidth = $(evt.target).attr('data-value');
//				console.lgo()
				thiswidget.config.layoutWidth = newWidth;
				var ThingManager = require("./classes/thing.class.js").ThingManager();
				ThingManager.saveThingType(thiswidget.thingType, function(result){
					$('.layoutWidthValue', input2).text(newWidth);
					// do thing with result here
				});
			});	

		

			$(form).append(input2);



		}
		if(callback){
			callback(widget);
		}
		return widget;



	}


	function decorateWidgetInstance(widgetInstance, callback){

		widgetInstance.renderWidgetInstancePageItemBody = function(container){
			console.log(this.widget.config);
			$(container).append("<h1>"+this.widget.config.url+"<BR>"+this.data.random+"</h1>")
		}

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