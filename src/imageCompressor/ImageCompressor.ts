// @ts-ignore
import { SVGO } from 'libsvgo/module/lib/svgo';

import avif_enc from '@/imageCompressor/avif-squoosh/avif_enc.js';
import { default as initPng, Imagequant, ImagequantImage } from '@/imageCompressor/imagequant-wasm';
import mozjpeg_enc from '@/imageCompressor/mozjpeg/mozjpeg_enc.js';
import webp_enc from '@/imageCompressor/webp/webp_enc.js';
import { Format } from '@/types/interface';

export class ImageCompressor {
  file: File;
  // png用量最多，提前加载缓存起来
  static isPngWasmLoaded: any;
  static mozjpegInstance: any;
  static webpInstance: any;
  static avifInstance: any;

  constructor(file: File) {
    this.file = file;
  }

  static async loadPngWasm() {
    ImageCompressor.isPngWasmLoaded = await initPng();
  }

  static async loadJpgWasm() {
    ImageCompressor.mozjpegInstance = await mozjpeg_enc();
  }

  static async loadWebpWasm() {
    ImageCompressor.webpInstance = await webp_enc();
  }

  static async loadAvifWasm() {
    ImageCompressor.avifInstance = await avif_enc();
  }

  /**
   * 判断对应模块是否加载
   * @param format
   */
  static async isLoadWasm(format: Format) {
    switch (format) {
      case Format.PNG:
        return !!ImageCompressor.isPngWasmLoaded;
      case Format.WEBP:
        return !!ImageCompressor.webpInstance;
      case Format.AVIF:
        return !!ImageCompressor.avifInstance;
      case Format.JPG:
        return !!ImageCompressor.mozjpegInstance;
      case Format.SVG:
      default:
        return true;
    }
  }

  /**
   * 加载对应模块
   * @param format
   */
  static async loadWasm(format: Format) {
    switch (format) {
      case Format.PNG:
        return await ImageCompressor.loadPngWasm();
      case Format.WEBP:
        return await ImageCompressor.loadWebpWasm();
      case Format.AVIF:
        return await ImageCompressor.loadAvifWasm();
      case Format.JPG:
        return await ImageCompressor.loadJpgWasm();
      case Format.SVG:
      default:
    }
  }

  /**
   * 压缩 PNG
   */
  async compressPng() {
    // 获取图片元信息
    const { width, height, imageData } = await this.getImageBitInfo();
    // 将 Uint8Array 数据从发给 Imagequant/WASM
    const uint8Array = new Uint8Array(imageData.data.buffer);

    if (!ImageCompressor.isPngWasmLoaded) {
      await ImageCompressor.loadPngWasm();
    }
    const image = new ImagequantImage(uint8Array, width, height, 0);
    const instance = new Imagequant();
    // 配置压缩质量
    instance.set_quality(35, 88);
    // instance.set_max_colors(256)
    instance.set_speed(4);
    // 启动压缩
    const output = instance.process(image);

    const outputBlob = new Blob([output.buffer], { type: 'image/png' });
    return outputBlob;
  }

  /**
   * 压缩 JPEG
   */
  async compressJpeg(): Promise<Blob> {
    const { width, height, imageData } = await this.getImageBitInfo();
    if (!ImageCompressor.mozjpegInstance) await ImageCompressor.loadJpgWasm();
    const jpegData = ImageCompressor.mozjpegInstance.encode(imageData.data, width, height, {
      quality: 80,
      baseline: false,
      arithmetic: false,
      progressive: true,
      optimize_coding: true,
      smoothing: 0,
      color_space: MozJpegColorSpace.YCbCr,
      quant_table: 3,
      trellis_multipass: false,
      trellis_opt_zero: false,
      trellis_opt_table: false,
      trellis_loops: 1,
      auto_subsample: true,
      chroma_subsample: 2,
      separate_chroma_quality: false,
      chroma_quality: 75
    });
    const outputBlob = new Blob([jpegData], { type: 'image/jpg' });
    return outputBlob;
  }

