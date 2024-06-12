export interface UiMessage {
  type: UiMessageType
  data: any
  messageId: string
}

export interface Preview {
  id: string
  name: string
  buffer: Uint8Array
  width: number
  height: number
}

export interface PreviewUi {
  id: string
  name: string
  base64: string
  width: number
  height: number
  buffer: Uint8Array
}

export interface ExportOption {
  preview: PreviewUi[]
  format: string
  platform: string | null
  prefix: string
  suffix: string
  scale: number
}

export interface Export {
  name: string
  format: string
}

export interface ExportDefault extends Export {
  buffer: Uint8Array
}

export enum PluginMessageType {
  PREVIEW = 'PREVIEW',
  UPLOAD = 'UPLOAD',
  // deprecated
  INIT = 'INIT',
}

export enum UiMessageType {
  ERROR = 'ERROR',
  UPLOAD = 'UPLOAD',
  MESSAGE = 'MESSAGE',
  STORAGE_GET = 'STORAGE_GET',
  STORAGE_SET = 'STORAGE_SET',
  USER_GET = 'USER_GET',

  MODE_GET = 'MODE_GET',

  SHOW_UI = 'SHOW_UI',
}
export enum Format {
  PNG = 'png',
  JPG = 'jpg',
  SVG = 'svg',
  WEBP = 'webp',
  AVIF = 'avif',
  ORIGINAL = 'original',
}

export enum PageType {
  LOADING,
  LOADED,
}

export interface User {
  userName: string
  userId: string
  email: string
}
