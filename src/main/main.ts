/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint global-require: off, no-console: off, promise/always-return: off */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import fs from 'fs';
import { resolveHtmlPath } from './util';

let mainWindow: BrowserWindow | null = null;
let isDialogOpen = false;

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
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('bill.png'),
    // autoHideMenuBar: true,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  function sendMessage(ch: string, text: string) {
    // @ts-ignore
    mainWindow.webContents.send(ch, text);
  }
  ipcMain.on('ipc-example', async (event, arg) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    console.log(msgTemplate(arg));
    event.reply('ipc-example', msgTemplate('pong'));
  });
  ipcMain.on('UPDATE', async (event, _arg) => {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdates();
    event.reply('UPDATE', 'update request received');
  });
  autoUpdater.on('checking-for-update', () => {
    sendMessage('message', 'Checking for update');
  });
  autoUpdater.on('update-available', (_info) => {
    sendMessage('message', 'Update available');
  });
  autoUpdater.on('update-not-available', (_info) => {
    sendMessage('message', 'Update not available');
  });
  autoUpdater.on('error', (err) => {
    sendMessage('message', 'Update not available');
    console.log(err);
  });
  autoUpdater.on('download-progress', (progressObj) => {
    let logmessage = `Download speed: ${progressObj.bytesPerSecond}`;
    logmessage = `${logmessage} - Downloaded ${progressObj.percent}%`;
    logmessage = `${logmessage} (${progressObj.transferred}/${progressObj.total})`;
    sendMessage('message', `Downloaded ${Math.floor(progressObj.percent)}%`);
  });
  autoUpdater.on('update-downloaded', (_info) => {
    sendMessage('message', 'Update downloaded');
    autoUpdater.quitAndInstall();
  });
  mainWindow.loadURL(resolveHtmlPath('index.html'));
  mainWindow.maximize();
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
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

const DEFAULT_FOLDER = `${app.getPath('userData')}/userData`;
const INVOICE_FOLDER = `${app.getPath(
  'documents'
)}/${app.getName()}/userData/INVOICE`;
const PRODUCT_DATA = `${app.getPath('userData')}/userData/data.json`;
const COUNT_DATA = `${app.getPath('userData')}/userData/count.json`;

