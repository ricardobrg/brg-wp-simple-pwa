//The home_url of your WordPress install. Must be https to work properly
let home_url = 'https://wptavern.com/';

//If you don't know what you're doing, don't edit below this line.
let cacheName = 'brg-wp-simple-pwa-1';
let filesToCache = [
  './',
  './index.html',
  './scripts/app.js',
  './scripts/materialize.min.js',
  './styles/style.css',
  './styles/materialize.min.css',
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache).then(function(){
        console.log('[ServiceWorker] Caches added');
      })
      .catch(function(error){
        console.error('[ServiceWorker] Error on installing');
        console.error(error);
   	});
  }));
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {  
	let dataUrl = home_url + 'wp-json/';
    if(e.request.url.indexOf('test-api.php') > -1){
		//network first
        console.log('Network first: ' + e.request.url);
		e.respondWith(
			  fetch(e.request)
				.catch(function() {
				  console.log('no network. get from cache');
				  return caches.match(e.request);
				})
				.then(response =>
					caches.open(cacheName.prefetch).then((cache) => {
				      cache.put(e.request, response.clone());
		              return response;
		            }))
		);
	}else{
		//cache first
        console.log('Cache first: ' + e.request.url);
		e.respondWith(caches.match(e.request).then(function(response) {
		    if(response){
		      console.log('Serve from cache: ' + e.request.url);
		      return response;
		    }
		    return fetch(e.request).then(response =>
					caches.open(cacheName.prefetch).then((cache) => {
				      console.log('Fetch and cache: ' + e.request.url);
		              // cache response after making a request
		              cache.put(e.request, response.clone());
		              // return original response
		              return response;
		            }));
		}));
   }
});

