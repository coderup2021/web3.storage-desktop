import { Web3Storage, Filelike, Upload, PutOptions } from 'web3.storage';
import * as fs from 'fs';
import axios, { AxiosRequestConfig } from 'axios';
import { UploadStatus } from './type';
import { store } from './store';

const baseURL = 'https://api.web3.storage';
export interface UploadingItem {
  uuid: string;
  name: string;
  size: number;
  status: UploadStatus;
  progress: number;
  failReason?: any;
}
interface FileInfo {
  name: string;
  size: number;
  uuid: string;
}

interface DeleteFileFailRes {
  cid: string;
  reason: any;
}
interface DeleteFileRes {
  success: boolean;
  fails: DeleteFileFailRes[];
}

export const deleteFilesFromWeb3: (
  cids: string[],
  token: string
) => Promise<DeleteFileRes> = (cids: string[], token: string) => {
  return new Promise((resolve, reject) => {
    const client = new Web3Storage({ token });
    const requests = [];
    cids.forEach((cid) => {
      requests.push(client.delete(cid));
    });
    Promise.allSettled(cids).then((res) => {
      res.forEach((r, index) => {
        const fails: DeleteFileFailRes[] = [];
        if (r.status !== 'fulfilled') {
          fails.push({
            cid: cids[index],
            reason: r.reason,
          });
        }
        const ret: DeleteFileRes = {
          success: true,
          fails: [],
        };
        if (fails.length > 0) {
          ret.success = false;
          ret.fails = fails;
        }
        resolve(ret);
      });
    });
  });
};

export const uploadToWeb3 = (
  filePath: string,
  apiToken: string,
  fileInfo: FileInfo
) => {
  return new Promise(async (resolve, reject) => {
    //   Construct with token and endpoint
    const { uuid, name, size } = fileInfo;
    const key = `uploadingList.${uuid}`;
    const client = new Web3Storage({ token: apiToken });
    const file: Filelike = {
      name,
      stream: () => fs.createReadStream(filePath) as unknown as ReadableStream,
    };
    //   Pack files into a CAR and send to web3.storage
    store.set(key, {
      uuid,
      name,
      size,
      status: UploadStatus.UPLOADING,
      progress: 0,
    });
    try {
      const rootCid = await client.put([file], {
        onStoredChunk: (bytes) => {
          const percentAdd = Number((bytes / size).toFixed(2));
          const uploadingList = store.get('uploadingList') as {};
          const originPercent = ((uploadingList as any)[uuid] as UploadingItem)
            .progress;
          const newPercent = originPercent + percentAdd;
          store.set(key, {
            uuid,
            name,
            size,
            status:
              newPercent >= 1 ? UploadStatus.COMPLETE : UploadStatus.UPLOADING,
            progress: newPercent >= 1 ? 1 : newPercent,
          });
        },
      } as PutOptions); // Promise<CIDString>
      setTimeout(() => {
        store.delete(key);
      }, 5000);
      resolve({});
    } catch (error) {
      let message = '';
      if (error instanceof Error) message = error.message;
      else message = String(error);
      store.set(`${key}.failReason`, message);
      store.set(`${key}.status`, UploadStatus.FAIL);
      reject({ error });
    }
  });
  //   Get info on the Filecoin deals that the CID is stored in
  //   const info = await client.status(rootCid); // Promise<Status | undefined>
  //   Fetch and verify files from web3.storage
  //   const res = await client.get(rootCid); // Promise<Web3Response | null>
  //   const [{ cid }] = await res!.files(); // Promise<Web3File[]>
};

// export const uploadToWeb3 = async (filePath: string, apiToken: string) => {
//   //   Construct with token and endpoint
//   async function getCar() {
//     const bytes = new TextEncoder().encode('random meaningless bytes');
//     console.log('bytes', bytes);
//     const hash = await sha256.digest(raw.encode(bytes));
//     console.log('hash', hash);
//     const cid = CID.create(1, raw.code, hash);
//     console.log('cid', cid);
//     // create the writer and set the header with a single root
//     const { writer, out } = await CarWriter.create([cid]);
//     Readable.from(out).pipe(fs.createWriteStream(filePath));
//     // store a new block, creates a new file entry in the CAR archive
//     await writer.put({ cid, bytes });
//     await writer.close();
//     const inStream = fs.createReadStream(filePath);
//     // read and parse the entire stream in one go, this will cache the contents of
//     // the car in memory so is not suitable for large files.
//     const reader = await CarReader.fromIterable(inStream);
//     return reader;
//   }
//   const client = new Web3Storage({ token: apiToken });
//   const car = (await getCar()) as unknown as CarReader;
//   const cid = await client.putCar(car, {
//     onStoredChunk: (value) => {
//       console.log('value', value);
//     },
//   });
//   console.log('cid2222', cid);
// };
export const getWeb3List = async (apiToken: string) => {
  const list: Upload[] = [];
  try {
    for await (const item of Web3Storage.list({
      token: apiToken,
      endpoint: new URL(baseURL),
    })) {
      list.push(item);
    }
    return list;
  } catch (error) {
    throw error;
  }
};

