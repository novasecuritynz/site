/**
 * Disqus Comments Integration
 * Dynamically loads Disqus comments for the current page
 */

/**
 * Disqus configuration function
 * Sets up page URL and identifier for comment threading
 */
var disqus_config = function () {
    // Using document.location.* because Jekyll variables don't work well in JS
    this.page.url = document.location.href;
    this.page.identifier = document.location.pathname;
};

/**
 * Disqus embed script loader
 * Dynamically injects the Disqus comment system into the page
 * Script source should be obtained from your Disqus admin panel:
 * https://disqus.com/admin/universalcode
 */
(function() {
    var d = document;
    var s = d.createElement('script');
    
    // Set the source to your Disqus shortname
    s.src = 'https://shagorahmed.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    
    // Append script to document head or body
    (d.head || d.body).appendChild(s);
})();