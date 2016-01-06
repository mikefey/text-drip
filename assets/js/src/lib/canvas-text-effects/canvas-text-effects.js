import _ from 'lodash';
import Opentype from 'opentype.js';


const canvasTextEffects = {
  /**
   * Loads a font file and fires a callback, if defined
   * @param {String} fontPath - The path to the font file to use
   * @param {Function} onLoad - The callback to fire when the font is loaded
   * and parsed
   * @returns {undefined} undefined
   */
  setup(fontPath, onLoad) {
    const _this = this;

    Opentype.load(fontPath, function fontLoaded(err, font) {
      if (err) {
        // font could not be loaded
      } else {
        const buffer = font.toArrayBuffer();

        _this.parsedFont = Opentype.parse(buffer);

        if (onLoad) {
          onLoad();
        }
      }
    });
  },


  /**
   * Gets a an Opentype font path object
   * @param {Number} x - The left position to start rendering the text at
   * @param {Number} y - The top position to start rendering the text at
   * @param {Number} fontSize - The fontSize to render the text at
   * @param {Number} distortAmount - An amount, in pixels, to randomly offset
   * some of the text points by
   * @returns {Object} An object containing the parsed font's data
   */
  getPath(text, x, y, fontSize, distortAmount, kerning = true) {
    const fontPath = this.parsedFont.getPath(text, x, y, fontSize, { kerning });

    if (distortAmount) {
      for (let i = 0; i < fontPath.commands.length; i++) {
        const randDistort = _.random(0, 1);

        if (randDistort) {
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
    }

    return fontPath;
  },


  /**
   * Adds the text path to the a 2D context object. Does not begin or end path,
   * simply adds the commands to the context state.
   * @param {Object} path - An opentpe image path object
   * @param {Object} context - A canvas 2d context
   */
  renderText(path, context) {
    context.beginPath();

    for (let i = 0; i < path.commands.length; i++) {
      const command = path.commands[i];

      if (command.type === 'M') {
        context.moveTo(command.x, command.y);
      }

      if (path.commands[i].type === 'L') {
        context.lineTo(command.x, command.y);
      }

      if (path.commands[i].type === 'C') {
        context.bezierCurveTo(command.x1,
          command.y1,
          command.x2,
          command.y2,
          command.x,
          command.y);
      }

      if (path.commands[i].type === 'Q') {
        context.quadraticCurveTo(command.x1,
          command.y1,
          command.x2,
          command.y2,
          command.x,
          command.y);
      }
    }
  },
};

export default canvasTextEffects;
