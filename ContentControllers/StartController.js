const path = require('path');
const BaseContentController = require(path.join(__dirname, '../copterizer/BaseContentController.js'));
const users = require('../lib/User.js');

class StartController extends BaseContentController {
  static getRegisterMessage() {
    return '!start';
  }

  getSuccessCondition() {
    return !this.authorID in users || !users[this.authorID];
  }

  getSuccessMessage() {
    return `has started a game! use \`!win\` or \`!loss\` to record your score!`;
  }

  getFailureMessage() {
    return `you have already started a game. use \`!win\` or \`!loss\` to record your score before beginning a new game.`;
  }

  getSuccessAction() {
    users[this.authorID] = true;
  }
}

module.exports = StartController;
