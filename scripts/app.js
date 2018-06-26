//The home_url of your WordPress install. Must be https to work properly
var base_url = '' //this is where you'll add the wordpress base url;

(function() {
  'use strict';

  let app = {
    isLoading: true,
    spinner: document.querySelector('.loader'),
  };

  //get data
  //TODO add REST API call
  app.getData = async function(){
		app.data  = await (await fetch('./test-api.php')); //TODO change to REST API 
		app.dataUpdate();
	}

  //update data in UI
  //TODO create UI
  app.dataUpdate = function(){ 
		let holder = document.getElementById("data");
		holder.innerHTML = app.data;
	};

  //get the data from API
  //TODO Add spinner
  app.getData();

  //service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }
})();
