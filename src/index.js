const { getGames } = require('nba-stats-client');
const moment = require('moment');

module.exports = async function App(context) {
  if (context.event.isText && moment(context.event.text, 'YYYY/M/D', true).isValid()) {
    const timestamp = moment(context.event.text, 'YYYY/M/D');
    const data = await getGames({
      year: timestamp.format('YYYY'),
      month: timestamp.format('M'),
      day: timestamp.format('D'),
    });

    const games = data.sports_content.games.game;
    const scores = games.map(({ visitor, home }) => {
      const score = `${visitor.abbreviation} ${visitor.score} : ${home.abbreviation} ${home.score}`;
      return score;
    });

    await context.sendText(`${timestamp.format('YYYY/MM/DD')}\n${scores.join('\n')}`);
  }
};
