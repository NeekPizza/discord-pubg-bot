function throwOverrideError(content) {
  throw(`Content::${content}(): Override this function.`);
}

class BaseContentController {
  /**
   * Sets the content channel and everything
   * @param {[type]}  options.channel
   * @param {[type]}  options.content
   * @param {[type]}  options.author
   * @param {Boolean} test
   */
  constructor({channel = null, content = null, author = null}, test = false) {
    this.channel = channel;
    this.content = content;
    this.author = author.name;
    this.authorID = author.id;
    this.testMode = test;

    this.messagePrefix = `***${this.author}***`;
    if (!channel || !content || !author) {
      throw('No. Bad puppers.');
    }
    return this;
  }

  /**
   * Don't override this or do anything with this
   * @return {string}
   */
  static _classType() {
    return 'BaseContentController';
  }

  /**
   * Sets the message that
   * calls the run function of this controller
   * @return {string}
   */
  static getRegisterMessage() {
    throwOverrideError('getMagicMessage');
  }

  // Reasons
  /**
     to run succcess actions
   * @return {boolean}
   */
  getSuccessCondition() {
    throwOverrideError('getSuccessCondition');
  }

  // Actions
  /**
   * SuccessAction on successReason
   * @return {void}
   */
  getSuccessAction(...props) {}
  getFailureAction(...props) {}

  // Messages
  /**
   * Message to send on success if exists
   * @return {[type]} [description]
   */
  getSuccessMessage() {}
  getFailureMessage() {}

  /**
   * Runs the queries based on the successCondition
   * @param  {...any} props passed to actions
   * @return {self}
   */
  run(...props) {
    const isSuccess = this.getSuccessCondition();
    const message = isSuccess
      ? this.getSuccessMessage()
      : this.getFailureMessage();

    if (isSuccess) {
      this.getSuccessAction(...props);
    } else {
      this.getFailureAction(...props);
    }

    this.message(message);

    return this;
  }

  /**
   * Throws a message to the channel
   * @param  {string} message
   * @return {self}
   */
  message(message = null) {
    if (!message) {
      return this;
    }

    if (!this.channel || !this.channel.send) {
      console.log(`${this.messagePrefix}, ${message}`);
      return this;
    }
    this.channel.send(`${this.messagePrefix}, ${message}`);
    return this;
  }
}

module.exports = BaseContentController;
