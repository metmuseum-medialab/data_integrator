

var ThingManager = require("./classes/thing.class.js").ThingManager();

var WidgetManager = require("./classes/widget.class.js").WidgetManager();

var urlloadertype = WidgetManager.loadWidgetType("urlloader");
var urlloadertype2 = WidgetManager.loadWidgetType("urlloader");

var base= WidgetManager.getBaseWidgetType();

console.log(urlloadertype.typeName);
console.log(urlloadertype2.typeName);
console.log(base.typeName);

urlloadertype.typeName= "changed";

console.log(urlloadertype.typeName);
console.log(urlloadertype2.typeName);
console.log(base.typeName);
urlloadertype.typeName= "changed";

console.log(urlloadertype.typeName);
console.log(urlloadertype2.typeName);
console.log(base.typeName);


console.log("done");



// what I want to do:
