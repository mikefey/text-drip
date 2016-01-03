import TWEEN from 'tween.js';


/**
 * Tweens an object's properties
 * @param {Object} object - The object being tweened
 * @param {Object} properties - The object properties being tweened
 * @param {Number} time - The time to perform the tween (in milliseconds)
 * @param {Function} callback - A function to call on each update
 * @param {Function} easing - The easing function to use
 * @returns {Object} the TWEEN object
 */
export function tweenObject(object, properties, time, callback, easing) {
  let easingOb = null;
  let doTween = true;
  let twn = new TWEEN.Tween(object).to(properties, time);

  if (!easing) {
    easingOb = TWEEN.Easing.Quadratic.Out;

    twn.easing(easingOb);
  }


  twn.onComplete(function onComplete() {
    doTween = false;
  });

  if (callback) {
    twn.onUpdate(function onUpdate() {
      callback(object);
    });
  }

  twn.start();

  const animate = function animate() {
    TWEEN.update();

    if (doTween) {
      window.requestAnimationFrame(animate);
    } else {
      twn = null;
    }
  };

  animate();

  return twn;
}
