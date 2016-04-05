var ORFrameNotifier = function (id) {
  if (window === window.parent) {
    console.warn('Not inside an iframe. ORFrameNotifier won\'t be initialized.');
    return;
  }
  console.info('ORFrameNotifier was initialized for id', id);

  function notify_parent () {
    window.parent.postMessage({
      id: id,
      type: 'urlchange',
      url: window.location.href
    }, '*');
  }

  // Whenever the hash changes.
  window.addEventListener('hashchange', function () {
    notify_parent();
  }, false);
  // On page load. Vanilla equivalent of $(document).ready
  document.addEventListener('DOMContentLoaded', function () {
    notify_parent();
  }, false);
};

if (window.ORFID) {
  console.info('ORFID found. Auto initializing');
  ORFrameNotifier(window.ORFID);
}

/*
<script>
  (function(r, o, a, d, s){
    r.ORFrame = function(i){r.ORFID = i};
    d = o.createElement(a);
    d.src = '//localhost:3000/OR_frame_notifier.js';
    s = o.getElementsByTagName(a)[0];
    s.parentNode.insertBefore(d, s);
  })(window, document, 'script');
  ORFrame('my id');
</script>
 */