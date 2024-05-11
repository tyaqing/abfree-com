---
title: "Xcode集成ChatGPT、Github Copilot"
description: "Copilot与GPT能够很好的帮助我们在开发中遇到的困难，提高我们的效率。 这次我记录一下接入GPT与Copilot的过程。这个插件支持OpenAI、Azure的接口"
pubDate: "May 11 2024"
cover: "https://x.abfree.com/assets/27c10783-3ee8-40a7-92f1-5058d5219fa1"
category: "xcode"
---

> ✏️ Copilot与GPT能够很好的帮助我们在开发中遇到的困难，提高我们的效率。
这次我记录一下接入GPT与Copilot的过程。这个插件支持OpenAI、Azure的接口

![](https://x.abfree.com/assets/27c10783-3ee8-40a7-92f1-5058d5219fa1)

## 安装copilot-for-xcode

这里是使用copilot-for-xcode，里面也有详细的介绍和安装方法。

[https://github.com/intitni/CopilotForXcode](https://github.com/intitni/CopilotForXcode)

记得提前按转刚好homebrew

```bash
brew install --cask copilot-for-xcode
```

## 集成到Xcode

在**设置-》隐私与安全性-》扩展-》Xcode Source Editor**中选择Copilot

![](https://x.abfree.com/assets/8402239f-44ff-4d42-86ce-91b7d1405365)

## 配置OpenAI、Azure OpenAI、Github Copilot

### Github Copilot接入

Copilot的安装需要依赖Node，安装完node后，可以使用which获取路径填入

```bash
which node
```

然后点击install，安装后refresh一下。

![](https://x.abfree.com/assets/8134d6f9-4eb8-4b12-b3aa-86e1a5c2df52)

这样就可以在Xcode中看到右下角有个小圆点了

### GPT接入

这里没啥好说的，就填入你的API key就好了。


![](https://x.abfree.com/assets/187da9f7-d7cb-4cae-bf93-946752a3b8ae)

## 结语

插件同样支持快捷键，这个可以去文档中阅览啦！