Element.prototype.setAnimation = function(animationClass) {
  if (this.prevAnimation) {
    this.classList.remove(this.prevAnimation)
  }
  this.prevAnimation = animationClass
  this.classList.add(this.prevAnimation)
}
