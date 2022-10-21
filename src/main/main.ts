/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { promises as fs } from 'fs';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { v4 as uuidv4 } from 'uuid';
import { ITask } from 'interfaces/ITask';
import { IWallet } from 'interfaces/IWallet';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    center: true,
    show: false,
    resizable: true,
    minWidth: 1150,
    minHeight: 775,
    width: 1150,
    height: 775,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      devTools: isDebug,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.setMenu(null);

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

/**
 * Add file read/writes
 */

app.on('ready', () => {
  // create tasks.json if it doesn't exist
  fs.writeFile(
    path.join(app.getPath('userData'), 'tasks.json'),
    JSON.stringify([]),
    { flag: 'wx' }
  );

  // create tasks.json if it doesn't exist
  fs.writeFile(
    path.join(app.getPath('userData'), 'wallets.json'),
    JSON.stringify([]),
    { flag: 'wx' }
  );

  // create tasks.json if it doesn't exist
  fs.writeFile(
    path.join(app.getPath('userData'), 'settings.json'),
    JSON.stringify({ rpc: '', etherscan: '', webhook: '' }),
    { flag: 'wx' }
  );
});

// TODO: make sure files exist before reading/writing

// add task
ipcMain.handle(
  'add-task',
  async (
    event,
    task: {
      [k: string]: FormDataEntryValue;
    }
  ) => {
    // build new task array for concat later
    const newTasksArr: ITask[] = [];

    // get number of wallets
    let numWallets: number;

    // manual task will have 7 + 3 * numWallets keys
    if (task.mode === 'Manual') {
      numWallets = (Object.keys(task).length - 8) / 3;
    } else {
      // automatic task TBD
      // temporary variable to satisfy numWallets not being assigned
      numWallets = 1;
    }

    // create tasks for each wallet
    for (let i = 0; i < numWallets; i += 1) {
      const newTask: ITask = {
        id: uuidv4(),
        privateKey: task[`wallets[${i}][privateKey]`].toString(),
        walletAddress: task[`wallets[${i}][address]`].toString(),
        contract: task.contract.toString(),
        mintFunction: task.mintFunction.toString(),
        mode: task.mode.toString() === 'Manual' ? 'Manual' : 'Automatic',
        mintPrice: task.mintPrice.toString(),
        quantity: Number(task.quantity),
        maxGas: Number(task.maxGas),
        priorityFee: Number(task.priorityFee),
        status: 'Created',
      };

      newTasksArr.push(newTask);
    }

    // get current tasks
    const currentTasksStr = await fs.readFile(
      path.join(app.getPath('userData'), 'tasks.json'),
      'utf-8'
    );
    const currentTasks = JSON.parse(currentTasksStr);

    // push to tasks array
    const combinedTasks = currentTasks.concat(newTasksArr);
    fs.writeFile(
      path.join(app.getPath('userData'), 'tasks.json'),
      JSON.stringify(combinedTasks)
    );
  }
);

// edit task

// delete task
ipcMain.handle('delete-task', async (event, taskId: string) => {
  // get current wallets
  const currentTasksStr = await fs.readFile(
    path.join(app.getPath('userData'), 'tasks.json'),
    'utf-8'
  );
  const currentTasks = JSON.parse(currentTasksStr);

  // remove task from array
  const filteredTasks = currentTasks.filter(
    (inLoopTask: ITask) => inLoopTask.id !== taskId
  );

  // re-write tasks.json
  fs.writeFile(
    path.join(app.getPath('userData'), 'tasks.json'),
    JSON.stringify(filteredTasks)
  );
});

// fetch tasks
ipcMain.handle('fetch-tasks', async () => {
  // read tasks.json
  const tasks = await fs.readFile(
    path.join(app.getPath('userData'), 'tasks.json'),
    'utf-8'
  );
  return tasks;
});

// clear tasks

// add wallet
ipcMain.handle(
  'add-wallet',
  async (
    event,
    wallet: {
      [k: string]: FormDataEntryValue;
    }
  ) => {
    // get current wallets
    const currentWalletsStr = await fs.readFile(
      path.join(app.getPath('userData'), 'wallets.json'),
      'utf-8'
    );
    const currentWallets = JSON.parse(currentWalletsStr);

    // push to wallet array
    currentWallets.push(wallet);
    fs.writeFile(
      path.join(app.getPath('userData'), 'wallets.json'),
      JSON.stringify(currentWallets)
    );
  }
);

// delete wallet
ipcMain.handle('delete-wallet', async (event, wallet: string) => {
  // get current wallets
  const currentWalletsStr = await fs.readFile(
    path.join(app.getPath('userData'), 'wallets.json'),
    'utf-8'
  );
  const currentWallets = JSON.parse(currentWalletsStr);

  // remove wallet from array
  const filteredWallets = currentWallets.filter(
    (inLoopWallet: IWallet) => inLoopWallet.address !== wallet
  );

  // re-write wallets.json
  fs.writeFile(
    path.join(app.getPath('userData'), 'wallets.json'),
    JSON.stringify(filteredWallets)
  );
});

// fetch wallets
ipcMain.handle('fetch-wallets', async () => {
  // read wallets.json
  const wallets = await fs.readFile(
    path.join(app.getPath('userData'), 'wallets.json'),
    'utf-8'
  );
  return wallets;
});

// update settings
ipcMain.handle('update-settings', (event, settings: string) => {
  // update settings.json with user input settings
  fs.writeFile(path.join(app.getPath('userData'), 'settings.json'), settings);
});

// fetch settings
ipcMain.handle('fetch-settings', async () => {
  // read settings.json
  const settings = await fs.readFile(
    path.join(app.getPath('userData'), 'settings.json'),
    'utf-8'
  );
  return settings;
});
