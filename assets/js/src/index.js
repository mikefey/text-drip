import canvasTextEffects from './lib/text-effects/text-effects';
import dripEffect from './lib/text-effects/effects/drip';
import './../../css/src/app.scss!';


const app = {
  /**
   * Sets everything up
   * @returns {undefined} undefined
   */
  init() {
    window.addEventListener('resize', this.scaleCanvas.bind(this));

    this.htmlEl = document.getElementsByTagName('html')[0];
    this.input = document.getElementsByClassName('text-input')[0];
    this.canvas = document.getElementsByClassName('font-render')[0];
    this.ctx = this.canvas.getContext('2d');
    this.scaleCanvas();

    this.input.addEventListener('keyup', this.onInputKeyup.bind(this));
    canvasTextEffects.setup('assets/fonts/2DF33B_3_0.ttf', this.onFontLoaded.bind(this));
  },


  /**
   * Callback for when the font is loaded
   * @returns {undefined} undefined
   */
  onFontLoaded() {
    this.loadInkTexture();
  },


  /**
   * Callback for when the ink texture is loaded
   * @returns {undefined} undefined
   */
  loadInkTexture() {
    const _this = this;
    const inkFillTexture = new Image();

    inkFillTexture.src = 'assets/image/ink-texture.jpg';
    inkFillTexture.onload = function onTextureLoaded() {
      _this.textureImage = this;
      _this.onAllAssetsLoaded();
    };
  },


  /**
   * Callback for when all assets are loaded
   * @returns {undefined} undefined
   */
  onAllAssetsLoaded() {
    this.htmlEl.className += ' loaded';
  },


  /**
   * Keyup handler for text input
   * @param {Object} e - A keyup event
   * @returns {undefined} undefined
   */
  onInputKeyup(e) {
    if (e.keyCode === 13) {
      dripEffect.stopDrips();
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.renderDripText(this.input.value);
    }
  },


  /**
   * Renders the text to the canvas
   * @param {String} text - The text to render
   * @returns {undefined} undefined
   */
  renderDripText(text) {
    const fontSize = window.innerWidth > 600 ? 75 : 40;
    const textPath = canvasTextEffects.getPath(text, 20, 150, fontSize, 0.5);
    const pattern = this.ctx.createPattern(this.textureImage, 'repeat');

    this.ctx.fillStyle = pattern;
    this.ctx.strokeStyle = pattern;
    this.ctx.beginPath();
    canvasTextEffects.renderText(textPath, this.ctx);
    dripEffect.setupDrips(this.ctx, textPath, 7, 12);
    this.ctx.closePath();
    this.ctx.fill();

    dripEffect.drip();
  },


  /**
   * Scales the canvas to the full width of the screen
   * and renders it 2x the size for retina
   * @returns {undefined} undefined
   */
  scaleCanvas() {
    dripEffect.stopDrips();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.width = (window.innerWidth * 2);
    this.canvas.height = (window.innerHeight * 2);
    this.canvas.style.width = window.innerWidth.toString() + 'px';
    this.canvas.style.height = window.innerHeight.toString() + 'px';
    this.ctx.scale(2, 2);
  },
};


// if the DOM is ready by the time this module is loaded,
// fire the init function, otherwise, listen for the window.onload event
if (document.readyState === 'complete' ||
  document.readyState === 'interactive') {
  app.init();
} else {
  window.onload = function () {
    app.init();
  };
}
