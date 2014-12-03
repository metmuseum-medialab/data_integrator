/*
proxy manager

*/

function ProxyManager(){


	var proxy = {


		thiscodeonclient : false,


		init : function (){

			if(typeof IAMONTHECLIENT !== 'undefined' && IAMONTHECLIENT != false){
				this.thiscodeonclient = true;
//				console.log("I'm on the client");
			}else{
//				console.log("I'm on the server");
//					console.log("got conntected");
				
			}

		},



		callUrl : function(url, callback, notFoundCallback){
			this.init();
			if(this.thiscodeonclient){
				var proxyurl = "./proxy/"+url;
				console.log("in proxy, calling url " + proxyurl);

				$.ajax({
					url : proxyurl,
					type : "GET",
					contentType : 'application/json',
			  		success : function(rdata, status){
			  			callback(rdata);
			  		},
			  		error : function(jqXHR, status, message){
			  			console.log("error !!!!  ");
			  			console.log(status);
			  			console.log(message);
			  			if(message.message == "missing"){
			  				notFoundCallback(message);
			  			}else{
				  			callback(message);
				  		}
			  		}
				});
				return;
			}else{


				var proxyurl = url;
				console.log("in proxy, calling url " + proxyurl);

				var parser = require("url");
				var parsed = parser.parse(proxyurl);

				var http = require('http');

				var options = {
				  	host: parsed.hostname,
				  	port: 80,
				  	path: parsed.path
				};

				var resultBody = "";
				http.get(options, function(resp){
					resp.setEncoding('utf-8');
				  	resp.on('data', function(chunk){
				    //do something with chunk
				    	resultBody += chunk;
				  	});
				  	resp.on("end", function(){
				  		console.log("in callback for response ");
				  		console.log(proxyurl);
				  		callback(resultBody);
				  	});
				}).on("error", function(e){
				  	console.log(" response Got error: " + e.message);
				});
				return;
			}

		},


	}

	return proxy;

}

module.exports.ProxyManager = ProxyManager;