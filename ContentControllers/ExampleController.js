const BaseContentController = require('../copterizer/BaseContentController.js');
const users = require('../lib/User.js');

class ExampleController extends BaseContentController {
  static getRegisterMessage() {
    return '!example';
  }

  getSuccessCondition() {
    return true;
  }

  getSuccessMessage() {
    return `This is an example of the Framework.`;
  }

  getFailureMessage() {
    return `This is not an example of the framework :(`;
  }

  getSuccessAction() {}
}

module.exports = ExampleController;