app.on('ready', () => {
  if (fs.existsSync(DEFAULT_FOLDER)) {
    console.log('Directory exists!');
  } else {
    fs.mkdirSync(DEFAULT_FOLDER);
  }
  if (fs.existsSync(INVOICE_FOLDER)) {
    console.log('Directory exists!');
  } else {
    fs.mkdirSync(INVOICE_FOLDER, { recursive: true });
  }
  if (fs.existsSync(PRODUCT_DATA)) {
    console.log(`\n\n\n\n\n${app.getPath('userData')}\n\n\n\n\n`);
  } else {
    fs.writeFileSync(PRODUCT_DATA, JSON.stringify({ allData: [] }));
  }
  if (fs.existsSync(COUNT_DATA)) {
    fs.readFile(COUNT_DATA, 'utf8', (_err, data) => {
      const d = JSON.parse(data);
      if (d.c.CSTM === undefined) {
        d.c.CSTM = 1000;
        fs.writeFileSync(COUNT_DATA, JSON.stringify(d));
      }
    });
  } else {
    fs.writeFileSync(
      COUNT_DATA,
      JSON.stringify({ c: { TI: 1000, BS: 1000, Estd: 1000, CSTM: 1000 } })
    );
  }
  console.clear();
});
ipcMain.on('addNewItem', async (event, arg) => {
  const val = arg[0];
  if (val === '') {
    event.reply('addNewItem', 'Name must not be null');
  } else {
    const n = { productName: val };
    fs.readFile(PRODUCT_DATA, 'utf8', (err, data) => {
      if (err) {
        event.reply('addNewItem', 'Can not read file');
      }
      const d = JSON.parse(data);
      d.allData.push(n);
      fs.writeFileSync(PRODUCT_DATA, JSON.stringify(d));
    });
    event.reply('addNewItem', 'Added successfully');
  }
});
ipcMain.on('FetchItems', async (event, _arg) => {
  fs.readFile(PRODUCT_DATA, 'utf8', (err, data) => {
    if (err) {
      event.reply('FetchItems', [{ productName: 'No product found' }]);
    }
    const d = JSON.parse(data);

    event.reply('FetchItems', d.allData);
  });
});
ipcMain.on('DeleteItem', async (event, _arg) => {
  fs.readFile(PRODUCT_DATA, 'utf8', (err, data) => {
    if (err) {
      event.reply('FetchItems', [{ productName: 'No product found' }]);
    }
    const d = JSON.parse(data);
    d.allData.splice(_arg, 1);
    fs.writeFileSync(PRODUCT_DATA, JSON.stringify(d));
    event.reply('FetchItems', d.allData);
  });
});
ipcMain.on('INVOICENO', async (event, _arg) => {
  fs.readFile(COUNT_DATA, 'utf8', (err, data) => {
    if (err) {
      event.reply('FetchItems', {});
    }
    const d = JSON.parse(data);
    event.reply('INVOICENO', d);
  });
});
ipcMain.on('Dialog', async (_event, _arg) => {
  dialog.showErrorBox(
    'Duplicate Entry Detected',
    'You have already added this product'
  );
});
ipcMain.on('ASK_USER', async (_event, _arg) => {
  dialog
    .showMessageBox({
      message: _arg[0],
      type: 'question',
      buttons: ['Yes', 'No'],
    })
    .then((choice) => {
      _event.reply('ASK_USER', choice);
    })
    .catch((e) => {
      console.log(e);
    });
});
ipcMain.on('SAVE_INVOICE', async (_event, _arg) => {
  if (_arg[1] !== 'SJ0') {
    const date = new Date();
    const d = date.getDate();
    const m = date.getMonth();
    const y = date.getFullYear();
    const fdr = `${d > 9 ? d : `0${d}`}-${m > 9 ? m : `0${m}`}-${y}`;
    if (fs.existsSync(`${INVOICE_FOLDER}/${fdr}`)) {
      console.log('Directory exists!');
    } else {
      fs.mkdirSync(`${INVOICE_FOLDER}/${fdr}`, { recursive: true });
    }
    if (fs.existsSync(`${INVOICE_FOLDER}/${fdr}/${_arg[1]}.json`)) {
     console.log("exist")
    } else {
      const data = { data: _arg[0], id: _arg[1], date: fdr };
      fs.writeFileSync(
        `${INVOICE_FOLDER}/${fdr}/${_arg[1]}.json`,
        JSON.stringify(data)
      );
      fs.readFile(COUNT_DATA, 'utf8', (_err, f) => {
        console.log('\nsaving invoice\n');
        const dd = JSON.parse(f);
        const c = dd.c.TI + 1;
        dd.c.TI = c;
        fs.writeFileSync(COUNT_DATA, JSON.stringify(dd));
        if (!isDialogOpen) {
          isDialogOpen = true;
          dialog
            .showMessageBox({
              message: 'Saved successfully.',
              type: 'info',
              buttons: ['Ok'],
            })
            .then((_e) => {
              isDialogOpen = false;
            })
            .catch((_e) => {
              console.log('error');
            });
        }
      });
    }
  }
});
const getAllFilesHelper = (dirPath: string, arrayOfFiles: string[]) => {
  const files = fs.readdirSync(dirPath);
  // eslint-disable-next-line no-param-reassign
  arrayOfFiles = arrayOfFiles || [];
  files.forEach((file) => {
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      // eslint-disable-next-line no-param-reassign
      arrayOfFiles = getAllFilesHelper(`${dirPath}/${file}`, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, '/', file));
    }
  });

  return arrayOfFiles;
};
const getAllFiles2 = (dirPath: string, arrayOfFiles: string[]) => {
  const files = fs.readdirSync(dirPath);

  // eslint-disable-next-line no-param-reassign
  arrayOfFiles = arrayOfFiles || [];
  files.forEach((file) => {
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      // eslint-disable-next-line no-param-reassign
      arrayOfFiles = getAllFiles2(`${dirPath}/${file}`, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, '/', file));
    }
  });
  return arrayOfFiles;
};
const getAllFiles = (dirPath: string, arrayOfFiles: string[]) => {
  const files = fs.readdirSync(dirPath);

  // eslint-disable-next-line no-param-reassign
  arrayOfFiles = arrayOfFiles || [];
  if (files.length <= 2) {
    console.log(1);
    // eslint-disable-next-line no-param-reassign
    arrayOfFiles = getAllFiles2(`${dirPath}`, arrayOfFiles);
  } else {
    console.log(2);
    // eslint-disable-next-line no-param-reassign
    arrayOfFiles = getAllFilesHelper(
      `${dirPath}/${files[files.length - 1]}`,
      arrayOfFiles
    );
    // eslint-disable-next-line no-param-reassign
    arrayOfFiles = getAllFilesHelper(
      `${dirPath}/${files[files.length - 2]}`,
      arrayOfFiles
    );
  }

  return arrayOfFiles;
};
ipcMain.on('getinvoice', async (_event, _arg) => {
  const allF = getAllFiles(INVOICE_FOLDER, []);
  const a: object[] = [];
  allF.forEach((fl: string) => {
    fs.readFile(fl, 'utf8', (_err, f) => {
      const d = JSON.parse(f);
      a.push(d);
      _event.reply('sentINVOICE', a);
    });
  });
});
ipcMain.on('delInvoice', async (_event, _arg) => {
  const filePath = `${INVOICE_FOLDER}/${_arg[0]}/${_arg[1]}.json`;
  dialog
    .showMessageBox({
      message: `Do you want to delete ${_arg[1]} ?`,
      type: 'question',
      buttons: ['Yes', 'No'],
    })
    .then((choice) => {
      if (choice.response === 0) {
        fs.unlink(filePath, (err) => {
          if (err) console.log(err);
          console.log('Deleted');
        });
      }
      fs.readdir(`${INVOICE_FOLDER}/${_arg[0]}`, (_er, files) => {
        if (files.length === 0) {
          fs.rmdir(`${INVOICE_FOLDER}/${_arg[0]}`, (e) => {
            console.log(e);
          });
        }
      });
      _event.reply('CONF_DELETE', true);
    })
    .catch((e) => {
      console.log(e);
    });
});
ipcMain.on('getVersion', async (_event, _arg) => {
  _event.reply('getVersion', app.getVersion());
});

