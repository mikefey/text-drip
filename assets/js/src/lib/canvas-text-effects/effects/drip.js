import _ from 'lodash';
import { tweenObject } from './../../../helpers/tween';

const drip = {
  /**
   * Creates a 'dripping ink' effect from a set of given points
   * @param {Object} context - A canvas 2d context
   * @param {Object} fontPath - An object containing font data from Opentype.js
   * @param {Number} minDrips - The minimum amount of drips to show
   * @param {Number} maxDrips - The maximum amount of drips to show
   * @returns {undefined} undefined
   */
  drip(context, fontPath, minDrips = 2, maxDrips = 10) {
    const dripPoints = _.sample(fontPath.commands, _.random(minDrips, maxDrips));

    this.ctx = context;
    this.dripPointObjects = [];

    for (let i = 0; i < dripPoints.length; i++) {
      const dripAmount = 100 + (Math.random() * 300);
      const dripTime = 8000 + (Math.random() * 10000);
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


  /**
   * Draws the drip at its current state throughout the animation
   * @param {Object} pointOb - An object containg data about the current 'drip'
   * @returns {undefined} undefined
   */
  onDripUpdate(pointOb) {
    this.ctx.beginPath();
    this.ctx.moveTo(pointOb.startX, pointOb.startY);
    this.ctx.lineWidth = pointOb.strokeWidth;
    this.ctx.lineTo(pointOb.x, pointOb.y);
    this.ctx.stroke();
    this.ctx.arc(pointOb.x, pointOb.y + 2, pointOb.strokeWidth / 2, 0, 2 * Math.PI, true);
    this.ctx.fill();
    this.ctx.closePath();
  },
};

export default drip;
