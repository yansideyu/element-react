import { isCloudPlatform } from './urlHelper';

export function notifyDialogOpen() {
  if (isCloudPlatform() && window.parent) {
    window.parent.postMessage('dialogOpen', '*');
  }
}

export function notifyDialogClose() {
  if (isCloudPlatform() && window.parent) {
    window.parent.postMessage('dialogClose', '*');
  }
}
