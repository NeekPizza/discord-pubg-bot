const Copterizer = require('./copterizer/Router.js');

const message = {content: '!example', channel: {}, author: {name: 'asdf', id: '1234'}};

Copterizer.init();
Copterizer.processMessage(message);
