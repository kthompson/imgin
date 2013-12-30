startTimer = (time, cb) -> setTimeout cb, time
log = () -> console.log

xhr = (url, callback) ->
  req = new XMLHttpRequest()
  req.open "GET", url, true
  req.setRequestHeader "Authorization", "Client-ID bc555e2b76aefbd"
  req.onload = (res) ->
    response = JSON.parse(req.responseText)
    callback response

  req.send()

imgur = (id, callback) ->
  xhr "https://api.imgur.com/3/image/#{id}", (image) ->
    callback image.data.link

album = (id, callback) ->
  xhr "https://api.imgur.com/3/album/#{id}/images", (image) ->
    console.log image
    callback(img.link for img in image.data)

mouse =
  pos:
    x: 0
    y: 0
  view:
    x: 0
    y: 0

do () ->
  body = document.getElementsByTagName('body')[0]
  box = document.createElement('div')
  img = document.createElement('img')
  inspecting = null

  timer = null

  box.className = 'imgin-box'
  box.style.display = 'none'

  box.appendChild(img)
  body.appendChild(box)

  setBoxPos = (x, y) ->
    box.style.left = x + 'px'
    box.style.top = y + 'px'


  display = (src) ->
    unless src
      box.style.display = 'none'
      console.log "hiding"
      inspecting = null
      return

    docW = document.documentElement.clientWidth * 0.95
    docH = document.documentElement.clientHeight * 0.95

    img.onload = () ->
      w = img.naturalWidth
      h = img.naturalHeight
      if w > docW or h > docH
        console.log "image is too big (#{w}, #{h}) for view (#{docW}, #{docH})"
        # figure out a scale ratio
        sw = w/docW
        sh = h/docH
        
        console.log "selecting scale (#{sw}, #{sh})"
        s = Math.max(sw, sh)
        img.width  = Math.round(w/s)
        img.height = Math.round(h/s)

        console.log "new size (#{img.width}, #{img.height})"

      box.style.display = 'block'
      setBoxPos (mouse.pos.x+5), mouse.pos.y
      console.log "displaying ", src

    if typeof src is 'string'
      img.src = src
    else
      img.src = src[0]

  get = (node, cb) ->
    while node
      return if node is box

      unless node.nodeName is 'A' and node.href
        node = node.parentElement
        continue

      return if node.href is inspecting

      inspecting = node.href

      console.log "checking #{node.href}"
      #standard images:
      if node.href.match /\.(jpg|jpeg|gif|png|bmp)$/gi
        cb node.href
        return
      else if m = node.href.match /http:\/\/imgur\.com\/a\/(.*)/ # album
        console.log "imgur album #{m[1]}"
        album m[1], cb
        return
      else if m = node.href.match /http:\/\/imgur\.com\/(.*)/
        imgur m[1], cb
        return
      else
        node = node.parentElement

    cb null


  document.addEventListener 'mousemove', (event) ->
    clearTimeout(timer) if timer
    t = event.target
    mouse.pos.x = event.pageX
    mouse.pos.y = event.pageY
    mouse.view.x = event.screenX
    mouse.view.y = event.screenY

    timer = startTimer 100, () ->
      get t, (href) ->
        display href

