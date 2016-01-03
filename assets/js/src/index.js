import _ from 'lodash';
import Opentype from 'opentype.js';
import { tweenObject } from './helpers/tween';
import './../../css/src/app.scss!';


const app = {

  init() {
    const _this = this;

    window.addEventListener('resize', this.scaleCanvas.bind(this));

    this.canvas = document.getElementsByClassName('font-render')[0];
    this.ctx = this.canvas.getContext('2d');
    this.scaleCanvas();
    this.dripPointObjects = [];

    Opentype.load('assets/fonts/2DF33B_3_0.ttf', function fontLoaded(err, font) {
      if (err) {
        // font could not be loaded
      } else {
        const buffer = font.toArrayBuffer();
        const parsedFont = Opentype.parse(buffer);

        _this.renderText(parsedFont);
      }
    });
  },


  renderText(parsedFont) {
    const fontPath = parsedFont.getPath('Hello, World!', 100, 100, 100);

    for (let i = 0; i < fontPath.commands.length; i++) {
      const randDistort = _.random(0, 1);

      if (randDistort) {
        const distortAmount = 0.7;
        const randPosition = _.random(1, 8);

        if (randPosition === 1) {
          fontPath.commands[i].x -= distortAmount;
        }

        if (randPosition === 2) {
          fontPath.commands[i].x += distortAmount;
        }

        if (randPosition === 3) {
          fontPath.commands[i].y -= distortAmount;
        }

        if (randPosition === 4) {
          fontPath.commands[i].y += distortAmount;
        }

        if (randPosition === 5) {
          fontPath.commands[i].x += distortAmount;
          fontPath.commands[i].y += distortAmount;
        }

        if (randPosition === 6) {
          fontPath.commands[i].x -= distortAmount;
          fontPath.commands[i].y -= distortAmount;
        }

        if (randPosition === 7) {
          fontPath.commands[i].x += distortAmount;
          fontPath.commands[i].y -= distortAmount;
        }

        if (randPosition === 8) {
          fontPath.commands[i].x -= distortAmount;
          fontPath.commands[i].y += distortAmount;
        }
      }
    }


    this.ctx.filter = 'blur(100px)';
    fontPath.draw(this.ctx);

    this.makeDrips(fontPath);
  },


  makeDrips(fontPath) {
    const dripPoints = _.sample(fontPath.commands, _.random(7, 12));

    for (let i = 0; i < dripPoints.length; i++) {
      const dripAmount = 100 + Math.random() * 300;
      const dripTime = 5000 + Math.random() * 3000;
      const strokeWidth = _.random(2, 5);
      const pointOb = {
        strokeWidth,
        index: i,
        startX: dripPoints[i].x,
        startY: dripPoints[i].y,
        x: dripPoints[i].x,
        y: dripPoints[i].y,
      };
      this.dripPointObjects.push(pointOb);

      tweenObject(
        pointOb,
        {
          y: pointOb.y + dripAmount,
          strokeWidth: pointOb.strokeWidth * 0.3,
        },
        dripTime,
        this.onDripUpdate.bind(this));
    }
  },


  onDripUpdate(pointOb) {
    this.ctx.beginPath();
    this.ctx.moveTo(pointOb.startX, pointOb.startY);
    this.ctx.lineWidth = pointOb.strokeWidth;
    this.ctx.lineTo(pointOb.x, pointOb.y);
    this.ctx.stroke();
    this.ctx.arc(pointOb.x, pointOb.y + 1, pointOb.strokeWidth / 2, 0, 2 * Math.PI, true);
    this.ctx.fill();
    this.ctx.closePath();
  },


  scaleCanvas() {
    this.canvas.width = (window.innerWidth * 2);
    this.canvas.height = (window.innerHeight * 2);
    this.canvas.style.width = window.innerWidth.toString() + 'px';
    this.canvas.style.height = window.innerHeight.toString() + 'px';
    this.ctx.scale(2, 2);
  },
};

app.init();
