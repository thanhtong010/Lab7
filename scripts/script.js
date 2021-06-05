// script.js

import { router } from './router.js'; // Router imported so you can use it to manipulate your SPA app here
const setState = router.setState;

var CACHE_NAME = 'cache-journal';
var urlsToCache = ['https://cse110lab6.herokuapp.com/entries'];

// Make sure you register your service worker here too 
// Register service worker (from https://developers.google.com/web/fundamentals/primers/service-workers)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// Open cache and cache files (from https://developers.google.com/web/fundamentals/primers/service-workers#cache_and_return_requests)
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// On-click event listener for clicking on settings
document.querySelector('img').addEventListener('click', function() {
  history.pushState(null, 'settings', '#settings')
  setState()
})

// On-click event listener for clicking on header (goes back to journal entries)
document.querySelector('h1').addEventListener('click', function() {
  location.hash = ''
  setState()
})

// Popstate event listener when clicking the back button
window.addEventListener('popstate', function(event) {
  console.log('popstate fired!');
  setState()
});

document.addEventListener('DOMContentLoaded', () => {
  // Used to number the entries
  let i = 1
  fetch('https://cse110lab6.herokuapp.com/entries')
    .then(response => response.json())
    .then(entries => {
      entries.forEach(entry => {
        let newPost = document.createElement('journal-entry');
        newPost.entry = entry;
        newPost.num = i;
        document.querySelector('main').appendChild(newPost);
        i++;
        // On-click event listener when clicking on a specific entry
        newPost.addEventListener('click', function() {
          console.log('in query')
          // location.hash = '#entry' + i.toString()
          let num = newPost.num.toString()
          let hash = '#entry' + num
          history.pushState(null, 'Entry', hash)
          setState()
        })
      });
    });
});



