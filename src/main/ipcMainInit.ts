import { ipcMain, BrowserWindow, dialog, clipboard } from 'electron';
import { Upload } from 'web3.storage';
import {
  getWeb3List,
  uploadToWeb3,
  renameUpload,
  deleteFilesFromWeb3,
} from './w3Service';
import { store } from './store';
import { getFileInfo } from './util';
import { UploadStatus } from './type';

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

  ipcMain.handle('openDialog', async (event, args) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'please select files',
      properties: [
        'openFile',
        'openDirectory',
        'multiSelections',
        'showHiddenFiles',
      ],
      message: 'please select files',
    });
    if (canceled) return;
    else {
      return filePaths;
    }
  });

  ipcMain.handle('uploadFiles', async (event, filePaths: string[]) => {
    const token = store.get('currToken') as string;

    const tmpFilePaths = filePaths.map((filePath) => {
      const { size, name } = getFileInfo(filePath);
      const uuid = `${name}_${(Math.random() * 1000000).toFixed(0)}`.replace(
        /[\.-]/g,
        ''
      );
      return { size, name, uuid };
    });

    tmpFilePaths.forEach(({ name, size, uuid }) => {
      const key = `uploadingList.${uuid}`;
      store.set(key, {
        uuid,
        name,
        size,
        status: UploadStatus.READY,
        progress: 0,
      });
    });
    for (let i = 0; i < tmpFilePaths.length; i++) {
      const { size, name, uuid } = tmpFilePaths[i];
      uploadToWeb3(filePaths[i], token, { size, name, uuid });
    }
  });

  ipcMain.handle('uploadingList', async (event) => {
    let list = [];
    const uploadingListObj = store.get('uploadingList');
    if (uploadingListObj) list = Object.values(uploadingListObj);
    return list;
  });

  ipcMain.handle('fileList', async (event) => {
    let list = [];
    const token = store.get('currToken') as string;
    list = await getWeb3List(token);
    return list;
    // return [
    //   {
    //     _id: '315318962367882174',
    //     type: 'Car',
    //     name: 'wifi.asp',
    //     created: '2023-01-14T13:03:31.9+00:00',
    //     updated: '2023-01-14T13:03:31.9+00:00',
    //     cid: 'bafybeibgqkpnxvowkehmq5omlvr5cfta6zglk3nji5bxeajc2edcbstiwx',
    //     dagSize: 25085,
    //     pins: [
    //       {
    //         status: 'Pinned',
    //         updated: '2023-01-13T13:03:31.9+00:00',
    //         peerId:
    //           'bafzbeibhqavlasjc7dvbiopygwncnrtvjd2xmryk5laib7zyjor6kf3avm',
    //         peerName: 'elastic-ipfs',
    //         region: null,
    //       },
    //     ],
    //     deals: [],
    //   },
    //   {
    //     _id: '315318962367882174',
    //     type: 'Car',
    //     name: 'wifi.asp',
    //     created: '2023-01-15T13:03:31.9+00:00',
    //     updated: '2023-01-15T13:03:31.9+00:00',
    //     cid: 'bafybeibgqkpnxvowkehmq5omlvr5cfta6zglk3nji5bxeajc2edcbstiwi',
    //     dagSize: 25085,
    //     pins: [
    //       {
    //         status: 'Pinned',
    //         updated: '2023-01-13T13:03:31.9+00:00',
    //         peerId:
    //           'bafzbeibhqavlasjc7dvbiopygwncnrtvjd2xmryk5laib7zyjor6kf3avm',
    //         peerName: 'elastic-ipfs',
    //         region: null,
    //       },
    //     ],
    //     deals: [],
    //   },
    //   {
    //     _id: '315318962367882174',
    //     type: 'Car',
    //     name: 'wifi.asp',
    //     created: '2023-01-13T13:03:31.9+00:00',
    //     updated: '2023-01-13T13:03:31.9+00:00',
    //     cid: 'bafybeibgqkpnxvowkehmq5omlvr5cfta6zglk3nji5bxeajc2edcbstiwj',
    //     dagSize: 25085,
    //     pins: [
    //       {
    //         status: 'Pinned',
    //         updated: '2023-01-13T13:03:31.9+00:00',
    //         peerId:
    //           'bafzbeibhqavlasjc7dvbiopygwncnrtvjd2xmryk5laib7zyjor6kf3avm',
    //         peerName: 'elastic-ipfs',
    //         region: null,
    //       },
    //     ],
    //     deals: [],
    //   },
    // ];
  });

  ipcMain.handle('deleteFileList', async (event, cids) => {
    const token = store.get('currToken') as string;
    console.log('cids', cids);
    return await deleteFilesFromWeb3(cids, token);
  });

  ipcMain.handle('copyToClipBoard', async (event, content) => {
    clipboard.writeText(content);
  });

  ipcMain.handle('renameFile', async (event, item: Upload) => {
    const token = store.get('currToken') as string;
    const res = await renameUpload(token, item);
    return res;
  });
};
export default ipcMainInit;
