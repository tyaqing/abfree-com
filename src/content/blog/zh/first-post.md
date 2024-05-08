---
title: "zhongwe Swift接入Apollo GraphQL并使用CLI生成代码"
description: "✏️ 笔者是GraphQL深度爱好者，在学习Swift开发过程中也希望能够将其引入，过程中也遇到一些包管理问题，参阅了官网文档后成功接入，下面是整个过程。"
pubDate: "Jul 08 2022"
cover: "/images/blog/placeholder-3.jpg"
category: "design"
---

> ✏️ 笔者是GraphQL深度爱好者，在学习Swift开发过程中也希望能够将其引入，过程中也遇到一些包管理问题，参阅了官网文档后成功接入，下面是整个过程。

设备信息：
Xcode版本：Version 14.3.1 (14E300c)
Mac OS ：13.4

# 开始

## 安装Apollo IOS Client

这里包管理使用了**[SPM(Swift Package Manager)](https://www.swift.org/package-manager/)**，之前使用[Cocoapods](https://cocoapods.org/)，没能正常跑起来，而且感觉这种方式对项目的侵入性比较强，开发体验不好。

在Xcode中，File→Add Packages，然后填入https://github.com/apollographql/apollo-ios

![](https://x.abfree.com/assets/59e125ef-1020-4ae0-ba9d-fa78e40607ef)

按需选择你需要的库，比如你想用到WebSocket就可以一起加入

![](https://x.abfree.com/assets/a634ae46-cdf6-44c1-b93b-657ec69d14aa)

## 安装CLI工具

我们需要用apollo-ios-cli来下载GraphQL的Schema，并且用他来来生成业务所需要的查询代码。

在项目根目录上右键，选择Install CLI。

![](https://x.abfree.com/assets/838ba8b2-0b6c-41e5-98b7-0a82dd77bbf5)

此时，项目中已经接入了Apollo Client，不过为了更方便业务使用，我们还需要讲我们自己的查询语句生成更易使用的Swift代码。

# 代码生成

## 下载GraphQL Schem

下载我们GraphQL Server的GraphQL，可以使用CLI去生成这份文件，这里推荐直接复制下面的文件，然后自己在Xcode里面创建apollo-codegen-config.json并粘贴。

需要注意几个点：

- operationSearchPaths 这里说的是你需要需要查询的GraphQL DSL
- schemaSearchPaths 你的GraphQL所有的DSL描述
- endpointURL GraphQL Server地址
- schemaTypes.path CLI生成Swift的代码目录
- outputPath 下载后的文件放在哪里，这里推荐放在项目目录下的./graphql

```json
{
  "schemaNamespace" : "RocketReserverAPI",
  "input" : {
    "operationSearchPaths" : [
      "**/*.graphql"
    ],
    "schemaSearchPaths" : [
      "**/*.graphqls"
    ]
  },
  "output" : {
    "testMocks" : {
      "none" : {
      }
    },
    "schemaTypes" : {
      "path" : "./RocketReserverAPI",
      "moduleType" : {
        "swiftPackageManager" : {
        }
      }
    },
    "operations" : {
      "inSchemaModule" : {
      }
    }
  },
	"schemaDownloadConfiguration": {
			"downloadMethod": {
					"introspection": {
							"endpointURL": "https://api.xxxx.com/graphql",
							"httpMethod": {
									"POST": {}
							},
							"includeDeprecatedInputValues": false,
							"outputFormat": "SDL"
					}
			},
			"downloadTimeout": 60,
			"headers": [],
			"outputPath": "./graphql/schema.graphqls"
	}
}
```

文件配置好之后，在终端进入项目根目录，执行下面代码

```bash
./apollo-ios-cli fetch-schema
```

执行后，你的项目目录会多出一个目录，里面包含你GraphQL Server提供的DSL

<aside>
💡 注意：
如果你在目录中没有找到这个目录，你需要自己手动添加，在Xcode菜单栏上，File→Add File….

- 需要注意你选中哪个目录，你添加的文件就会添加到哪里,展开看图。

![](https://x.abfree.com/assets/78a7a484-ea75-4663-9703-a6860a09062b)

</aside>

## 编写业务gql查询语句

这这里我随便写了一个查询语句，这里的目的主要是让CLI根据查询语句生成对应的Swift的查询对象，下面这段语句最后会生成**public** **class** GetPromptQuery: GraphQLQuery 等等，可以继续往下看

![](https://x.abfree.com/assets/7efd9c58-a4e0-4508-9073-b1435d94051f)

## 生成对应定义

编写完就运行下面代码

```json
./apollo-ios-cli generate
```

## 将生成的代码加入Swift 项目

同样在刚才 **File→Add Packages** 选择本地包

![](https://x.abfree.com/assets/f4efd7cb-8491-41a8-aea0-f5dd0075e08d)

选择刚才生成的

![](https://x.abfree.com/assets/37962695-0497-41fb-90c5-da63927a7eb0)

## 链接二进制包

我在初次调试的时候一直提示我`Cannot find 'GetPromptQuery' in scope` 是因为没有将Apollo生成的代码加入项目。

![](https://x.abfree.com/assets/5cb394dc-15d4-42d8-9355-ed39525a4e95)

此时，项目就已经接入了CLI生成业务代码，可以直接在Swift文件中使用。

下一篇文章我们讲如何将请求与我们的UI结合起来。

**参考**

[Introduction](https://www.apollographql.com/docs/ios/tutorial/tutorial-introduction)