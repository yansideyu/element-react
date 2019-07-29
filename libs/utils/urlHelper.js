export function getParamFromQuery(query, param) {
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) === param) {
      return decodeURIComponent(pair[1]);
    }
  }
  return null;
}

export function getParamFromSearch(search = '', param = '') {
  const query = search.replace(/^\?/g, '');
  return getParamFromQuery(query, param);
}

export function getStorage(key) {
  let value = null;
  try {
    value = JSON.parse(localStorage.getItem(key));
  } catch (e) {
    value = localStorage.getItem(key);
  }
  return value;
}

export function isCloudPlatform() {
  const storageCloud = getStorage('isFromCloud');
  if (storageCloud) {
    return true;
  }
  return getParamFromSearch(location.search, 'from') === 'cloud' ||
    getParamFromSearch(location.search, 'uimode') === 'nomenu';
}