/**
 * ChartTimelineGridRow component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   GPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

/**
 * Bind element action
 * @param {Element} element
 * @param {any} data
 * @returns {object} with update and destroy
 */
function bindElementAction(element, data) {
  data.state.update(
    '_internal.elements.chart-timeline-grid-rows',
    function updateGridRows(rows) {
      if (typeof rows === 'undefined') {
        rows = [];
      }
      rows.push(element);
      return rows;
    },
    { only: null }
  );
  return {
    update() {},
    destroy(element) {
      data.state.update('_internal.elements.chart-timeline-grid-rows', rows => {
        return rows.filter(el => el !== element);
      });
    }
  };
}

export default function ChartTimelineGridRow(vido, props) {
  const { api, state, onDestroy, Actions, update, html, reuseComponents, onChange, StyleMap } = vido;
  const componentName = 'chart-timeline-grid-row';
  const actionProps = {
    ...props,
    api,
    state
  };
  let wrapper;
  onDestroy(
    state.subscribe('config.wrappers.ChartTimelineGridRow', value => {
      wrapper = value;
      update();
    })
  );

  const GridBlockComponent = state.get('config.components.ChartTimelineGridRowBlock');

  const componentActions = api.getActions(componentName);
  let className = api.getClass(componentName);

  let styleMap = new StyleMap({
    width: props.width + 'px',
    height: props.row.height + 'px',
    opacity: '1',
    pointerEvents: 'all',
    overflow: 'hidden'
  });

  let rowsBlocksComponents = [];
  const onPropsChange = (changedProps, options) => {
    if (options.leave) {
      styleMap.style.opacity = '0';
      styleMap.style.pointerEvents = 'none';
      update();
      return;
    }
    props = changedProps;
    reuseComponents(rowsBlocksComponents, props.blocks, block => block, GridBlockComponent);
    //const compensation = state.get('config.scroll.compensation');
    // @ts-ignore
    styleMap.style = {};
    styleMap.style.opacity = '1';
    styleMap.style.pointerEvents = 'all';
    styleMap.style.height = props.row.height + 'px';
    styleMap.style.width = props.width + 'px';
    //styleMap.style.top = props.top + compensation + 'px';
    const rows = state.get('config.list.rows');
    for (const parentId of props.row._internal.parents) {
      const parent = rows[parentId];
      const childrenStyle = parent.style?.grid?.row?.children;
      if (childrenStyle) styleMap.style = { ...styleMap.style, ...childrenStyle };
    }
    const currentStyle = props.row?.style?.grid?.row?.current;
    if (currentStyle) styleMap.style = { ...styleMap.style, ...currentStyle };
    for (const prop in props) {
      actionProps[prop] = props[prop];
    }
    update();
  };
  onChange(onPropsChange);

  onDestroy(() => {
    rowsBlocksComponents.forEach(rowBlock => rowBlock.destroy());
  });

  if (componentActions.indexOf(bindElementAction) === -1) {
    componentActions.push(bindElementAction);
  }

  const actions = Actions.create(componentActions, actionProps);
  return templateProps => {
    return wrapper(
      html`
        <div class=${className} data-actions=${actions} style=${styleMap}>
          ${rowsBlocksComponents.map(r => r.html())}
        </div>
      `,
      { vido, props, templateProps }
    );
  };
}
