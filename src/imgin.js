(function() {
  var album, imgur, log, mouse, startTimer, xhr;

  startTimer = function(time, cb) {
    return setTimeout(cb, time);
  };

  log = function() {
    return console.log;
  };

  xhr = function(url, callback) {
    var req;
    req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.setRequestHeader("Authorization", "Client-ID bc555e2b76aefbd");
    req.onload = function(res) {
      var response;
      response = JSON.parse(req.responseText);
      return callback(response);
    };
    return req.send();
  };

  imgur = function(id, callback) {
    return xhr("https://api.imgur.com/3/image/" + id, function(image) {
      return callback(image.data.link);
    });
  };

  album = function(id, callback) {
    return xhr("https://api.imgur.com/3/album/" + id + "/images", function(image) {
      var img;
      console.log(image);
      return callback((function() {
        var _i, _len, _ref, _results;
        _ref = image.data;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          img = _ref[_i];
          _results.push(img.link);
        }
        return _results;
      })());
    });
  };

  mouse = {
    pos: {
      x: 0,
      y: 0
    },
    view: {
      x: 0,
      y: 0
    }
  };

  (function() {
    var body, box, display, get, img, inspecting, setBoxPos, timer;
    body = document.getElementsByTagName('body')[0];
    box = document.createElement('div');
    img = document.createElement('img');
    inspecting = null;
    timer = null;
    box.className = 'imgin-box';
    box.style.display = 'none';
    box.appendChild(img);
    body.appendChild(box);
    setBoxPos = function(x, y) {
      box.style.left = x + 'px';
      return box.style.top = y + 'px';
    };
    display = function(src) {
      var docH, docW;
      if (!src) {
        box.style.display = 'none';
        console.log("hiding");
        inspecting = null;
        return;
      }
      docW = document.documentElement.clientWidth * 0.95;
      docH = document.documentElement.clientHeight * 0.95;
      img.onload = function() {
        var h, s, sh, sw, w;
        w = img.naturalWidth;
        h = img.naturalHeight;
        if (w > docW || h > docH) {
          console.log("image is too big (" + w + ", " + h + ") for view (" + docW + ", " + docH + ")");
          sw = w / docW;
          sh = h / docH;
          console.log("selecting scale (" + sw + ", " + sh + ")");
          s = Math.max(sw, sh);
          img.width = Math.round(w / s);
          img.height = Math.round(h / s);
          console.log("new size (" + img.width + ", " + img.height + ")");
        }
        box.style.display = 'block';
        setBoxPos(mouse.pos.x + 5, mouse.pos.y);
        return console.log("displaying ", src);
      };
      if (typeof src === 'string') {
        return img.src = src;
      } else {
        return img.src = src[0];
      }
    };
    get = function(node, cb) {
      var m;
      while (node) {
        if (node === box) {
          return;
        }
        if (!(node.nodeName === 'A' && node.href)) {
          node = node.parentElement;
          continue;
        }
        if (node.href === inspecting) {
          return;
        }
        inspecting = node.href;
        console.log("checking " + node.href);
        if (node.href.match(/\.(jpg|jpeg|gif|png|bmp)$/gi)) {
          cb(node.href);
          return;
        } else if (m = node.href.match(/http:\/\/imgur\.com\/a\/(.*)/)) {
          console.log("imgur album " + m[1]);
          album(m[1], cb);
          return;
        } else if (m = node.href.match(/http:\/\/imgur\.com\/(.*)/)) {
          imgur(m[1], cb);
          return;
        } else {
          node = node.parentElement;
        }
      }
      return cb(null);
    };
    return document.addEventListener('mousemove', function(event) {
      var t;
      if (timer) {
        clearTimeout(timer);
      }
      t = event.target;
      mouse.pos.x = event.pageX;
      mouse.pos.y = event.pageY;
      mouse.view.x = event.screenX;
      mouse.view.y = event.screenY;
      return timer = startTimer(100, function() {
        return get(t, function(href) {
          return display(href);
        });
      });
    });
  })();

}).call(this);

/*
//@ sourceMappingURL=imgin.js.map
*/