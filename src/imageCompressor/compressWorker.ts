import { ImageCompressor } from '@/imageCompressor/ImageCompressor.ts';



self.addEventListener('message', async (event) => {
  console.log('compressWorker.js: message received', event.data, ImageCompressor);
  const { file, format } = event.data;
  try {
    const blob = await ImageCompressor.compress(file, format);
    self.postMessage({ success: true, blob });
  } catch (error) {
    self.postMessage({ success: false, error: error });
  }
});