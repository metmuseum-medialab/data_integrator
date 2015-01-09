// this is a specific widget that does stuff, that the Thing can call

//var util = require("util");

function OpenCVWidget(){


	var BaseWidgetManager = require(GLOBAL.params.require_prefix+"/classes/widget/widget.js").WidgetManager();


	function decorateWidgetType(widgetType, callback){
		widgetType.typeName = "OpenCV";
		/*
		CODE TO ADD FUNCTIONALITY GOES HERE, I THINK 
		*/
		widgetType.cascaderUrl  = "http://66.175.215.36/cascader/";

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
			var ThingManager = require(GLOBAL.params.require_prefix+"/classes/thing/thing.js").ThingManager();

			// url entry widget
			var imageUrl = (thiswidget.config.imageUrl ? thiswidget.config.imageUrl : "");
			var input1 = GLOBAL.$('<div class="input-group"><span class="input-group-addon">url</span><input type="text" class="form-control" value="'+imageUrl+'"></div>');
			GLOBAL.$(input1).change(function(evt){
				var newurl = evt.target.value;
				thiswidget.config.imageUrl = newurl;
				var ThingManager = require(GLOBAL.params.require_prefix+"/classes/thing/thing.js").ThingManager();
				ThingManager.saveThingType(thiswidget.thingType, function(result){
					// do thing with result here
				});
			});
			GLOBAL.$(".widgetConfig", accordion).append(input1);

		});


		
		if(callback){
			callback(widget);
		}
		return widget;



	}


	function decorateWidgetInstance(widgetInstance, callback){

		widgetInstance.renderWidgetInstancePageItemBody = function(container){
			var realthis = this;

			var urlcontent = GLOBAL.$("<h5>"+this.widget.config.imageUrl+"</h5>");
			if(this.data.parsedUrl){
				GLOBAL.$(urlcontent).text(this.data.parsedUrl);
			}
			var jsoncontent = GLOBAL.$('<div class="panel-group" id="accordionJSON'+this.widget.uniqueName+'"><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordionJSON'+this.widget.uniqueName+'" href="#collapseOneJSON'+this.widget.uniqueName+'">JSON 	</a><span class="loadingindicator"/></h4></div><div id="collapseOneJSON'+this.widget.uniqueName+'" class="panel-collapse collapse"><div class="panel-body"><pre/></div></div></div>');
			container.append(urlcontent);
			container.append(jsoncontent);
			GLOBAL.$(".loadingindicator", jsoncontent).text("loading...");
			this.addListener("dataUpdated", function(params){
				var url = realthis.data.parsedUrl;
				GLOBAL.$(urlcontent).text(url);
				if(realthis.data.json){
					GLOBAL.$(".loadingindicator", jsoncontent).text("loaded");
					GLOBAL.$("pre",jsoncontent).text(JSON.stringify(realthis.data.json, null, 4));
				}
			});
		}


		widgetInstance.run = function(){
			var realthis = this;
			var imageUrl = "";

			if(this.widget.config.imageUrl){
				imageUrl = this.processTemplate(this.widget.config.imageUrl);
				this.data.parsedUrl = imageUrl;
				this.fireEvent("dataUpdated", {widgetInstance : this});
				var proxy = require(GLOBAL.params.require_prefix+"/classes/proxy/proxy.js").ProxyManager();
				
				var url = this.widget.widgetType.cascaderUrl + "?imageurl="+encodeURIComponent(imageUrl);
				console.log("calling url " + url);
				proxy.callUrl(url, function(result){
					// hm , if this fails, then we need to deal with it in a smart way, so dependancies don't get confused as well.
					// basically, if this fails, then dependant widgets need to handle it gracefully.
					// should they not run, or just anticipate the possibility of null results?
					if(result.trim() != "Not Found"){
						realthis.data.json = JSON.parse(result);
					}
					realthis.fireEvent("dataUpdated", {widgetInstance : realthis});
					realthis.fireEvent("run", {widgetInstance : realthis});
				});
			}else{
				realthis.fireEvent("dataUpdated", {widgetInstance : realthis});
				realthis.fireEvent("run", {widgetInstance : realthis});

			}
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

module.exports.Manager = OpenCVWidget;