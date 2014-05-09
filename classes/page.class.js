// the code that handles loading the page for a thing, running the processes for displaying, etc.



function PageManager(){
	var thingManager = require("./thing.class.js").ThingManager();

	function Page(){};

	Page.prototype = {
		// a page might be for a thingType, or a thing itself (or maybe something else), let's all all those "Entities"
		category : "Page",
		pageObject : false, // may be a thing object, or a thingType object, or maybe some other stuff
		pageType : false,
		request : false,
		response : false,
		content : "",
	}

	var PageManager = {
		createPage : function(req, res){
			var page = new Page();
			page.request = req;
			page.response = res;
			console.log("got page");
	  		console.log(req.uri.child());
  			console.log(req.uri.path());
  			page.content += " page \n";
			return page;
		},

		populatePage : function(page){
			console.log("in populatePage");
			var path = page.request.uri.path();
			console.log("path : "+ path);
			var EntityManager;
			if(IAMONTHECLIENT == true){
				var EntityManager = require("./classes/entityManager.class.js").EntityManager();
			}else{
				var EntityManager = require("./entityManager.class.js").EntityManager();				
			}
			var entity = EntityManager.getEntity(path);
			page.pageType = entity.category;
			page.pageObject = entity;

		},

		loadThingPage : function(thingid, thingtype ){},
		renderPage : function(page){
	      page.response.object({pageObject : page.pageObject , debug : page.content}).send();

		},


	};

	return PageManager;


}

module.exports.PageManager = PageManager;