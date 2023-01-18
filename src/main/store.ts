import ElectronStore from 'electron-store';
import { storeFileName } from '../appConfig';

const store = new ElectronStore({
  name: storeFileName,
});

export { store };