  /**
   * 压缩 Webp
   */
  async compressWebp(): Promise<Blob> {
    const { width, height, imageData } = await this.getImageBitInfo();
    if (!ImageCompressor.webpInstance) await ImageCompressor.loadWebpWasm();
    const jpegData = await ImageCompressor.webpInstance.encode(imageData.data, width, height, {
      quality: 80,
      target_size: 0,
      target_PSNR: 0,
      method: 4,
      sns_strength: 50,
      filter_strength: 60,
      filter_sharpness: 0,
      filter_type: 1,
      partitions: 0,
      segments: 4,
      pass: 1,
      show_compressed: 0,
      preprocessing: 0,
      autofilter: 0,
      partition_limit: 0,
      alpha_compression: 1,
      alpha_filtering: 1,
      alpha_quality: 100,
      lossless: 0,
      exact: 0,
      image_hint: 0,
      emulate_jpeg_size: 0,
      thread_level: 0,
      low_memory: 0,
      near_lossless: 100,
      use_delta_palette: 0,
      use_sharp_yuv: 0
    });
    const outputBlob = new Blob([jpegData], { type: 'image/webp' });
    return outputBlob;
  }

  /**
   * 压缩 Avif
   */
  async compressAvifSquoosh(): Promise<Blob> {
    const { width, height, imageData } = await this.getImageBitInfo();
    if (!ImageCompressor.avifInstance) await ImageCompressor.loadAvifWasm();
    const jpegData = ImageCompressor.avifInstance.encode(imageData.data, width, height, {
      quality: 78,
      qualityAlpha: -1,
      denoiseLevel: 0,
      tileColsLog2: 0,
      tileRowsLog2: 0,
      speed: 6,
      subsample: 1,
      chromaDeltaQ: false,
      sharpness: 0,
      tune: AVIFTune.auto,
      enableSharpDownsampling: false
    });
    const outputBlob = new Blob([jpegData], { type: 'image/avif' });
    return outputBlob;
  }

  /**
   * 压缩 SVG
   */
  async compressSvg() {
    const text = await this.file.text();
    const svgo = new SVGO();
    const svgData = await svgo.optimize(text, {
      path: 'path-to.svg', // recommended
      multipass: true // all other config fields are available here
    });
    return new Blob([svgData.data], { type: 'image/svg+xml' });
  }

  /**
   * 获取图片信息
   */
  async getImageBitInfo() {
    const bitmap = await createImageBitmap(this.file);
    const { width, height } = bitmap;
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext('2d')!;
    context?.drawImage(bitmap, 0, 0, width, height);
    const imageData = context?.getImageData(0, 0, width, height);
    return {
      width,
      height,
      imageData
    };
  }

  /**
   * 获取图片格式
   */
  getImageType() {
    switch (this.file.type) {
      case 'image/jpeg':
      case 'image/jpg':
        return Format.JPG;
      case 'image/png':
        return Format.PNG;
      case 'image/svg':
      case 'image/svg+xml':
        return Format.SVG;
      default: {
        throw new Error('unknown format ' + this.file.type);
      }
    }
  }

  /**
   * 转为 base64
   */
  toBase64(): Promise<string>{
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(this.file);
    });
  }

  /**
   * 压缩到指定格式
   * @param format
   */
  async compressTo(format: Format) {
    switch (format) {
      case Format.JPG:
        return await this.compressJpeg();
      case Format.PNG:
        return await this.compressPng();
      case Format.WEBP:
        return await this.compressWebp();
      case Format.AVIF:
        return await this.compressAvifSquoosh();
      case Format.SVG:
        return await this.compressSvg();
      default:
        throw new Error('unknown format ' + format);
    }
  }

  /**
   * 压缩图片静态方法
   * @param file
   * @param format
   */
  static async compress(file: File, format: Format): Promise<Blob> {
    const compressor = new ImageCompressor(file);
    let blob = await compressor.compressTo(format);
    return blob;
  }
}

export const enum AVIFTune {
  auto,
  psnr,
  ssim,
}

export const enum MozJpegColorSpace {
  GRAYSCALE = 1,
  RGB,
  YCbCr,
}
