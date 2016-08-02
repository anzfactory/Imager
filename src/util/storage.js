'use strict'

const C = require('../C.js')
const fs = require('fs')
const path = require('path')

const storage = new class Storage {

  get images() {
    return this._images
  }

  constructor() {
    this._images = []
    this.load()

    riot.obs.on(C.obs.changedDirectoryPath, () => {
      this.load()
    })
  }

  load() {
    let directoryPath = localStorage.getItem(C.storage.directoryPath) || C.path.defaultImage
    let directoryFiles = fs.readdirSync(directoryPath)
    this._images = []
    directoryFiles.forEach((fileName) => {
      if (/(png|jpg|jpeg|gif)$/i.exec(fileName)) {
        this._images.push(JSON.stringify(path.join(directoryPath, fileName)))
      }
    })
  }

  randomImage() {
    return this._images.random()
  }

  imageCount() {
    return this._images.length
  }

}()

module.exports = storage
