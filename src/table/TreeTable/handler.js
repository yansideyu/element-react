import { getRowIdentity } from '../utils';

export function getInitState(data = [], isExpandAll, rowKey) {
  const expandedDatas = data.filter(row => row.children && row.children.length !== 0);
  const hiddenDatas = data.filter(row => row.__level__ !== 0);
  const expandedRows = isExpandAll ? expandedDatas.map(row => getRowId(row, rowKey)) : [];
  const hiddenRows = isExpandAll ? [] : hiddenDatas.map(row => getRowId(row, rowKey));

  return { expandedRows, hiddenRows };
}

export function getTreeTableRows(datas, treeProps, rowKey, level = 0) {
  return datas.reduce((rows, data) => {
    const children = getRowChildren(data, treeProps);
    const childrenDatas = getTreeTableRows(children, treeProps, rowKey, level + 1);
    data.__level__ = level;
    return [...rows, data, ...childrenDatas];
  }, []);
}

export function filterHiddenRows(data, hiddenRows, rowKey) {
  return data.filter(row => !hiddenRows.includes(getRowId(row, rowKey)));
}

export function getRowId(row, rowKey) {
  if (rowKey) {
    return getRowIdentity(row, rowKey);
  }
  return row;
}

export function getNestChildren(row, treeProps) {
  const { children } = treeProps;

  return row[children].reduce((results, child) => {
    return [...results, child, ...getNestChildren(child, treeProps)];
  }, []);
}

export function getRowChildren(row, treeProps) {
  const { children } = treeProps;
  return row[children];
}
