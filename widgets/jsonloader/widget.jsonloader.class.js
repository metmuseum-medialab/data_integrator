// this is a specific widget that does stuff, that the Thing can call

//var util = require("util");

function JsonLoaderWidget(){


	var BaseWidgetManager = require(GLOBAL.params.root_dir+"/classes/widget/widget.js").WidgetManager();


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
		widget.addListener("renderWidgetConfigEditBody_after", function(params){
			var widgetBody = params.container;
			var accordion = params.accordion;
			var thiswidget = params.widget;
			var ThingManager = require("./classes/thing/thing.js").ThingManager();

			// url entry widget
			var url = (thiswidget.config.url ? thiswidget.config.url : "");
			var input1 = $('<div class="input-group"><span class="input-group-addon">url</span><input type="text" class="form-control" value="'+url+'"></div>');
			$(input1).change(function(evt){
				var newurl = evt.target.value;
				thiswidget.config.url = newurl;
				var ThingManager = require("./classes/thing/thing.js").ThingManager();
				ThingManager.saveThingType(thiswidget.thingType, function(result){
					// do thing with result here
				});
			});
			$(".widgetConfig", accordion).append(input1);

		});


		
		if(callback){
			callback(widget);
		}
		return widget;



	}


	function decorateWidgetInstance(widgetInstance, callback){

		widgetInstance.renderWidgetInstancePageItemBody = function(container){
			var realthis = this;

			var urlcontent = $("<h5>"+this.widget.config.url+"</h5>");
			if(this.data.parsedUrl){
				$(urlcontent).text(this.data.parsedUrl);
			}
			var jsoncontent = $('<div class="panel-group" id="accordionJSON'+this.widget.uniqueName+'"><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordionJSON'+this.widget.uniqueName+'" href="#collapseOneJSON'+this.widget.uniqueName+'">JSON 	</a><span class="loadingindicator"/></h4></div><div id="collapseOneJSON'+this.widget.uniqueName+'" class="panel-collapse collapse"><div class="panel-body"><pre/></div></div></div>');
			container.append(urlcontent);
			container.append(jsoncontent);
			$(".loadingindicator", jsoncontent).text("loading...");
			this.addListener("dataUpdated", function(params){
				var url = realthis.data.parsedUrl;
				$(urlcontent).text(url);
				if(realthis.data.json){
					$(".loadingindicator", jsoncontent).text("loaded");
					$("pre",jsoncontent).text(JSON.stringify(realthis.data.json, null, 4));
				}
			});
		}


		widgetInstance.run = function(){
			var realthis = this;
			var url = this.processTemplate(this.widget.config.url);
			this.data.parsedUrl = url;
			this.fireEvent("dataUpdated", {widgetInstance : this});
			var proxy = require(GLOBAL.params.root_dir+"/classes/proxy/proxy.js").ProxyManager();
			
			proxy.callUrl(url, function(result){
				realthis.data.json = JSON.parse(result);
				realthis.fireEvent("dataUpdated", {widgetInstance : realthis});
				realthis.fireEvent("run", {widgetInstance : realthis});
			});		
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

module.exports.Manager = JsonLoaderWidget;