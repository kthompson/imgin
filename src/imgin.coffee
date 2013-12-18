startTimer = (time, cb) -> setTimeout cb, time
log = () -> console.log
imgur = (id, callback) ->
  xhr = new XMLHttpRequest()

  xhr.open("GET", "https://api.imgur.com/3/image/#{id}", true)
  xhr.setRequestHeader "Authorization", "Client-ID bc555e2b76aefbd"
  xhr.onload = (res) ->
    image = JSON.parse(this.responseText)
    callback image.data.link

  xhr.send()

do () ->
  body = document.getElementsByTagName('body')[0]
  box = document.createElement('div')
  img = document.createElement('img')

  timer = null

  box.className = 'imgin-box'
  box.style.display = 'none'

  box.appendChild(img)
  body.appendChild(box)

  display = (src, x, y) ->
    if src
      img.src = src
      box.style.display = 'block'
      box.style.left = x + 'px'
      box.style.top = y + 'px'
    else
      box.style.display = 'none'

  get = (nodes..., cb) ->
    for n in nodes
      continue unless n.nodeName is 'A'
      continue unless n.href
      #standard images:
      if n.href?.match /\.(jpg|jpeg|gif|png|bmp)$/gi
        cb n.href
        return

      if m = n.href.match /http:\/\/imgur\.com\/(.*)/
        imgur m[1], cb
        return

    cb null


  document.addEventListener 'mousemove', (event) ->
    clearTimeout(timer) if timer
    t = event.target
    x = event.pageX+5
    y = event.pageY
    timer = startTimer 100, () ->
      get t, t.parentElement, (href) ->
        display href, x, y

