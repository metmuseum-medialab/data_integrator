require("fs");
require("async");
require("dot");
require("file");
require("html-entities");
require("minimist");
require("path");
require("urlparser");
require("./classes/entity/entity.js");
require("./classes/renderer/renderer.js");
require("./classes/thing/thing.js");
require("./classes/widget/widget.js");
require("./classes/db/db.js");
require("./classes/proxy/proxy.js");
//require("./widgets/jsonloader/widget.jsonloader.class.js");

//-r ./classes/renderer/renderer.js:renderer \
//-r ./classes/thing/thing.js:thing \


/*
browserify -t brfs \
-r ./classes/entity/entity.js:./classes/entity/entity.js \
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