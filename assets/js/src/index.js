import canvasTextEffects from './lib/canvas-text-effects/canvas-text-effects';
import dripEffect from './lib/canvas-text-effects/effects/drip';
import './../../css/src/app.scss!';


const app = {
  /**
   * Sets everything up
   * @returns {undefined} undefined
   */
  init() {
    window.addEventListener('resize', this.scaleCanvas.bind(this));

    this.canvas = document.getElementsByClassName('font-render')[0];
    this.ctx = this.canvas.getContext('2d');
    this.scaleCanvas();

    canvasTextEffects.setup('assets/fonts/2DF33B_3_0.ttf', this.renderText.bind(this));
  },


  /**
   * Renders the text to the canvas
   * @returns {undefined} undefined
   */
  renderText() {
    const _this = this;
    const textPath = canvasTextEffects.getPath('Hello World', 100, 100, 100, 0.5);
    const inkFillTexture = new Image();

    inkFillTexture.src = 'assets/image/ink-texture.jpg';

    inkFillTexture.onload = function onTextureLoad() {
      const pattern = _this.ctx.createPattern(this, 'repeat');

      _this.ctx.fillStyle = pattern;
      _this.ctx.strokeStyle = pattern;

      textPath.fill = pattern;
      canvasTextEffects.renderText(textPath, _this.ctx);
      dripEffect.drip(_this.ctx, textPath, 7, 12);
    };
  },


  /**
   * Scales the canvas to the full width of the screen
   * and renders it 2x the size for retina
   * @returns {undefined} undefined
   */
  scaleCanvas() {
    this.canvas.width = (window.innerWidth * 2);
    this.canvas.height = (window.innerHeight * 2);
    this.canvas.style.width = window.innerWidth.toString() + 'px';
    this.canvas.style.height = window.innerHeight.toString() + 'px';
    this.ctx.scale(2, 2);
  },
};

app.init();
