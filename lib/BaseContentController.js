function throwOverrideError(content) {
  throw(`Content::${content}(): Override this function.`);
}

class BaseContentController {
  static setContent({channel = null, content = null, author = null}, test = false) {
    this.channel = channel;
    this.content = content;
    this.author = author;
    this.authorID = author && author.id;
    this.testMode = test;
    if (!channel || !content || !author) {
      throw('No. Bad puppers.');
    }
    return this;
  }

  static run(...props) {
    if (this.getSuccessReason()) {
      this.getSuccessAction(...props);
      this.message(this.getSuccessMessage());
    } else {
      this.getFailureAction(...props);
      this.message(this.getFailureMessage());
    }
    return this;
  }

  // Reasons
  static getSuccessReason() {
    throwOverrideError('getSuccessReason');
  }

  // Actions
  static getSuccessAction() {
    throwOverrideError('getSuccessAction');
  }
  static getFailureAction() {}

  // Messages
  static getSuccessMessage() {
    throwOverrideError('getSuccessMessage');
  }
  static getFailureMessage() {
    throwOverrideError('getFailureMessage');
  }

  static message(message) {
    const START_MESSAGE = `***${this.author}***`;
    if (this.testMode) {
      console.log(`${START_MESSAGE}, ${message}`);
    } else {
      this.channel.send(`${START_MESSAGE}, ${message}`);
    }
  }
}

module.exports = BaseContentController;
