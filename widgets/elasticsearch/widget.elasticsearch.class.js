// this is a specific widget that does stuff, that the Thing can call

//var util = require("util");

function ElasticSearchWidget(){

	var BaseWidgetManager = require(GLOBAL.params.require_prefix+"/classes/widget/widget.js").WidgetManager();


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
		widget.addListener("renderWidgetConfigEditBody_after", function(params){
			var widgetBody = params.container;
			var accordion = params.accordion;
			var thiswidget = params.widget;
			var ThingManager = require(GLOBAL.params.require_prefix+"/classes/thing/thing.js").ThingManager();

			// currently no config fields in this widget, nothing to do here
		});

		if(callback){
			callback(widget);
		}
		return widget;



	}


	function decorateWidgetInstance(widgetInstance, callback){

		widgetInstance.renderWidgetInstancePageItemBody = function(container){
			var realthis = this;

			var indicator = GLOBAL.$("<span class='elasticloadingindicator'>waiting on data...</span>");
			container.append(indicator);

			this.addListener("preRun", function(params){
				GLOBAL.$(indicator).text("sending to elasticsearch...");

			});

			this.addListener("dataUpdated", function(params){
				GLOBAL.$(indicator).text("indexed in elasticsearch: " + params.status + (params.message ? " : " + params.message : ""));
			});
		}


		// this won't run until dependencies have run.
		widgetInstance.run = function(){
			console.log("running elasticsearch.run");
			var realthis = this;

			this.fireEvent("preRun");

			if(GLOBAL.context == 'client'){

				// call the server-side version of this code, to index to elasticsearch.
				var path = "elasticSearchIndex/thing/"+this.thing.type.typeName+"/"+this.thing.id+"/"+ this.widget.uniqueName;

				GLOBAL.$.ajax({
					url : path,
					type : "GET",
					contentType : 'application/json',
			  		success : function(rdata, status){
			  			realthis.fireEvent("dataUpdated", {status : status});
						realthis.fireEvent("run", {widgetInstance : realthis});
			  		},
			  		error : function(jqXHR, status, message){
			  			console.log("error !!!!  ");
			  			console.log(status);
			  		//	console.log(message);
			  			realthis.fireEvent("dataUpdated", {status : status, message : message});
			  		}
				});
			}else{
				this.sendToElasticSearch(function(){
					console.log("sent to elasticsearch");
		  			realthis.fireEvent("dataUpdated", {status : true});
					realthis.fireEvent("run", {widgetInstance : realthis});

				});
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
			   //   console.log(err);
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

							var entityManager = require(GLOBAL.params.require_prefix+"/classes/entity/entity.js").EntityManager();

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