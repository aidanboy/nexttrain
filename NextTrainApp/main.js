const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Initialize electron store
const store = new Store();

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    resizable: false,
    maximizable: false
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for train data
ipcMain.handle('get-train-times', async (event, { from, to }) => {
  try {
    // We'll implement the API call here
    // For now, return dummy data
    return {
      status: 'success',
      data: {
        nextTrain: '10:00',
        platform: '1',
        status: 'On time'
      }
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message
    };
  }
});

// Save route
ipcMain.handle('save-route', async (event, { from, to }) => {
  try {
    store.set('savedRoute', { from, to });
    return { status: 'success' };
  } catch (error) {
    return {
      status: 'error',
      message: error.message
    };
  }
});

// Get saved route
ipcMain.handle('get-saved-route', async () => {
  try {
    return {
      status: 'success',
      data: store.get('savedRoute')
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message
    };
  }
});
