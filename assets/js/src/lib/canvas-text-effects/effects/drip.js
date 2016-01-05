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
      const strokeWidth = _.random(2, 5);
      const dripAmount = (strokeWidth * 50) + (Math.random() * 300);
      const dripTime = 5000 + (strokeWidth * 1000);
      const pointOb = {
        strokeWidth,
        index: i,
        startX: dripPoints[i].x,
        startY: dripPoints[i].y,
        x: dripPoints[i].x,
        y: dripPoints[i].y,
      };

      this.drawRandomShape(pointOb.startX, pointOb.startY, strokeWidth / 1.5);
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
   * Creates a random 'blob' shape that the drip can start from
   * @param {Number} startX - The x position  for the center of the shape
   * @param {Number} startY - The y position  for the center of the shape
   * @param {Number} radius - The radius of the shape
   * @returns {undefined} undefined
   */
  drawRandomShape(startX, startY, radius) {
    const _this = this;
    const numPoints = _.sample([5, 7]);
    const points = [];

    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);

    for (let i = 0; i < numPoints + 1; i++) {
      const offset = _.random(-(radius / 3), (radius / 3));
      const x = (startX + radius * Math.cos(2 * Math.PI * i / numPoints)) + offset;
      const y = (startY + radius * Math.sin(2 * Math.PI * i / numPoints)) + offset;

      points.push([x, y]);

      if (i === 0) {
        _this.ctx.moveTo(x, y);
      } else {
        _this.ctx.arcTo(points[i - 1][0], points[i - 1][1], x, y, radius / 2);
      }
    }

    this.ctx.closePath();
    this.ctx.fill();
  },


  /**
   * Draws the drip at its current state throughout the animation
   * @param {Object} pointOb - An object containg data about the current 'drip'
   * @returns {undefined} undefined
   */
  onDripUpdate(pointOb) {
    this.ctx.beginPath();
    this.ctx.moveTo(pointOb.startX, pointOb.startY);
    this.ctx.lineJoin = this.ctx.lineCap = 'round';
    this.ctx.lineWidth = pointOb.strokeWidth;
    this.ctx.lineTo(pointOb.x, pointOb.y);
    this.ctx.stroke();
    //this.ctx.arc(pointOb.x, pointOb.y + 5, pointOb.strokeWidth / 2, 0, 2 * Math.PI, true);
    //this.ctx.fill();
    this.ctx.closePath();
  },
};

export default drip;
