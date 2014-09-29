// this is a specific widget that does stuff, that the Thing can call

//var util = require("util");

function SolrWidget(){

	var BaseWidgetManager = require(GLOBAL.params.root_dir+"/classes/widget/widget.js").WidgetManager();


	function decorateWidgetType(widgetType, callback){
		widgetType.typeName = "Solr";
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

				label.click(function(target){

					var setval = $(target.currentTarget).attr('data-set');
					$(target.currentTarget).attr('data-set', (setval == "false" ? "true" : "false"));
					$(target.currentTarget).attr('class', 'label '+ (setval == "true" ? "label-default" : "label-success"));
					var depname = $(target.currentTarget).attr('data-name');
					console.log(depname);
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

				$(".widgetDependencies", accordion).append(label);


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


			this.addListener("dataUpdated", function(params){
			});
		}


		widgetInstance.run = function(){
			var realthis = this;
			
		}


		widgetInstance.init = function(){
			// to run when this widget is loaded
			realThis = this;
			console.log("this widgetInstance Loaded, Solr");
		}

		widgetInstance.allLoaded = function(params){
			console.log("all WidgetInstances Loaded, Solr");
//			this.run();
		//	widgetInstance.data.random = Math.random();
		};


		widgetInstance.sendToSolr = function(){
			// this should be happening server-side.
			console.log("sending to Solr");

			var solr = require("solr-client");

			var client = solr.createClient();

			// Switch on "auto commit", by default `client.autoCommit = false`
			client.autoCommit = true;
			var docs = [];
			for (var depname in this.widget.config.widgetDependencies){
				var dep = this.thing.widgetInstances[depname].data;
				console.log("got dep" + depname);
				console.log(dep);
				docs.push(dep);

			}
			// Add documents
			client.add(docs,function(err,obj){
			   if(err){
			      console.log(err);
			   }else{
			      console.log(obj);
			   }
			});

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

		registerServerSideFunctions : function(){
			return  {
				GET : {
					solrIndex : {
						match : /^\/solrIndex\//,
						theFunction : function(req, res){
							console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
							console.log("calling solrIndex The registerServerSideFunctions");

							var urlparser = require("urlparser");
							var parsed = urlparser.parse(req.url);
							var path = parsed.path.base;

							var split = path.split("/");
							split.shift();

							var fullId = split.join("/");

							console.log(split);

							var entityType = split.shift();
							var entity = false;
							var	thingTypeName = split.shift();
							var	entityId = split.shift();

							var uniqueWidgetName = split.shift();

							var entityManager = require(GLOBAL.params.root_dir+"/classes/entity/entity").EntityManager();
						    console.log(entityId);

						    function callback(entity){
						    	console.log("got entity");
						    	console.log(entity.widgetInstances);
						    	entity.widgetInstances[uniqueWidgetName].sendToSolr();
						    }

							entityManager.generateEntity(fullId, callback);



						}
					}
				}
			}
		}

	}


	return Manager;

}

module.exports.Manager = SolrWidget;