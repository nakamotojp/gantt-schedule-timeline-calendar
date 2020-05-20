import GSTC from '../../dist/gstc.esm.js';

const iterations = 100;

const rows = {};
for (let i = 0; i < iterations; i++) {
  const withParent = i > 0 && i % 2 === 0;
  const id = i.toString();
  rows[id] = {
    id,
    label: `row id: ${id}`,
    parentId: withParent ? (i - 1).toString() : undefined,
    expanded: false,
  };
}

const startDate = GSTC.api.date().subtract(5, 'month').valueOf();

const items = {};
for (let i = 0; i < iterations; i++) {
  let rowId;
  let id = (rowId = i.toString());
  let startDayjs = GSTC.api
    .date(startDate)
    .startOf('day')
    .add(Math.floor(Math.random() * 365 * 2), 'days');
  items[id] = {
    id,
    label: 'item id ' + id,
    time: {
      start: startDayjs.valueOf(),
      end: startDayjs
        .clone()
        .add(Math.floor(Math.random() * 20) + 4, 'days')
        .endOf('day')
        .valueOf(),
    },
    rowId,
  };
}

const columns = {
  data: {
    id: {
      id: 'id',
      data: 'id',
      width: 50,
      header: {
        content: 'ID',
      },
    },
    label: {
      id: 'label',
      data: 'label',
      expander: true,
      isHTML: false,
      width: 230,
      header: {
        content: 'Label',
      },
    },
  },
};

const config = {
  list: {
    rows,
    columns,
  },
  chart: {
    items,
  },
};

var state = GSTC.api.stateFromConfig(config);
const element = document.getElementById('app');

element.addEventListener('gstc-loaded', () => {
  gstc.api.scrollToTime(gstc.api.time.date().valueOf()); // eslint-disable-line
});

var gstc = GSTC({
  element,
  state,
});

//@ts-ignore
window.state = state;
//@ts-ignore
window.gstc = gstc;