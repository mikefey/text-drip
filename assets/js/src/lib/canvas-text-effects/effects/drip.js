import _ from 'lodash';
import { tweenObject } from './../../../helpers/tween';


/**
* Creates a 'dripping ink' effect from a set of given points
*/
const drip = {
  /**
   * Sets up the points to drip from
   * @param {Object} context - A canvas 2d context
   * @param {Object} fontPath - An object containing font data from Opentype.js
   * @param {Number} minDrips - The minimum amount of drips to show
   * @param {Number} maxDrips - The maximum amount of drips to show
   * @returns {undefined} undefined
   */
  setupDrips(context, fontPath, minDrips = 2, maxDrips = 10) {
    const dripPoints = _.sample(fontPath.commands, _.random(minDrips, maxDrips));

    this.ctx = context;
    this.dripPointObjects = [];

    for (let i = 0; i < dripPoints.length; i++) {
      const strokeWidth = _.random(2, 5);
      let dripAmount = (strokeWidth * 50) + (Math.random() * 300);
      if (dripPoints[i].y + dripAmount > this.ctx.canvas.height - 50) {
        dripAmount = (this.ctx.canvas.height - 50) - dripPoints[i].y;
      }
      const dripTime = 5000 + (strokeWidth * 1000);
      const pointOb = {
        strokeWidth,
        dripAmount,
        dripTime,
        index: i,
        startX: dripPoints[i].x,
        startY: dripPoints[i].y,
        x: dripPoints[i].x,
        y: dripPoints[i].y,
      };

      this.adjustPoint(pointOb);
      this.dripPointObjects.push(pointOb);
    }
  },


  /**
   * Adjusts the starting points of the drips so they are more 'inside' of the
   * letters. If they are exactly placed along the outline they don't look
   * as natural.
   * @param {Object} pointOb - A drip point object
   * @returns {undefined} undefined
   */
  adjustPoint(pointOb) {
    const offset = pointOb.strokeWidth + 5;

    if (this.ctx.isPointInPath((pointOb.x + offset) * 2,
      (pointOb.y + offset) * 2)) {
      pointOb.x += offset;
      pointOb.y += offset;
      pointOb.xOffset = offset;
      pointOb.yOffset = offset;
    } else if (this.ctx.isPointInPath((pointOb.x + offset) * 2,
      (pointOb.y - offset) * 2)) {
      pointOb.x += offset;
      pointOb.y -= offset;
      pointOb.xOffset = offset;
      pointOb.yOffset = -offset;
    } else if (this.ctx.isPointInPath((pointOb.x - offset) * 2,
      (pointOb.y - offset) * 2)) {
      pointOb.x -= offset;
      pointOb.y -= offset;
      pointOb.xOffset = -offset;
      pointOb.yOffset = -offset;
    } else if (this.ctx.isPointInPath((pointOb.x - offset) * 2,
      (pointOb.y + offset) * 2)) {
      pointOb.x -= offset;
      pointOb.y += offset;
      pointOb.xOffset = -offset;
      pointOb.yOffset = offset;
    }
  },


  /**
   * Executes drip animation
   * @returns {undefined} undefined
   */
  drip() {
    for (let i = 0; i < this.dripPointObjects.length; i++) {
      const pointOb = this.dripPointObjects[i];

      tweenObject(
        pointOb,
        {
          y: pointOb.y + pointOb.dripAmount,
          strokeWidth: pointOb.strokeWidth * 0.3,
        },
        pointOb.dripTime,
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
    this.ctx.moveTo(pointOb.startX + pointOb.xOffset,
      pointOb.startY + pointOb.yOffset);
    this.ctx.lineJoin = this.ctx.lineCap = 'round';
    this.ctx.lineWidth = pointOb.strokeWidth;
    this.ctx.lineTo(pointOb.x, pointOb.y);
    this.ctx.stroke();
    this.ctx.closePath();
  },
};

export default drip;
