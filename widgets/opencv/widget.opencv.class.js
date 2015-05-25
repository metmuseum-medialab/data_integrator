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
			var imagecontent = GLOBAL.$('<div class="panel-group" id="accordionJSON'+this.widget.uniqueName+'">'+
											'<div class="panel panel-default"><div class="panel-heading">'+
											'<h4 class="panel-title">'+
											'<a data-toggle="collapse" data-parent="#accordionJSON'+this.widget.uniqueName+'" href="#collapseOneJSON'+this.widget.uniqueName+'">JSON 	</a><span class="loadingindicator"/></h4></div>'+
											'<div id="'+realthis.widget.uniqueName+'_imageholder" class="imageholder">imageholder</div>'+
											'<div class="controls">controls</div></div>');
			container.append(urlcontent);
			container.append(imagecontent);
			GLOBAL.$(".loadingindicator", imagecontent).text("loading...");
			this.setupCanvas(realthis.widget.uniqueName+'_imageholder', function(paper){
				realthis.setImageInPaper(realthis.data.parsedUrl, paper, function(queueobject, _paper, result){

					realthis.addListener("dataUpdated", function(params){
						var url = realthis.data.parsedUrl;
						GLOBAL.$(urlcontent).text(url);
						if(realthis.data.json){
							GLOBAL.$(".loadingindicator", imagecontent).text("loaded");
							realthis.populateImageHolder(realthis.data.json, imagecontent);
						}
					});


				});
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



		widgetInstance.populateImageHolder = function(data, container){

			this.placeIdentifiers(data, container, this.paper, this.paper.scaleFactor);

		};



		widgetInstance.setupCanvas = function(id, callback){
			var realthis = this;
			Raphael(id, 400, 600, function(context){
				paper = this;
				realthis.paper = paper;
				callback(paper);
			});
		};


		widgetInstance.setImageInPaper = function(url, _paper, callback){
			_paper.clear();
			var realthis = this;
			queueObject = {};

			data = {image: url};
			queueObject.data= data;

			var theimage= data.image;

			queueObject.image = theimage;
			queueObject.imageObj = new Image();
			queueObject.imageObj.onload = function(){
				queueObject.origWidth = queueObject.width;
				queueObject.origHeight = queueObject.height;

				var result = realthis.ScaleImage(queueObject.imageObj.width, queueObject.imageObj.height, 400, 600, true);
				queueObject.paperimage = _paper.image(queueObject.image, 0,0, result.width, result.height);
				queueObject.width = result.width;
				queueObject.height = result.height;
				_paper.scaleFactor = result;
				callback(queueObject, _paper, result);

			}
			queueObject.imageObj.src = queueObject.image;

		};

		widgetInstance.ScaleImage = function(srcwidth, srcheight, targetwidth, targetheight, fLetterBox) {

			var result = { width: 0, height: 0, fScaleToTargetWidth: true };

			if ((srcwidth <= 0) || (srcheight <= 0) || (targetwidth <= 0) || (targetheight <= 0)) {
			    return result;
			}

			// scale to the target width
			var scaleX1 = targetwidth;
			var scaleY1 = (srcheight * targetwidth) / srcwidth;

			// scale to the target height
			var scaleX2 = (srcwidth * targetheight) / srcheight;
			var scaleY2 = targetheight;

			var scaleX;
			var scaleY;

			// now figure out which one we should use
			var fScaleOnWidth = (scaleX2 > targetwidth);
			if (fScaleOnWidth) {
			    fScaleOnWidth = fLetterBox;
			}
			else {
			   fScaleOnWidth = !fLetterBox;
			}

			if (fScaleOnWidth) {
			    result.width = Math.floor(scaleX1);
			    result.height = Math.floor(scaleY1);
			    result.fScaleToTargetWidth = true;
			}
			else {
			    result.width = Math.floor(scaleX2);
			    result.height = Math.floor(scaleY2);
			    result.fScaleToTargetWidth = false;
			}
			result.scaleX = result.width / srcwidth;
			result.scaleY = result.height / srcheight;
			result.targetleft = Math.floor((targetwidth - result.width) / 2);
			result.targettop = Math.floor((targetheight - result.height) / 2);

			return result;
		};



		widgetInstance.placeIdentifiers = function(data, container, _paper, scaleFactor){
			GLOBAL.$(".controls", container ).empty();
			var _scaleFactor = scaleFactor;
			for(key in data){
				values = data[key];
				num_matches = values.length;
				var idname = this.widget.uniqueName+"_controlspan" + key;
				var checkid = this.widget.uniqueName+"_controlcheck" + key;
				if(num_matches > 0){
					var control = GLOBAL.$("<span id='"+idname+"' class='control'>"+key+" ("+num_matches+")</span>");
					var controlCheck = GLOBAL.$("<input id='"+checkid+"' type='checkbox' />");
					GLOBAL.$(".controls", container).append(controlCheck).append(control).append("<BR>");
				}else{
				}
				if(key != "_links"){
					for(key2 in values){
						value = values[key2];
//						console.log(_scaleFactor);
						var x = value.x * _scaleFactor.scaleX;
						var y = value.y * _scaleFactor.scaleY;
						var w = value.w * _scaleFactor.scaleX;
						var h = value.h * _scaleFactor.scaleY;
						//var rect = _paper.rect(value.x, value.y, value.w, value.h);
						var rect = _paper.rect(x, y, w, h);

						rect.attr("stroke","#f00");
						rect.attr("stroke-width",1);
						rect.attr("fill", "#5f5");
						rect.attr("fill-opacity",".2");
						rect.toFront();
						rect.show();
						(function(_rectid, thepaper, _checkid){
							GLOBAL.$(document).on("change", "#"+_checkid, function(){
								var _rect= thepaper.getById(_rectid);
								if(GLOBAL.$("#"+_checkid).is(':checked') ){
									_rect.show();
									_rect.toFront();
								}else{
									_rect.hide();
								}
							});
						})(rect.id, _paper, checkid);
					}
				}
			}
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