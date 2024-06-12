"use strict";
(() => {
  // src/background/utils.ts
  var fileKey = figma.fileKey != void 0 ? `${figma.fileKey}_` : "";
  var getData = (key) => {
    return figma.clientStorage.getAsync(fileKey + key);
  };
  var setData = (key, data) => {
    return figma.clientStorage.setAsync(fileKey + key, data);
  };
  var getPreview = async (node) => {
    const previewWidth = 250 * 2;
    const previewHeight = 116 * 2;
    let ratio = 2;
    if (node.width > previewWidth || node.height > previewHeight) {
      ratio = Math.min(previewWidth / node.width, previewHeight / node.height);
    }
    return {
      id: node.id,
      name: node.name.toLowerCase().replace(/ /gi, ""),
      width: node.width,
      height: node.height,
      buffer: await node.exportAsync({
        format: "PNG",
        constraint: {
          type: "SCALE",
          value: ratio
        }
      })
    };
  };
  var SVGSetting = {
    format: "SVG"
  };
  var getExportSetting = (format, scale = 1) => {
    return {
      format,
      constraint: {
        type: "SCALE",
        value: scale
      }
    };
  };
  var sleep = (ms) => {
    return new Promise((r) => setTimeout(r, ms));
  };
  var exportAsync = async (node, setting) => {
    await sleep(1);
    return node.exportAsync(setting);
  };

  // src/background/code.ts
  figma.showUI(__html__, { themeColors: true, height: 660, width: 320 });
  figma.on("run", () => {
  });
  figma.on("selectionchange", () => {
    if (figma.currentPage.selection.length < 0)
      return;
    Promise.all(figma.currentPage.selection.map((node) => getPreview(node))).then((preview) => {
      figma.ui.postMessage({
        type: "PREVIEW" /* PREVIEW */,
        data: preview
      });
    });
  });
  figma.ui.onmessage = async (msg) => {
    var _a, _b;
    const { type, data, messageId } = msg;
    switch (type) {
      case "SHOW_UI" /* SHOW_UI */: {
        const { data: data2 } = msg;
        await setData("_ioa_user", data2);
        figma.showUI(__html__, { themeColors: true, height: 660, width: 320 });
        break;
      }
      case "ERROR" /* ERROR */: {
        figma.notify(data, {
          error: true,
          timeout: 2e3
        });
        break;
      }
      case "MESSAGE" /* MESSAGE */: {
        figma.notify(data, {
          timeout: 1e3
        });
        break;
      }
      case "USER_GET" /* USER_GET */: {
        figma.ui.postMessage({
          type: "USER_GET" /* USER_GET */,
          data: {
            id: ((_a = figma.currentUser) == null ? void 0 : _a.id) || "",
            name: ((_b = figma.currentUser) == null ? void 0 : _b.name) || ""
          },
          messageId
        });
        break;
      }
      case "MODE_GET" /* MODE_GET */: {
        figma.ui.postMessage({
          type: "MODE_GET" /* MODE_GET */,
          data: figma.mode,
          messageId
        });
        break;
      }
      case "STORAGE_SET" /* STORAGE_SET */: {
        setData(data.key, data.value);
        break;
      }
      case "STORAGE_GET" /* STORAGE_GET */: {
        getData(data).then((value) => {
          figma.ui.postMessage({
            type: "STORAGE_GET" /* STORAGE_GET */,
            data: value,
            messageId
          });
        });
        break;
      }
      case "UPLOAD" /* UPLOAD */:
        {
          const { preview, scale, format } = data;
          let exportSetting = SVGSetting;
          switch (format) {
            case "png" /* PNG */:
              {
                exportSetting = getExportSetting("PNG", scale);
              }
              break;
            case "jpg" /* JPG */:
              {
                exportSetting = getExportSetting("JPG", scale);
              }
              break;
          }
          const tmps = [];
          preview.map((pre) => {
            const node = figma.currentPage.findOne((node2) => node2.id == pre.id);
            if (node != null) {
              const tmpNames = pre.name.split("/");
              tmpNames[tmpNames.length - 1] = tmpNames[tmpNames.length - 1];
              const tmpName = tmpNames.join("/");
              tmps.push({
                name: tmpName,
                node
              });
            }
          });
          const exports = [];
          for (const tmp of tmps) {
            const exportData = {
              name: tmp.name,
              format,
              buffer: await exportAsync(tmp.node, exportSetting)
            };
            exports.push(exportData);
          }
          figma.ui.postMessage({
            type: "UPLOAD" /* UPLOAD */,
            data: exports,
            messageId
          });
        }
        break;
    }
  };
})();
