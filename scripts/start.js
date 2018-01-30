function start (users, {channel, content, author}) {
  const _startSuccess = () => {
    users[author.id] = true;
    channel.send(`***${author}*** , has started a game! use \`!win\` or \`!loss\` to record your score!`);
  };
  const _startFailure = () => {
    channel.send(`***${author}*** , you have already started a game. use \`!win\` or \`!loss\` to record your score before beginning a new game.`);
  }
}
