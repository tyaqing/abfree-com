---
title: ExportX 压缩使用说明
description: Figma Dev模式收费后，我们支持了编辑模式，同样可以压缩导出图片！
pubDate: 2024-05-01
---
> Figma Dev模式收费后，我们支持了编辑模式，同样可以压缩导出图片！

## 开始使用

点击图层，选定格式和倍率，一键压缩导出，超快！

![](https://x.abfree.com/assets/ac438e6e-4a4f-46af-84bb-65d0f1ca5359)

## 导出格式支持

我们支持同时压缩多种格式和倍率的图片，但是规则限制在**5条**以内，图片格式支持PNG, JPG, WEBP, SVG, AVIF。

## 历史记录

插件压缩的图片我们会在您的电脑上永久的存储起来，直到您清空缓存或者清除历史纪录。受限于客户端存储限制，我们仅保存**15条**历史纪录。

> ExportX 2.1.0 带来了新的图片上传功能，用户可以上传图片到自定义的对象存储，或者使用我们提供的免费图床服务。

## 免费图床服务

ExportX为您提供了能够快速上传的免费图床，服务建立在Cloudflare的免费CDN上，我们保证不删除您的图片。方便您0配置即可获得上传体验。

![](https://x.abfree.com/assets/bf160bbf-4326-4cb5-90ec-799a044fbbd9)

打开插件右上角的开关，即可使用我们的免费图床服务。

![](https://x.abfree.com/assets/17c60acf-a5ec-40d8-979f-ab1d861c1ae8)

此时，点击"ExportX"按钮，一键完成压缩、上传操作。在历史记录中，点击复制按钮，即可获得图片链接。

使用我们的免费图床需要遵守我们的相关协议。

当然，我们更推荐您使用自定义上传服务。

## 自定义上传服务

如果您有自己的对象存储服务，您可以通过替换成自己的上传接口。
首先，点击左上角的[设置],在上传设置中，选择"自定义"方式。


![](https://x.abfree.com/assets/3c196681-afa3-42b1-8716-320428204875)

![](https://x.abfree.com/assets/3691eb76-6dd5-4f59-a05b-81d3117b849b)

### 上传接口规范

开启自定义上传后，图片会通过`POST`请求上传到您的接口。接口需要遵守以下规范：

#### Request内容
**Header:**
您可以通过自定义header来传递token等信息。
```
Content-Type: multipart/form-data;
```

**Body：**
您可以通过form-data的方式上传文件，key为"file"。同时，您可以通过自定义Body来传递额外的信息。
```
file:File    // 上传的文件
```
#### Response内容
返回的内容应该是一个json对象，包含图片的url，url用于复制到剪贴板。
```
{
  "url": "https://dev.cdn.abfree.com/images/6FjJoXmt34ox0Fu1.png"
}
```


下面是一些示例：

### Cloudflare R2+Worker

示例代码,此处使用[hono](https://hono.dev/)来演示

```ts
import {Hono} from 'hono'

type Bindings = {
  MY_BUCKET: R2Bucket
  CDN_URL: string
}

const app = new Hono<{
  Bindings: Bindings
}>()

app.post('/upload', async (c) => {
  const key = genFileKey()
  const formData = await c.req.parseBody()
  const file = formData['file']

  if (file instanceof File) {
    const fileBuffer = await file.arrayBuffer()
    const fullName = file.name
    const ext = fullName.split('.').pop()
    const path = `images/${key}.${ext}`

    let contentType = file.type
    
    if (contentType === 'image/svg') {
      contentType = 'image/svg+xml'
    }

    console.log(file.type)
    await c.env.MY_BUCKET.put(path, fileBuffer, {
      httpMetadata: {
        contentType: contentType,
        contentDisposition: `inline`
      },
    })
    return c.json({
      'url': `${c.env.CDN_URL}/${path}`
    })
  } else {
    return c.text('Invalid file', 400)
  }
})
```

### Amazon S3  或兼容S3

大多数对象存储都兼容S3协议，比如
- AWS S3
- Cloudflare R2
- Google Cloud Storage
- 阿里云OSS
- 腾讯云COS

示例代码
```ts
// api.ts
import {Hono} from 'hono'
import {uploadToS3} from "./s3";

type Bindings = {
  CDN_URL: string
}

const app = new Hono<{
  Bindings: Bindings
}>()

app.post('/uploadS3',async (c)=>{
  const key = genFileKey()
  const formData = await c.req.parseBody()
  const file = formData['file']
    if (file instanceof File) {
      const fileBuffer = await file.arrayBuffer()
      const fullName = file.name
      const ext = fullName.split('.').pop()
      const path = `images/${key}.${ext}`
      let contentType = file.type
      if (contentType === 'image/svg') {
        contentType = 'image/svg+xml'
      }
      const uint8Array = new Uint8Array(fileBuffer)
      await uploadToS3(c, {
        file:uint8Array,
        contentType,
        key:key
      })
      return c.json({
        'url': `${c.env.CDN_URL}/${path}`
      })
    } else {
      return c.text('Invalid file', 400)
    }
})

```

```ts
// s3.ts
import {S3} from "@aws-sdk/client-s3";
import {Context} from "hono";

let s3Client: S3
interface UploadParams {
  file: Uint8Array
  contentType: string
  key: string
}
export async function uploadToS3(c: Context, params:UploadParams) {
  const client = getClient(c)
  await client.putObject({
    Body: params.file,
    Bucket: c.env.S3_BUCKET,
    Key: params.key,
    ContentType: params.contentType,
  })
}
function getClient(c: Context) {
  if (s3Client) return s3Client
  const {S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_ENDPOINT, S3_REGION} = c.env
  s3Client = new S3({
    credentials: {
      accessKeyId: S3_ACCESS_KEY_ID,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
    },
    endpoint: S3_ENDPOINT,
    region: S3_REGION,
  })
  return s3Client
}

```

## QA

**上传是如何发起的？**

为了保护您图片的隐私性，上传行为是由前端发起，因此您可能需要处理跨域问题。

如何确保不被攻击

https://www.figma.com/plugin-docs/api/User/