ipcMain.on('estdfinal', async (_event, _arg) => {
  fs.readFile(COUNT_DATA, 'utf8', (_err, f) => {
    const dd = JSON.parse(f);
    const c = dd.c.Estd + 1;
    dd.c.Estd = c;
    fs.writeFileSync(COUNT_DATA, JSON.stringify(dd));
  });
  if (!isDialogOpen) {
    isDialogOpen = true;
    dialog
      .showMessageBox({
        message: 'Saved successfully.',
        type: 'info',
        buttons: ['Ok'],
      })
      .then((_e) => {
        isDialogOpen = false;
      })
      .catch((_e) => {
        console.log('error');
      });
  }
});
ipcMain.on('bosfinal', async (_event, _arg) => {
  fs.readFile(COUNT_DATA, 'utf8', (_err, f) => {
    const dd = JSON.parse(f);
    const c = dd.c.BS + 1;
    dd.c.BS = c;
    fs.writeFileSync(COUNT_DATA, JSON.stringify(dd));
  });
  if (!isDialogOpen) {
    isDialogOpen = true;
    dialog
      .showMessageBox({
        message: 'Saved successfully.',
        type: 'info',
        buttons: ['Ok'],
      })
      .then((_e) => {
        isDialogOpen = false;
      })
      .catch((_e) => {
        console.log('error');
      });
  }
});
