class ORFrameNotifier {
  constructor (id, receiver, sender = window) {
    this.events = {};
    this.id = id;
    this.sender = sender;
    this.receiver = receiver;

    this._messageListener = this._messageListener.bind(this);
    this.sender.addEventListener('message', this._messageListener);
  }

  _messageListener (e) {
    if (!e.data.type) return;
    var cbs = this.events[e.data.type] || [];
    cbs.forEach(function (cb) { cb(e.data); });
  }

  on (type, cb) {
    if (!this.events[type]) this.events[type] = [];
    this.events[type].push(cb);
    return this;
  }

  send (type, data) {
    data = data || {};
    data.id = this.id;
    data.type = type;
    this.receiver.postMessage(data, '*');
    return this;
  }

  destroy () {
    this.sender.removeEventListener('message', this._messageListener);
    this.events = {};
  }
}

if (typeof module !== 'undefined') {
  module.exports = ORFrameNotifier;
}

/*
<script>
(function(r, o, a, d, s){
    d = o.createElement(a);
    d.src = '//localhost:3000/OR_frame_notifier.js';
    d.onload = () => r.onORFrameNotifierLoaded();
    s = o.getElementsByTagName(a)[0];
    s.parentNode.insertBefore(d, s);
})(window, document, 'script');

function onORFrameNotifierLoaded () {
    console.log('loaded');
    const orFrame = new ORFrameNotifier('id', window, window.parent);
}
</script>
 */