const tmpToken =
  'WyIweGYwMWMxZjZkMzM1MjZjOTU4NjYwZTgxNDhhNGQ5NjAwYzhkMTQ3ZDU5ZDhmMTJkYWFmMmYwYmI4ODM3Njk1MTMwNzlkZjc3YjcyNDc0NTNiNDc2YjA3MjY2NTBhNjBjOGU0OGI2MGUxZTRmYWVjZmNiY2Y0NjNhYTE1MDVjOWIxMWMiLCJ7XCJpYXRcIjoxNjczOTU1NzkxLFwiZXh0XCI6MTY3Mzk1NjY5MSxcImlzc1wiOlwiZGlkOmV0aHI6MHhBNDcwNmM5QzE2MDAyOTBmYTQ0NzYyZGYyQjNBNzEwY2VkMWE2MUQ1XCIsXCJzdWJcIjpcIi1pWUo2ejZWSkhKeTJKOVJLTWstNlQ3eHBmU2NGSUtCaHRPamdJN2JxdGs9XCIsXCJhdWRcIjpcIm1UUl9NQ3JTTjU3NFVsRmIzUFdyYzYyYllHNFgyczAxemZGcHRJSkkwa2M9XCIsXCJuYmZcIjoxNjczOTU1NzkxLFwidGlkXCI6XCI5YzE2YWFkOC1hNTI4LTRkOGYtYmI1YS04YzM5Mjk5MzYzM2ZcIixcImFkZFwiOlwiMHhiNWY5NjAyOWNkZWFiNmEwZDZhOGE0MDQ1ZTY3ZGE0MDdlNzIzNzU3NWY2ZjlmZTMyZGYyNGNlYjQ0NmZlZWU3NTRkZTdhNDkyMDc2MmYwMmM3ZGM3NjFhYjU5YzlmYmQ1ZTk4OWYyZTg5MzRiMTg2YjZhMTk2YjZkOTBlYjE2MDFjXCJ9Il0=';
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNvZGVydXBAMTYzLmNvbSIsInRlbXBvcmFyeV9hdXRoX3Rva2VuIjoieDBya29Hd2tpa3l2R0dSQzcyNjJvVWt1d0hOQkJ0dTF6VmRROHZfSHpfOVlsVnlzMHRHb1FmcUJQVHlSek9DeExTSGIwNnVpV0gzSHhSTkh0d1cwRWciLCJjbGllbnRfaWQiOiJtVFJfTUNyU041NzRVbEZiM1BXcmM2MmJZRzRYMnMwMXpmRnB0SUpJMGtjPSIsInVzZXJfdHlwZSI6MiwiZXhwIjoxNjczOTkyNTcwfQ.aeWDBqv0B8TkvCjkvv8oAliyVxtyVUS4iry-X4n7OnE&e=mainnet&ct=eyJhcHBfbmFtZSI6ICJ3ZWIzLnN0b3JhZ2UiLCAiYXNzZXRfdXJpIjogImh0dHBzOi8vYXNzZXRzLmZvcnRtYXRpYy5jb20vTWFnaWNMb2dvcy8yMDI2NzUxNjFkNDI2NzA5MzM3OGIwYzNiYzY5N2Y0Yi84YWIxZTM1ODIwZWJlNGRkOTI1NmRiZTkxNDg3MjUyMS5wbmciLCAiYnV0dG9uX2NvbG9yIjogIiM3RTgxRkYiLCAidGhlbWVfY29sb3IiOiAiZGFyayIsICJjdXN0b21fYnJhbmRpbmdfdHlwZSI6IDF9&uid=QXGBpql2cl28XgsEU3Xk_bMJI99UwFhc2cwiW4Jg8eo=&locale=en_US&ak=pk_live_BB95C8769C9B1295&redirect_url=https://web3.storage/callback/%3Fredirect_uri%3D%252Faccount&location=Q2hpbmEsIFNpY2h1YW4sIENoZW5nZHU=&flow_context=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmIjoia1FJcTBENFhGYldxdDBGNGFnc0lEV3ZtVlVJLUxjeEx5N191U1kyZ3JXcz0iLCJ0IjoiYkp5S2tsMF9MZnQxVTh2N093QmVOUzlJQ19nWUFVeDlmVW1tdm5Gc2doRjZDSC15NFdEN3o5QkYzam1QM19hZ2JpZEMwOVlyel9XdXZaMUZIS1RXZVEiLCJleHAiOjE2NzM5OTI4NzB9.eo_N8s2dexxfiyrmFmz_0_uk7BFcHdsbUer3XUPyECY&next_factor=');
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweERhZGZFQmQ5MTk1MGVCRjJGRTM1ODhhNDVhNWMxZTMyM2E0Q0ZGM0MiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzM5NDQ4MDYxNjUsIm5hbWUiOiJhYmNkIn0.HKz9qjYm8Ex4nT4-akdXf7feDhZuAH7U4IpJDmvD9io');
//Web3Storage.headers(apiToken) cannot use here
export const renameUpload = async (apiToken: string, item: Upload) => {
  const url = `${baseURL}/user/uploads/${item.cid}/rename`;
  const body = { name: item.name };
  const reequestConfig: AxiosRequestConfig = {
    ...Web3Storage.headers(tmpToken),
  };
  try {
    const res = await axios.post(url, body, reequestConfig);
  } catch (error) {
    console.error('error', error);
  }
};
