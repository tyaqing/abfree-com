import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { useGlobalStore } from '@/stores/useGlobalStore'
import { LANG } from '@/utils/const'
const state = useGlobalStore.getState()
// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  [LANG.ZH_CN]: {
    translation: {
      帮助文档: '帮助文档',
      请点击一个图层: '请点击一个图层',
      导出设置: '导出设置',
      压缩: '压缩',
      历史记录: '历史记录',
      清空: '清空',
      无记录: '无记录',
      仅保存n条本地记录: `仅保存{{num}}条本地记录`,
      protocolTitle: '使用免费图床需要遵守以下协议',
      protocolRule1: '1.我们的免费服务建立在Cloudflare提供的免费CDN服务上.',
      protocolRule2:
        '2.我们不会删除您上传的图片,但我们有权利删除违反法律法规的图片.如色情,暴力等图片.',
      protocolRule3: '3.推荐您使用自己的CDN服务,我们提供了自定义上传图片的功能.',
      上传配置: '上传配置',
      开启上传: '开启上传',
      上传: '上传',
      设置: '设置',
      自定义图床: '自定义图床',
      免费图床: '免费图床',
      上传服务: '上传服务',
      使用条款: '使用条款',
      具体使用方法请参考: '具体使用方法请参考',
      JSON格式: 'JSON格式',
      'JSON格式,请注意跨域问题': 'JSON格式,请注意跨域问题',
      '自定义 Headers': '自定义 Headers',
      '自定义 Body': '自定义 Body',
      '如何使用?': '如何使用?',
      您上传服务的地址: '您上传服务的地址',
      上传地址: '上传地址',
      保存: '保存',
      // 下面部分是woa特有的
      测试图床: '测试图床',
      '7D': '7天',
      用户信息: '用户信息',

      Index: {
        h1: '全能的图片导出插件,支持',
        h1_append: '压缩,上传',
        h2: '基于WebAssembly的本地压缩导出工具 支持PNG,JPG,WEBP,SVG,AVIF',
        h3: '本地压缩｜快捷高效｜保护隐私',
        'Figma 插件': 'Figma 插件',
        使用文档: '使用文档',
        特性: '特性',
        featureBefore: '这是一个免费的Figma插件，旨在帮助您快速压缩,上传图像，以便在Web上使用.',
        featureAfter: '\uD83D\uDEA7 图片上传、压缩优化正在开发中，敬请期待！',
        feature1: '本地WebAssembly压缩',
        feature1Desc: '超快的压缩速度,压缩无需等待',
        feature2: '支持多种格式',
        feature2Desc: '支持PNG,JPG,WEBP,SVG,AVIF',
        feature3: '与Figma的无缝集成',
        feature3Desc: '一键压缩导出,无需离开Figma',
        聆听您的声音: '聆听您的声音',
        feedback: '我们非常重视您的反馈，如果您有任何问题或建议，请通过右下角的聊天框与我们联系.',
        最新版本: '最新版本',
        '压缩速度提升 X500%': '支持上传到CDN,一键获取图片链接',
      },
      MainNav: {
        特性: '特性',
        博客: '博客',
        更新记录: '更新记录',
        使用文档: '使用文档',
      },
      Blog: {
        博客: '博客',
        查看所有文章: '查看所有文章',
        发布于: '发布于',
        所有文章: '所有文章',
      },
    },
  },
  [LANG.EN_US]: {
    translation: {
      帮助文档: 'Document',
      请点击一个图层: 'Please click a layer',
      导出设置: 'Export Settings',
      压缩: 'Compress',
      历史记录: 'History',
      清空: 'Clear',
      无记录: 'No Record',
      仅保存n条本地记录: `Only save {{num}} local records`,
      protocolTitle:
        'To use the free image hosting service, you must adhere to the following protocol',
      protocolRule1: '1. Our free service is built on the free CDN service provided by Cloudflare.',
      protocolRule2:
        '2. We will not delete the images you upload, but we reserve the right to remove images that violate laws and regulations, such as pornographic or violent images.',
      protocolRule3:
        '3. We recommend using your own CDN service. We provide a feature to customize uploading images.',
      上传配置: 'Upload Configuration',
      开启上传: 'Enable Upload',
      上传: 'Upload',
      设置: 'Settings',
      自定义图床: 'Custom',
      免费图床: 'Free Hosting',
      上传服务: 'Upload Service',
      使用条款: 'Terms of Use',
      具体使用方法请参考: 'For specific usage instructions, please refer to',
      JSON格式: 'JSON Format',
      'JSON格式,请注意跨域问题': 'JSON Format, please note the cross-origin issue',
      '自定义 Headers': 'Custom Headers',
      '自定义 Body': 'Custom Body',
      '如何使用?': 'How to use?',
      您上传服务的地址: 'Upload address',
      上传地址: 'Upload Address',
      保存: 'Save',
      用户信息: 'User Info',
      Index: {
        h1: 'All-in-one Tools for Image ',
        h1_append: 'Compression & Upload',
        h2: 'A local compression export tool based on WebAssembly supporting PNG, JPG, WEBP, SVG, AVIF',
        h3: 'Local compression | Quick and efficient | Privacy protection',
        'Figma 插件': 'Figma Plugin',
        使用文档: 'User Guide',
        特性: 'Features',
        featureBefore:
          'This is a free Figma plugin designed to help you quickly compress and upload images for use on the web.',
        featureAfter:
          '🚧 Image upload and compression optimization are under development. Stay tuned!',
        feature1: 'Local WebAssembly compression',
        feature1Desc: 'Super fast compression speed, no waiting for compression',
        feature2: 'Supports multiple formats',
        feature2Desc: 'Supports PNG, JPG, WEBP, SVG, AVIF, etc.',
        feature3: 'Seamless integration with Figma',
        feature3Desc: 'One-click compression export, no need to leave Figma',
        聆听您的声音: 'We want to hear from you',
        feedback:
          'We take your feedback seriously. If you have any questions or suggestions, please contact us through the chat box in the lower right-hand corner',
        最新版本: 'Latest version',
        '压缩速度提升 X500%': 'Support uploading to CDN, one-click get image link',
      },
      MainNav: {
        特性: 'Features',
        博客: 'Blog',
        更新记录: 'Changelog',
        使用文档: 'User Guide',
      },
      Blog: {
        博客: 'Blog',
        查看所有文章: 'View all articles',
        发布于: 'Published on',
        所有文章: 'All posts',
      },
    },
  },
  [LANG.JA_JP]: {
    translation: {
      帮助文档: 'ヘルプドキュメント',
      请点击一个图层: 'レイヤーをクリックしてください',
      导出设置: 'エクスポート設定',
      压缩: '圧縮',
      历史记录: '履歴',
      清空: 'クリア',
      无记录: '記録なし',
      仅保存n条本地记录: `ローカルレコードのみ保存{{num}}`,
      protocolTitle:
        '無料の画像ホスティングサービスを利用するには、以下のプロトコルに従う必要があります',
      protocolRule1:
        '1. 当社の無料サービスは、Cloudflareが提供する無料のCDNサービスを利用して構築されています。',
      protocolRule2:
        '2. アップロードした画像を削除することはありませんが、わいせつや暴力などの法律や規制に違反する画像を削除する権利を留保します。',
      protocolRule3:
        '3. 独自のCDNサービスを使用することをお勧めします。画像のアップロードをカスタマイズする機能を提供しています。',
      上传配置: 'アップロード設定',
      开启上传: 'アップロードを有効にする',
      上传: 'アップロード',
      设置: '設定',
      自定义图床: 'カスタム画像ホスティング',
      免费图床: '無料ホスティング',
      上传服务: 'アップロードサービス',
      使用条款: '利用規約',
      具体使用方法请参考: '具体的な使用方法については、参照してください',
      JSON格式: 'JSON形式',
      'JSON格式,请注意跨域问题': 'JSON形式、クロスオリジンの問題に注意してください',
      '自定义 Headers': 'カスタムヘッダー',
      '自定义 Body': 'カスタムボディ',
      '如何使用?': '使用方法は？',
      您上传服务的地址: 'アップロードサービスのアドレス',
      上传地址: 'アップロードアドレス',
      保存: '保存',
      用户信息: 'ユーザー',
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: state.lang,
  interpolation: {
    escapeValue: false,
  },
  debug: process.env.NODE_ENV === 'development',
  fallbackLng: LANG.EN_US,
})

export default i18n
