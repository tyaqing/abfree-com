import Aegis from 'aegis-web-sdk'

export const aegis = new Aegis({
  id: '0GpdkTzwRO26k1ep4w', // 上报 id
  reportApiSpeed: true, // 接口测速
  reportAssetSpeed: true, // 静态资源测速
  spa: true, // spa 应用页面跳转的时候开启 pv 计算
  hostUrl: 'https://rumt-sg.com',
  env: import.meta.env.MODE,
})
