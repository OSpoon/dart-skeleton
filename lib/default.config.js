module.exports = {
  filename: "dart.skeleton.config.js",
  getTemplate: function (conf = {}) {
    return `
module.exports = {
	url: "${conf.url}",
	output: {
		filepath: "${conf.filepath.toString()}",
		injectSelector: "#app",
	},
	// background: "#ccc",
	// animation: "opacity 1.5s linear infinite",
	// header: {
	//   height: 50,
	//   background: "#3388ff",
	// },
	// isDebug: false,
	// emulateOpts: {
	//   userAgent:
	//     "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
	//   viewport: {
	//     width: 375,
	//     height: 667,
	//   },
	// },
	// init: function () {
	//   // 生成骨架屏之前的操作，比如删除干扰节点
	//   document
	//     .querySelectorAll("#commonNav")
	//     .forEach((item) => item.parentNode.removeChild(item));
	//   document
	//     .querySelectorAll(".m-carousel-item imk2-slide")
	//     .forEach((item) => item.parentNode.removeChild(item));
	// },
	// includeElement: function (node, draw) {
	//   // 跳过该节点及其子节点
	//   if (node.id === "searchWrapper") {
	//     draw({
	//       width: 100,
	//       height: 8,
	//       left: 0,
	//       top: 0,
	//       zIndex: 99999999,
	//       background: "red",
	//     });
	//     return false;
	//   }
	// },
};
`;
  },
};
