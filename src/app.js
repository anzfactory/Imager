riot.tag2('im-tile-item', '<div name="tileItem" class="tile-item animated"></div>', '', 'riot-style="{style}"', function(opts) {
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
});

riot.tag2('main', '<div name="slideshow"></div>', '', '', function(opts) {
'use strict'

const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const C = require('./C.js')
const fs = require('fs')
const self = this
this.mountedTemplate = null
this.timeoutId = undefined

const templates = [
  'im-template1',
  'im-template2',
  'im-template3',
  'im-template4',
  'im-template5',
  'im-template6',
  'im-template7'
]
let useTemplates = []

if (!localStorage.getItem(C.storage.directoryPath)) {

  localStorage.setItem(C.storage.directoryPath, C.path.defaultImage)
}

function setupTemplates() {
  self.mountedTemplate = null
  let files = fs.readdirSync(localStorage.getItem(C.storage.directoryPath))
  let border = Math.ceil(files.length * 0.3)
  useTemplates = []
  for (let i = 0; i < templates.length; i++) {
    if (border > i) {
      useTemplates.push(templates[i])
    } else {
      break
    }
  }
}

function changer(forceMount) {
  self.timeoutId = setTimeout(function() {
    let name = useTemplates.random()
    if (forceMount || (name !== self.mountedTemplate)) {
      self.slideshow.setAnimation('fadeOut')
      setTimeout(function() {
        self.mountedTemplate = name
        riot.mount(self.slideshow, name)
        self.slideshow.setAnimation('fadeIn')
      }, 1000)

    }
    changer(false)
  }, 60000)
}

this.on('mount', function() {
  setupTemplates()
  changer(false)
  this.mountedTemplate = useTemplates.random()
  riot.mount(self.slideshow, this.mountedTemplate)
})

ipcRenderer.on(C.ipc.selectedDirectory, function(sender, directoryPath) {
  localStorage.setItem(C.storage.directoryPath, directoryPath)
  setupTemplates()

  this.mountedTemplate = useTemplates.random()
  riot.mount(self.slideshow, this.mountedTemplate)
})

ipcRenderer.on(C.ipc.clearStorage, function() {
  localStorage.clear()
})

});

riot.tag2('im-template1', '<im-tile-item each="{items}" class="title-item"></itm-tile-item>', '', 'class="tiled animated"', function(opts) {
'use strict'
this.items = [
  {style:'width:100%;height:100%;'}
]

});

riot.tag2('im-template2', '<im-tile-item each="{items}" class="title-item"></itm-tile-item>', '', 'class="tiled animated"', function(opts) {
'use strict'
this.items = [
  {style:'width:100%;height:50%;'},
  {style:'width:100%;height:50%;'}
]

});

riot.tag2('im-template3', '<im-tile-item each="{items}" class="title-item"></itm-tile-item>', '', 'class="tiled animated"', function(opts) {
'use strict'
this.items = [
  {style:'width:50%;height:100%;'},
  {style:'width:50%;height:50%;'},
  {style:'width:50%;height:50%;'}
]

});

riot.tag2('im-template4', '<im-tile-item each="{items}" class="title-item"></itm-tile-item>', '', 'class="tiled animated"', function(opts) {
'use strict'
this.items = [
  {style:'width:60%;height:40%;'},
  {style:'width:40%;height:40%;'},
  {style:'width:50%;height:60%;'},
  {style:'width:50%;height:60%;'}
]

});

riot.tag2('im-template5', '<im-tile-item each="{items}" class="title-item"></itm-tile-item>', '', 'class="tiled animated"', function(opts) {
'use strict'
this.items = [
  {style:'width:50%;height:40%;'},
  {style:'width:50%;height:40%;'},
  {style:'width:40%;height:60%;'},
  {style:'width:60%;height:30%;'},
  {style:'width:60%;height:30%;'}
]

});

riot.tag2('im-template6', '<im-tile-item each="{items}" class="title-item"></itm-tile-item>', '', 'class="tiled animated"', function(opts) {
'use strict'
this.items = [
  {style:'width:30%;height:30%;float:right;'},
  {style:'width:70%;height:30%;float:right;'},
  {style:'width:60%;height:70%;float:right;'},
  {style:'width:40%;height:25%;float:right;'},
  {style:'width:40%;height:20%;float:right;'},
  {style:'width:40%;height:25%;float:right;'}
]

});

riot.tag2('im-template7', '<im-tile-item each="{items}"></itm-tile-item>', '', 'class="tiled animated"', function(opts) {
'use strict'
this.items = [
  {style:'width:80%;height:30%;'},
  {style:'width:20%;height:30%;'},
  {style:'width:30%;height:40%;'},
  {style:'width:40%;height:40%;'},
  {style:'width:30%;height:40%;'},
  {style:'width:40%;height:30%;'},
  {style:'width:60%;height:30%;'}
]

});
