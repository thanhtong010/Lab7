// script.js

import { router } from './router.js'; // Router imported so you can use it to manipulate your SPA app here
const setState = router.setState;

// Make sure you register your service worker here too 
// Register service worker (from https://developers.google.com/web/fundamentals/primers/service-workers)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

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



