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

  onMessageMatch() {
    console.log('Message matched example');
    this.messageChannel('hello this is a test of the channel messaging');
  }
}

module.exports = ExampleController;
