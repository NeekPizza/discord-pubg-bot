const fs = require('fs');
const path = require('path');

const CONTROLLER_PATH = path.resolve('./ContentControllers');
let hasBeenInit = false;

/**
 * Controller Map of 'message': ControllerClass
 */
const controllerMap = {};

/**
 * Helper Function for controller validity
 */
function _controllerIsValid(controller = null) {
  return controller &&
    controller._classType &&
    controller.getRegisterMessage &&
    controller._classType() === 'BaseContentController' &&
    (typeof controller.getRegisterMessage() === 'string');
}

/**
 * Registers a controller to our map using the message
 * @param  {Class} controller
 * @return {void}
 */
function _registerController(controller) {
  if (!_controllerIsValid(controller)) {
    throw('Not a valid controller');
  }
  const registerMessage = controller.getRegisterMessage();
  if (
    controllerMap[registerMessage]
    && controllerMap[registerMessage] !== controller
  ) {
    throw ('Overlapping registerMessage for message: '+registerMessage);
  }
  controllerMap[registerMessage] = controller;
}


/**
 * Goes and registers all of the controllers in the folder
 */
function init() {
  const items = fs.readdirSync(CONTROLLER_PATH);

  items.forEach(file => {
    const ctrl = require(path.join(CONTROLLER_PATH, file));
    _registerController(ctrl);
  });
  hasBeenInit = true;
}

/**
 * Runs the
 * @param  {DiscordObject} message
 * @param  {Any Additional Args}  props
 * @return {void}
 */
function run(message, ...props) {
  if (!hasBeenInit) { throw('Oops, you forgot to run copterizer.init')}
  // Check if the map has the content
  if (
    !message.hasOwnProperty('content') ||
    !controllerMap[message.content]
  ) {
    return;
  }

  const _controller = controllerMap[message.content];
  const controllerInstance = new _controller(message, true);
  controllerInstance.run(...props);
}


module.exports = {
  init,
  run,
};
