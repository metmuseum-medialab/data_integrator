

// a widget is attached to a THING, and does stuff. All widgets have common methods that the thing can call when assembling them
// a thing might have multiple widgets of the same type, with different data attached to it.

function WidgetManager(){


	var baseWidgetType = false;
	function getBaseWidgetType(){
		// the WidgetType defines what the Widget can DO : it has the FUNCTIONS


		if(baseWidgetType){
			return baseWidgetType;
		}
		var baseWidgetType =  {
			typeName : false,
			category : "WidgetType",
			id : false,


		};

		return baseWidgetType;
	}


	var baseWidget = false;
	function getBaseWidget(){
		// the widget defines how the widget will behave in a certain context. It has the CONFIG
		if(baseWidget){
			return baseWidget;
		}
		var baseWidget = {
			// everything that relates to the presence of a widget of this type on a thing of a particular type
			// ie.: the "art object thing" will get 3 "UrlLoader" widgets. That counts as 3 Widgets, each with theri own config.
			category : "Widget",
			widgetType : false, // points to teh widgetType object
			thingType : false, // the thingType this particular widget is attached to
			config : {},
			id : false,
			uniqueName : false,


			listeners : {},

			addListener : function(listenerName, callback){
				if(!this.listeners[listenerName]){
					this.listeners[listenerName] = [];
				}
				this.listeners[listenerName].push(callback);
			},

			fireEvent : function(listenerName, params){
				var async = require("async");
				if(this.listeners[listenerName]){
					async.each(this.listeners[listenerName], function(listenerCallback, callback){
						listenerCallback(params);
						callback()
					},function(err){
						if(err){
							console.log("error happened in callback");
						}
					}
					);
				}
			},


			setConfig : function(config){
				this.config = config; 
			},

			setUniqueName : function(name){
				// make sure it's unique for all widgets in this thingL
				if(!this.thingType.hasWidgetNamed(name)){
					this.uniqueName = name;
					return true;
				}
				return false;
			},


			saveConfig : function(){


			},


			createWidgetInstance : function(thing){
				// create a widget instance and attach it to the provided thing (?)

			}
		}
		return baseWidget;
	}


	function attachBaseWidgetRenderCode(widget){


		widget.renderWidgetConfigEdit = function (widgetHeader, widgetBody, widgetFooter){
			this.renderWidgetConfigEditFooter(widgetFooter);
			this.renderWidgetConfigEditHeader(widgetHeader);
			this.renderWidgetConfigEditBody(widgetBody);
		},



		widget.renderWidgetConfigEditFooter = function(container){
			var deletebutton = GLOBAL.$('<button type="button" class="btn btn-default btn-md"><span class="glyphicon glyphicon-trash"></span> Remove</button>');
			GLOBAL.$(container).append(deletebutton);

			thewidget = this;
			deletebutton.click(function(){
				thewidget.thingType.removeDefaultWidget(widget.uniqueName);
				var ThingManager = require(GLOBAL.params.require_prefix+"/classes/thing/thing.js").ThingManager();

				ThingManager.saveThingType(thewidget.thingType, function(result){
					// do thing with result here
				});

			});
		};

		widget.renderWidgetConfigEditHeader = function(container){
			GLOBAL.$(container).append("<h4>"+ this.widgetType.typeName  + " : " +  this.uniqueName);
		};

		widget.renderWidgetConfigEditBody = function(container){
			this.fireEvent("renderWidgetConfigEditBody_before", {container : container});


			var accordion = GLOBAL.$('<div class="panel-group" id="accordion'+this.uniqueName+'">' +
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


			var form = GLOBAL.$("<div></div>")
			GLOBAL.$(container).append(accordion);			


			// other widget dependency dropdown
			var widgetDependencies = (this.config.widgetDependencies ? this.config.widgetDependencies : {});
			this.config.widgetDependencies = widgetDependencies;
			var wdInput = GLOBAL.$('');
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

				var label = GLOBAL.$("<span class='label "+classname+"' data-set='"+set+"' data-name='"+name+"'>"+ name+"</span>");
				GLOBAL.$(".widgetDependencies", accordion).append(label);

				label.click(function(target){
					var setval = GLOBAL.$(target.currentTarget).attr('data-set');
					GLOBAL.$(target.currentTarget).attr('data-set', (setval == "false" ? "true" : "false"));
					GLOBAL.$(target.currentTarget).attr('class', 'label '+ (setval == "true" ? "label-default" : "label-success"));
					var depname = GLOBAL.$(target.currentTarget).attr('data-name');
					if(setval == "false"){
						// setting to true, so set it
						realthis.config.widgetDependencies[depname] = depname;
					}else{
						// otherwise, remove it
						delete realthis.config.widgetDependencies[depname];
					}
					var ThingManager = require(GLOBAL.params.require_prefix+"/classes/thing/thing.js").ThingManager();
					ThingManager.saveThingType(realthis.thingType, function(result){
						// do thing with result here
					});

				});

			}


			// layout width config
			var layoutWidth = (this.config.layoutWidth ? this.config.layoutWidth : "4");
			var input2 = GLOBAL.$('<div class="dropdown"><a data-toggle="dropdown" href="#">Layout: <span class="layoutWidthValue">'+layoutWidth+'</a><ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"></ul></div>');
			for(i = 1; i<=12 ;i++){
				GLOBAL.$(".dropdown-menu", input2).append("<li data-value='"+i+"'>"+i+"</li>");
			}
			var thiswidget = this;
			GLOBAL.$("li", input2).click(function(evt){
				var newWidth = GLOBAL.$(evt.target).attr('data-value');
//				console.lgo()
				thiswidget.config.layoutWidth = newWidth;
				ThingManager.saveThingType(thiswidget.thingType, function(result){
					GLOBAL.$('.layoutWidthValue', input2).text(newWidth);
					// do thing with result here
				});
			});	
			GLOBAL.$(".widgetLayout", accordion).append(input2);


			this.fireEvent("renderWidgetConfigEditBody_after", {widget: this, container : container, accordion : accordion});
		};

	}


	var baseWidgetInstance = false;
	function getBaseWidgetInstance(){
		// the widetInstance defines the contents and state of a widget as attached to a specific THING. 
		// it hs the DATA
		if(baseWidgetInstance){
			return baseWidgetInstance;
		}
		var baseWidgetInstance = {
			category : "WidgetInstance",
			widget : false,
			thing : false, // the thing this particular widgetinstance is attached to.
			id : false,
			data : {},


			listeners : {},

			addListener : function(listenerName, callback){
				if(!this.listeners[listenerName]){
					this.listeners[listenerName] = [];
				}
				this.listeners[listenerName].push(callback);
			},


			fireEvent : function(listenerName, params){
				if(this.listeners[listenerName]){
					GLOBAL.$.each(this.listeners[listenerName], function(index, callback){
						callback(params);
					});
				}
			},			

			init  : function(widgetInstance){
				// to run when this widget is loaded
			},

			loadData : function(){
				// we'll assume couchdb for now
			},

			saveData : function(){

			},


			processTemplate : function(templateString, callback){
				var dot = require("dot");
				var deps = {};
				for (var depname in this.widget.config.widgetDependencies){
					deps[depname] = this.thing.widgetInstances[depname].data;
				}
				console.log(templateString);

				var Entities = require("html-entities").AllHtmlEntities;
				var entities = new Entities();

				// because content inside dot syntax might have been html-ified, we need to un-htmlify it before it gets processed.
				var replaced = templateString.replace(/\{\{([^\}\}]+)\}\}/g, function(){
					var decoded = entities.decode(arguments[0])
					return decoded;
				});
				console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
				console.log(replaced);
				// removing wierd characters
//				var re = /[\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]/g;

				replaced = replaced.replace(/\x{e2808b}/, "xxxx");

				templateString = replaced;

				var tpldata = {thing: this.thing, config: this.widget.config, data : this.data, deps: deps};
				console.log(tpldata);
				var tplfn = dot.template(templateString);
				var string = tplfn(tpldata);
				if(callback){
					callback(string);
				}
				return string;
			}

		};
		return baseWidgetInstance;
	}


	function attachBaseWidgetInstanceRenderCode(widgetInstance){


		widgetInstance.renderWidgetInstancePageItem = function (widgetInstanceHeader, widgetInstanceBody, widgetInstanceFooter){
			this.renderWidgetInstancePageItemFooter(widgetInstanceFooter);
			this.renderWidgetInstancePageItemHeader(widgetInstanceHeader);
			this.renderWidgetInstancePageItemBody(widgetInstanceBody);
		},



		widgetInstance.renderWidgetInstancePageItemFooter = function(container){
		};

		widgetInstance.renderWidgetInstancePageItemHeader = function(container){
			GLOBAL.$(container).append("<h4>"+ widgetInstance.widget.widgetType.typeName  + " : " +  widgetInstance.widget.uniqueName);
		};

		widgetInstance.renderWidgetInstancePageItemBody = function(container){
			var configEdit = GLOBAL.$("<div>renderWidgetInstance not set up for this widget</div>");
			GLOBAL.$(container).append(configEdit);
		};

	}



	var  Manager = {

		widgetDir : "widgets",

		getBaseWidgetType : getBaseWidgetType,
		getBaseWidget : getBaseWidget,
		getBaseWidgetInstance : getBaseWidgetInstance,
		attachBaseWidgetRenderCode : attachBaseWidgetRenderCode,
		attachBaseWidgetInstanceRenderCode : attachBaseWidgetInstanceRenderCode,

		createWidgetType : function(typeName){
			base = this.getBaseWidgetType();
			var widgetType = Object.create(base);

			var manager = require(GLOBAL.params.require_prefix+"/widgets/"+typeName.toLowerCase()+"/widget."+typeName.toLowerCase()+".class.js").Manager();

			var widgetType = manager.decorateWidgetType(widgetType, false);
			return widgetType;
		},


		createWidget : function(typeName, uniqueName){
			var path = GLOBAL.params.require_prefix+"/widgets/"+typeName.toLowerCase()+"/widget."+typeName.toLowerCase()+".class.js";
			console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
			console.log(path);
			var manager = require(path).Manager();

			var widgetType = this.createWidgetType(typeName);

			base = this.getBaseWidget();
			var widget = Object.create(base);
			this.attachBaseWidgetRenderCode(widget);
			widget.widgetType = widgetType;
			widget.uniqueName = uniqueName;			
			widget.widgetType = widgetType;

			var widget = manager.decorateWidget(widget, false);
			return widget;
		},
		attachWidgetData : function(widget, data){
			widget.uniqueName = data.uniqueName;
			widget.config = data.config;
		},

		createWidgetInstance : function(thing, widget, data){
			var typeName = widget.widgetType.typeName;
			var uniqueName = widget.uniqueName;

			var manager = require(GLOBAL.params.require_prefix+"/widgets/"+typeName.toLowerCase()+"/widget."+typeName.toLowerCase()+".class.js").Manager();

			base = this.getBaseWidgetInstance();
			var widgetInstance = Object.create(base);

			this.attachBaseWidgetInstanceRenderCode(widgetInstance);
			widgetInstance.widget = widget;
			widgetInstance.thing = thing;
			widgetInstance = manager.decorateWidgetInstance(widgetInstance, false);

			if(data){
				widgetInstance.data = data;
			}

			return widgetInstance;			
		},

		attachWidgetInstanceData :  function(widgetInstance, data){
			widgetInstance.data = data;

		},

		serializeWidget : function(widget){
			var doc = {};
			doc.uniqueName = widget.uniqueName;
			doc.widgetType = widget.widgetType;
			doc.config = widget.config;
			return doc;
		},

		deserializeWidget : function(widget, doc){
			widget.uniqueName = doc.uniqueName;
			widget.widgetType = doc.widgetType;
			widget.config = doc.config;
		},

		renderWidget : function (widget, format){},



		// need to enable widgets to be able to register server-side urls,
		// so they can call code on the server that executes ... stuff.
		registerServerSideWidgetFunctions : function(callback){
			this.getWidgetList(function(widgetFileList){
				// go through list of widgets, and ask each one if it has any server-side functions
				callback(widgetFileList);

				var serverSideFunctions = {
					GET :{},
					PUT :{},
					POST :{},
				};

				GLOBAL.$.each(widgetFileList, function(typeName, file){
					var path = GLOBAL.params.require_prefix+"/widgets/"+typeName.toLowerCase()+"/widget."+typeName.toLowerCase()+".class.js";
					var manager = require(path).Manager();
					if(manager.registerServerSideFunctions){
						var theFunctions = manager.registerServerSideFunctions();
						GLOBAL.$.extend(serverSideFunctions.GET, theFunctions.GET);
						GLOBAL.$.extend(serverSideFunctions.PUT, theFunctions.PUT);
						GLOBAL.$.extend(serverSideFunctions.POST, theFunctions.POST);
					}
				});

				callback(serverSideFunctions);

//			var manager = require("./widgets/"+typeName+"/widget."+typeName+".class.js").Manager();



			});

		},


		getWidgetList : function(callback2){
			// this code will only run server-side
			// how to determine? if we can determine here, we can call the server and run this code, so other code can just call this class directly, regardless of where it's running.


			try{
				var fs= require("fs");
			}catch(error){
				console.log("calling with ajax");
				// we're on the client: call the server instead.
				GLOBAL.$.ajax({
					url : "./widgetlist" ,
					type : "GET",
				//	processData : false,
					contentType : 'json',
			  		success : function(rdata, status){
			  			callback2(rdata);
			  		},

			  		error : function(jqXHR, status, message){
			  			console.log("error ");
			  			console.log(status);
			  			console.log(message);
			  		}
				});		

				return;

			}

			var async = require("async");
			var filelist = fs.readdirSync(this.widgetDir);
			var realthis = this
			var newList = {};
			async.eachSeries(filelist, 
				function(file, callback){
				  var path = realthis.widgetDir +"/"+ file;
				  var stat = fs.statSync(path);
				  if(stat.isDirectory()){
					  newList[file] = {file: file};
					  newList[file].stat = stat;
				  }
				  callback();
				},
				function(){
				  callback2(newList);
				}
			);
		},

	}

	return Manager;

}

module.exports.WidgetManager = WidgetManager;