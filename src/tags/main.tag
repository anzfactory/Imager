<main>
  <div name="slideshow"></div>
<script>
'use strict'

const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const C = require('./C.js')
const fs = require('fs')
const self = this
const storage = require('./util/storage.js')

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
  // デフォルト画像パスをセットする
  localStorage.setItem(C.storage.directoryPath, C.path.defaultImage)
}

function setupTemplates() {
  self.mountedTemplate = null
  let border = Math.ceil(storage.imageCount() * 0.3)
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
  riot.obs.trigger(C.obs.changedDirectoryPath)
  setupTemplates()
  // マウントしなおして更新をうながす
  this.mountedTemplate = useTemplates.random()
  riot.mount(self.slideshow, this.mountedTemplate)
})

ipcRenderer.on(C.ipc.clearStorage, function() {
  localStorage.clear()
})

</script>
</main>
