const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('trainAPI', {
  getTrainTimes: (from, to) => ipcRenderer.invoke('get-train-times', { from, to }),
  saveRoute: (from, to) => ipcRenderer.invoke('save-route', { from, to }),
  getSavedRoute: () => ipcRenderer.invoke('get-saved-route')
});
