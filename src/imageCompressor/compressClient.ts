import Worker from './compressWorker.ts?worker';
import { Format } from '@/types/interface.ts';

export const compressImage = async (file:File, format:Format) => {
  const worker = new Worker();
  return new Promise((resolve, reject) => {

    console.log('send message', file, format);
    worker.postMessage({ file, format });
    worker.onmessage = (event) => {
      const { success, blob, error } = event.data;
      if (success) {
        console.log('blob', blob);
        resolve(blob);
      } else {
        console.log('error', error);
        reject(new Error(error));
      }
      worker.terminate();
    };
  });
};
