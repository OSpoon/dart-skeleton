const { GeneratePageStructure } = require("./dist/generate-page-structure");

const options = {
    url: "https://m.jd.com/",
    output: {
        injectSelector: "#app",
    },
};
new GeneratePageStructure(options).start();