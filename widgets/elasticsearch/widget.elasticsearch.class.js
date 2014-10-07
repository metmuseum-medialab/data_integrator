// this is a specific widget that does stuff, that the Thing can call

//var util = require("util");

function ElasticSearchWidget(){

	var BaseWidgetManager = require(GLOBAL.params.root_dir+"/classes/widget/widget.js").WidgetManager();


	function decorateWidgetType(widgetType, callback){
		widgetType.typeName = "ElasticSearch";
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

			var indicator = $("<span class='elasticloadingindicator'>waiting on data...</span>");
			container.append(indicator);

			this.addListener("preRun", function(params){
				$(indicator).text("sending to elasticsearch...");

			});

			this.addListener("dataUpdated", function(params){
				$(indicator).text("indexed in elasticsearch: " + params.status + (params.message ? " : " + params.message : ""));
			});
		}


		// this won't run until dependencies have run.
		widgetInstance.run = function(){
			var realthis = this;

			this.fireEvent("preRun");

			if(GLOBAL.context == 'client'){

				// call the server-side version of this code, to index to elasticsearch.
				var path = "/elasticSearchIndex/thing/"+this.thing.type.typeName+"/"+this.thing.id+"/"+ this.widget.uniqueName;

				$.ajax({
					url : path,
					type : "GET",
					contentType : 'application/json',
			  		success : function(rdata, status){
			  			realthis.fireEvent("dataUpdated", {status : status});
			  		},
			  		error : function(jqXHR, status, message){
			  			console.log("error !!!!  ");
			  			console.log(status);
			  			console.log(message);
			  			realthis.fireEvent("dataUpdated", {status : status, message : message});
			  		}
				});
			}else{
		//		this.sendToElasticSearch();
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


		widgetInstance.sendToElasticSearch = function(escallback){
			// this should be happening server-side.

			var elasticsearch = require('elasticsearch');
			var eclient = new elasticsearch.Client({
			  host: 'localhost:9200',
			  log: 'trace'
			});

			var docs = { 	
				index : "mainindex",
				type : this.thing.type.typeName,
				id : this.thing.id,
				body : {}
			};
			for (var depname in this.widget.config.widgetDependencies){
				var dep = this.thing.widgetInstances[depname].data;
				docs.body[depname] = dep;

			}
			// Add documents
			eclient.index(docs,function(err,obj){
			   if(err){
			   		console.log("submit elastic error");
			      console.log(err);
			      	escallback({error: true , success: false, message : err});
			   }else{
			      	escallback({error: false, success: true, message: obj});
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
					elasticSearchIndex : {
						match : /^\/elasticSearchIndex\//,
						theFunction : function(req, res){
							console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
							console.log("calling elasticSearchIndex The registerServerSideFunctions");

							var urlparser = require("urlparser");
							var parsed = urlparser.parse(req.url);
							var path = parsed.path.base;

							var split = path.split("/");
							split.shift();
							var uniqueWidgetName = split.pop();

							var fullId = split.join("/");

							var entityType = split.shift();
							var entity = false;
							var	thingTypeName = split.shift();
							var	entityId = split.shift();

							var entityManager = require(GLOBAL.params.root_dir+"/classes/entity/entity").EntityManager();

						    function callback(entity){

						    	var widgetInstance = entity.widgetInstances[uniqueWidgetName];
						    	var widget = widgetInstance.widget;

							    var numDeps = Object.keys(widget.config.widgetDependencies).length;
							    var depsRun = 0;


							    esCallback = function(esResult){
   						           var contentType = "application/json";
							       res.writeHead(200, {'Content-Type': contentType});
						           res.end(JSON.stringify(esResult));
							    }

				    			for (var depname in widget.config.widgetDependencies){
									var dep = entity.widgetInstances[depname];
									dep.addListener("run", function(){
										depsRun++;
										if(numDeps == depsRun){
									    	entity.widgetInstances[uniqueWidgetName].sendToElasticSearch(esCallback);
										}
									});
						    	};
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

module.exports.Manager  = ElasticSearchWidget;