<im-tile-item style="{style}">
  <div name="tileItem" class="tile-item animated"></div>
<script>
const self = this
const C = require('./C.js')
const fs = require('fs')
const animationList = [
  ['fadeOut', 'fadeIn'],
  ['slideOutUp', 'slideInUp'],
  ['slideOutDown', 'slideInDown'],
  ['slideOutLeft', 'slideInRight'],
  ['slideOutRight', 'slideInLeft'],
  ['flipOutX', 'flipInX'],
  ['flipOutY', 'flipInY'],
  ['zoomOut', 'zoomIn'],
  ['rollOut', 'rollIn']
]
this.timeoutId = undefined
this.animationClass = undefined

this.on('mount', function() {
  let directoryPath = localStorage.getItem(C.storage.directoryPath) || C.path.defaultImage
  let directoryFiles = fs.readdirSync(directoryPath)
  let images = []
  directoryFiles.forEach(function(fileName) {
    if (/(png|jpg|jpeg|gif)$/i.exec(fileName)) {
      images.push(directoryPath + '/' + fileName)
    }
  })

  self.images = images
  self.loadImage(false)
  self.changer()
})

this.on('unmount', function() {
  if (this.timeoutId) {
    clearTimeout(this.timeoutId)
  }
})

this.changer = function() {
  this.timeoutId = setTimeout(function() {
    self.loadImage(true)
    self.changer()
  }, self.calcInterval())
}

this.loadImage = function(withAnimate) {
  let _load = function() {
    let img = self.images.random()
    self.tileItem.style.background = `url(${img}) no-repeat #000`
    self.tileItem.style.backgroundPosition = 'center'
    self.tileItem.style.backgroundSize = 'cover'
  }
  if (withAnimate) {
    let animationSet = animationList.random()
    self.tileItem.setAnimation(animationSet[0])
    setTimeout(function() {
      _load()
      self.tileItem.setAnimation(animationSet[1])
    }, 1000)
  } else {
    _load()
  }
}

this.calcInterval = function() {
  return Math.floor(Math.random() * (45000 - 10000 + 1)) + 10000;
}
</script>
</im-tile-item>
