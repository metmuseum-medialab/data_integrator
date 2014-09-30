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
		widget.renderWidgetConfigEditBody  = function (widgetBody){

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
					var setval = $(target.currentTarget).attr('data-set');
					$(target.currentTarget).attr('data-set', (setval == "false" ? "true" : "false"));
					$(target.currentTarget).attr('class', 'label '+ (setval == "true" ? "label-default" : "label-success"));
					var depname = $(target.currentTarget).attr('data-name');
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
					var ThingManager = require("./classes/thing/thing.js").ThingManager();
					ThingManager.saveThingType(realthis.thingType, function(result){
						// do thing with result here
						console.log(result);
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
				console.log("got result");
				console.log(result);
				realthis.data.json = JSON.parse(result);
				console.log("back from callUrl");
				realthis.fireEvent("dataUpdated", {widgetInstance : realthis});
				realthis.fireEvent("run", {widgetInstance : realthis});
			});		
		}


		widgetInstance.init = function(){
			// to run when this widget is loaded
			realThis = this;
			console.log("this widgetInstance Loaded, jsonloader");
		}

		widgetInstance.allLoaded = function(params){
			console.log("all WidgetInstances Loaded, jsonloader");
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