require("fs");
require("async");
require("dot");
require("file");
require("html-entities");
require("minimist");
require("path");
require("urlparser");

/*
require("./classes/renderer/renderer.js");
require("./classes/thing/thing.js");
require("./classes/widget/widget.js");
require("./classes/db/db.js");
require("./classes/proxy/proxy.js");
*/
//require("./widgets/jsonloader/widget.jsonloader.class.js");

//-r ./classes/renderer/renderer.js:renderer \
//-r ./classes/thing/thing.js:thing \

//-r ./classes/entity/entity.js:./classes/entity/entity.js \

/*
browserify -t brfs \
-r ./classes/entity/entity.js:"./classes/entity/entity.js" \
-r ./classes/renderer/renderer.js:./classes/renderer/renderer.js \
-r ./classes/thing/thing.js:./classes/thing/thing.js \
-r ./classes/widget/widget.js:./classes/widget/widget.js \
-r ./classes/proxy/proxy.js:./classes/proxy/proxy.js \
-r ./classes/db/db.js:./classes/db/db.js \
-r ./widgets/jsonloader/widget.jsonloader.class.js:./widgets/jsonloader/widget.jsonloader.class.js \
-r ./widgets/templaterenderer/widget.templaterenderer.class.js:./widgets/templaterenderer/widget.templaterenderer.class.js \
-r ./widgets/elasticsearch/widget.elasticsearch.class.js:./widgets/elasticsearch/widget.elasticsearch.class.js \
-r ./widgets/jsbin/widget.jsbin.class.js:./widgets/jsbin/widget.jsbin.class.js \
-r async \
-r fs \
-r dot \
-r file \
-r html-entities \
-r minimist \
-r path \
-r urlparser \
for_browserify.js  > js/app_bundle.js

*/

/*
require=(function e(t,n,r){function s(o,u){
	console.log(o);
	console.log(n);
	console.log(t);
	if(!n[o]){
		if(!t[o]){
			var a=typeof require=="function"&&require;
			if(!u&&a)return a(o,!0);
			if(i)return i(o,!0);
			var f=new Error("Cannot find module '"+o+"'");
			console.log("throwing");
			throw f.code="MODULE_NOT_FOUND",f
		}
		var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
*/