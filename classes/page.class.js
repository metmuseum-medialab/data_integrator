// the code that handles loading the page for a thing, running the processes for displaying, etc.

function PageManager(){

	function Page(){};

	Page.prototype = {
		thingType : false,
		thingID : false,



	};

	function PageManager(){
		loadPage : function(url){},
		loadThingPage : function(thingid, thingtype ){},
		renderPage : function(page){},


	};

	return PageManager;


}

module.exports.PageManager = PageManager;