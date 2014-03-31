

var ThingManager = require("./classes/thing.class.js").ThingManager();

var WidgetManager = require("./classes/widget.class.js").WidgetManager();

var urlloadertype = WidgetManager.loadWidgetType("urlloader");


console.log(urlloadertype.bar());

console.log("done");



// what I want to do:
