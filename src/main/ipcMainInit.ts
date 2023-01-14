import { ipcMain, BrowserWindow } from 'electron';
import ElectronStore from 'electron-store';
import { storeFileName } from '../appConfig';
const store = new ElectronStore({
  name: storeFileName,
});

const ipcMainInit = (mainWindow: BrowserWindow) => {
  ipcMain.on('ipc-example', async (event, arg) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    console.log(msgTemplate(arg));
    event.reply('ipc-example', msgTemplate('pong'));
  });

  ipcMain.on('electron-store-get', async (event, key) => {
    event.returnValue = store.get(key);
  });

  ipcMain.on('electron-store-set', async (event, key, value) => {
    store.set(key, value);
  });
};
export default ipcMainInit;
