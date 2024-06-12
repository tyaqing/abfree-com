export function isWeb() {
  return process.env.VITE_BUILD_TARGET === 'web'
}

export function getCurrentEnv() {
  return process.env.NODE_ENV
}

export function isRuntimeDev() {
  return getCurrentEnv() === 'development'
}
export function isRuntimeProd() {
  return getCurrentEnv() === 'production'
}

export function getEdition() {
  return process.env.VITE_EDITION
}

export function isCommunity() {
  return getEdition() === 'community'
}

/**
 * 判断是否是woa渠道
 */
export function isChannelWoa() {
  return import.meta.env.VITE_PROJECT_NAME === 'figma-upload-pro'
}
