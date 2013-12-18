(function() {
  var imgur, log, startTimer,
    __slice = [].slice;

  startTimer = function(time, cb) {
    return setTimeout(cb, time);
  };

  log = function() {
    return console.log;
  };

  imgur = function(id, callback) {
    var xhr;
    xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.imgur.com/3/image/" + id, true);
    xhr.setRequestHeader("Authorization", "Client-ID bc555e2b76aefbd");
    xhr.onload = function(res) {
      var image;
      image = JSON.parse(this.responseText);
      return callback(image.data.link);
    };
    return xhr.send();
  };

  (function() {
    var body, box, display, get, img, timer;
    body = document.getElementsByTagName('body')[0];
    box = document.createElement('div');
    img = document.createElement('img');
    timer = null;
    box.className = 'imgin-box';
    box.style.display = 'none';
    box.appendChild(img);
    body.appendChild(box);
    display = function(src, x, y) {
      if (src) {
        img.src = src;
        box.style.display = 'block';
        box.style.left = x + 'px';
        return box.style.top = y + 'px';
      } else {
        return box.style.display = 'none';
      }
    };
    get = function() {
      var cb, m, n, nodes, _i, _j, _len, _ref;
      nodes = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
      for (_j = 0, _len = nodes.length; _j < _len; _j++) {
        n = nodes[_j];
        if (n.nodeName !== 'A') {
          continue;
        }
        if (!n.href) {
          continue;
        }
        if ((_ref = n.href) != null ? _ref.match(/\.(jpg|jpeg|gif|png|bmp)$/gi) : void 0) {
          cb(n.href);
          return;
        }
        if (m = n.href.match(/http:\/\/imgur\.com\/(.*)/)) {
          imgur(m[1], cb);
          return;
        }
      }
      return cb(null);
    };
    return document.addEventListener('mousemove', function(event) {
      var t, x, y;
      if (timer) {
        clearTimeout(timer);
      }
      t = event.target;
      x = event.pageX + 5;
      y = event.pageY;
      return timer = startTimer(100, function() {
        return get(t, t.parentElement, function(href) {
          return display(href, x, y);
        });
      });
    });
  })();

}).call(this);

/*
//@ sourceMappingURL=imgin.js.map
*/