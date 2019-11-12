const { getGames, getBoxScore, getPlayByPlay } = require('nba-stats-client');
const moment = require('moment');

const dataTmr = {
  id: '0021900146',
  game_url: '20191112/OKCIND',
  season_id: '22019',
  date: '20191112',
  time: '1900',
  arena: 'Bankers Life Fieldhouse',
  city: 'Indianapolis',
  state: 'IN',
  country: 'USA',
  home_start_date: '20191112',
  home_start_time: '1900',
  visitor_start_date: '20191112',
  visitor_start_time: '1800',
  previewAvailable: '1',
  recapAvailable: '0',
  notebookAvailable: '0',
  tnt_ot: '0',
  buzzerBeater: '0',
  ticket: { ticket_link: 'https://a.data.nba.com/tickets/single/2019/0021900146/WEB_MWEB' },
  period_time: {
    period_value: '',
    period_status: '7:00 pm ET',
    game_status: '1',
    game_clock: '',
    total_periods: '4',
    period_name: 'Qtr',
  },
  lp: {
    lp_video: 'true',
    condensed_bb: 'false',
    visitor: {
      audio: { ENG: 'false', SPA: 'false' },
      video: { avl: 'false', onAir: 'false', archBB: 'false' },
    },
    home: {
      audio: { ENG: 'false', SPA: 'false' },
      video: { avl: 'false', onAir: 'false', archBB: 'false' },
    },
  },
  dl: { link: [] },
  broadcasters: {
    radio: {
      broadcaster: [
        { scope: 'local', home_visitor: 'visitor', display_name: 'WWLS 98.1FM OKC' },
        { scope: 'local', home_visitor: 'home', display_name: '93.5/107.5 FM The Fan' },
      ],
    },
    tv: {
      broadcaster: [
        { scope: 'local', home_visitor: 'home', display_name: 'Fox Sports Indiana' },
        { scope: 'local', home_visitor: 'visitor', display_name: 'Fox Sports Oklahoma' },
      ],
    },
  },
  visitor: {
    id: '1610612760',
    team_key: 'OKC',
    city: 'Oklahoma City',
    abbreviation: 'OKC',
    nickname: 'Thunder',
    url_name: 'thunder',
    team_code: 'thunder',
    score: '',
  },
  home: {
    id: '1610612754',
    team_key: 'IND',
    city: 'Indiana',
    abbreviation: 'IND',
    nickname: 'Pacers',
    url_name: 'pacers',
    team_code: 'pacers',
    score: '',
  },
};

const dataYesterDay = {
  id: '0021900140',
  game_url: '20191111/MINDET',
  season_id: '22019',
  date: '20191111',
  time: '1900',
  arena: 'Little Caesars Arena',
  city: 'Detroit',
  state: 'MI',
  country: 'USA',
  home_start_date: '20191111',
  home_start_time: '1900',
  visitor_start_date: '20191111',
  visitor_start_time: '1800',
  previewAvailable: '1',
  recapAvailable: '1',
  notebookAvailable: '0',
  tnt_ot: '0',
  buzzerBeater: '0',
  ticket: { ticket_link: 'https://a.data.nba.com/tickets/single/2019/0021900140/WEB_MWEB' },
  period_time: {
    period_value: '4',
    period_status: 'Final',
    game_status: '3',
    game_clock: '',
    total_periods: '4',
    period_name: 'Qtr',
  },
  lp: {
    lp_video: 'true',
    condensed_bb: 'true',
    visitor: {
      audio: { ENG: 'false', SPA: 'false' },
      video: { avl: 'false', onAir: 'false', archBB: 'true' },
    },
    home: {
      audio: { ENG: 'false', SPA: 'false' },
      video: { avl: 'false', onAir: 'false', archBB: 'true' },
    },
  },
  dl: { link: [] },
  broadcasters: {
    radio: {
      broadcaster: [
        { scope: 'local', home_visitor: 'visitor', display_name: '830 WCCO' },
        { scope: 'local', home_visitor: 'home', display_name: '97.1 FM The Ticket' },
      ],
    },
    tv: {
      broadcaster: [
        { scope: 'local', home_visitor: 'home', display_name: 'Fox Sports Detroit' },
        { scope: 'local', home_visitor: 'visitor', display_name: 'Fox Sports North' },
      ],
    },
  },
  visitor: {
    id: '1610612750',
    team_key: 'MIN',
    city: 'Minnesota',
    abbreviation: 'MIN',
    nickname: 'Timberwolves',
    url_name: 'timberwolves',
    team_code: 'timberwolves',
    score: '120',
    linescores: {
      period: [
        { period_value: '1', period_name: 'Q1', score: '41' },
        { period_value: '2', period_name: 'Q2', score: '25' },
        { period_value: '3', period_name: 'Q3', score: '26' },
        { period_value: '4', period_name: 'Q4', score: '28' },
      ],
    },
  },
  home: {
    id: '1610612765',
    team_key: 'DET',
    city: 'Detroit',
    abbreviation: 'DET',
    nickname: 'Pistons',
    url_name: 'pistons',
    team_code: 'pistons',
    score: '114',
    linescores: {
      period: [
        { period_value: '1', period_name: 'Q1', score: '26' },
        { period_value: '2', period_name: 'Q2', score: '25' },
        { period_value: '3', period_name: 'Q3', score: '30' },
        { period_value: '4', period_name: 'Q4', score: '33' },
      ],
    },
  },
};

module.exports = async function App(context) {
  if (
    context.event.isText &&
    (isNaN(context.event.text) || !moment(context.event.text, 'YYYY/M/D', true).isValid())
  ) {
    const timestamp = isNaN(context.event.text)
      ? moment(context.event.text, 'YYYY/M/D')
      : moment()
          .startOf('day')
          .add(+context.event.text, 'days');

    const gamesData = await getGames({
      year: timestamp.format('YYYY'),
      month: timestamp.format('M'),
      day: timestamp.format('D'),
    });

    const { sports_content } = gamesData;
    const { games } = sports_content;
    const { game } = games;
    const scores = game.map(({ visitor, home }) => {
      const score = `${visitor.abbreviation} ${visitor.score} : ${home.abbreviation} ${home.score}`;
      return score;
    });
    await context.sendText(`${timestamp.format('YYYY/MM/DD')}\n${scores.join('\n')}`);
    return;
  } else {
    await context.sendText(
      `Please enter a date like 2019/11/11.\n You can also enter a number to indicate some day before now.\nFor example, -1 indicates yesterday and -2 indicates the day before yesterday.`
    );
  }
};
