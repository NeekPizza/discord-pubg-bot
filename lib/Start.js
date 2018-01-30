const Content = require('./Content.js');
const users = require('./User.js');

class Start extends Content {
  static getSuccessReason() {
    return !this.authorID in users || !users[this.authorID];
  }

  static getSuccessMessage() {
    return `has started a game! use \`!win\` or \`!loss\` to record your score!`;
  }

  static getFailureMessage() {
    return `you have already started a game. use \`!win\` or \`!loss\` to record your score before beginning a new game.`;
  }

  static getSuccessAction() {
    users[this.authorID] = true;
  }
}

module.exports = Start;
