---
title: "Xcode保存自动格式化"
description: "✏️ 不像JetBrain或者VS Code，Xcode本身没有保存自动格式化的能力，因此记录一下实现自动化的过程。"
pubDate: "May 11 2024"
cover: "https://x.abfree.com/assets/9076abb8-e3c8-4ec3-933a-dc60a0ab9937"
category: "xcode"
---


> ✏️ 不像JetBrain或者VS Code，Xcode本身没有保存自动格式化的能力，因此记录一下实现自动化的过程。

![](https://x.abfree.com/assets/9076abb8-e3c8-4ec3-933a-dc60a0ab9937)

## 安装swiftformat-for-xcode

如果没有brew，需要提前[homebrew](https://brew.sh/)

```bash
brew install --cask swiftformat-for-xcode
```

安装后在App目录会有对应图标

![](https://x.abfree.com/assets/3f9b517d-724e-4284-bbf2-3c93069a6dcb)

根据上面的提示，需要先在设置中开启


![](https://x.abfree.com/assets/3612517c-330b-4eab-a701-ea5647baa7d7)

![](https://x.abfree.com/assets/72e4f28f-4520-4eae-a4e5-47c4def5ed3d)

## 在设置中开启保存运行格式化

打开 **设置-》键盘-》键盘快捷键-》App快捷键**

选择Xcode，菜单标题输入 **Editor->SwiftFormat->Format File**

快捷键选择 **Command+S**

![](https://x.abfree.com/assets/8f698c26-6b9d-4f31-9f01-59d0dbc747ae)

完成后重启Xcode就能实现自动保存啦～

## 参考

[Format On Save — Xcode / Swift](https://medium.com/@jozott/format-on-save-xcode-swift-8133d049b3ac)