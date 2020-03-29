export default class View {
  constructor(selector) {
    this.el = document.querySelector(selector);
    this.currentKeys = {};
    this.el.onkeydown = function onkd(ev) {
      this.currentKeys[ev.keyCode] = true;
    }.bind(this);

    this.el.onkeyup = function onku(ev) {
      this.currentKeys[ev.keyCode] = false;
    }.bind(this);

    this.el.onmousedown = function omd() {
      document.onmouseup = this.onmouseup.bind(this);
      document.onmousemove = this.onmousemove.bind(this);
    }.bind(this);
  }

  onmouseup() { // eslint-disable-line class-methods-use-this
    document.onmousemove = null;
  }

  onmousemove() { } // eslint-disable-line class-methods-use-this, no-empty-function
}
