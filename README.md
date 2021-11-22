## dart-skeleton

### 项目结构图：
项目由如图三块内容组成分别是：脚本，逻辑，CLI。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc2364ab5efd45cebcc84dc92fd5bdb3~tplv-k3u1fbpfcp-zoom-1.image)
#### 🥝脚本：
主要的功能就是对目标页面进行分析对指定的元素进行绘制为灰色块，并按条件跳过指定的干扰元素。因为我们的使用是在浏览器中所以在编译Ts的代码的时候我们将`target`和`module`分别设置成了`es5`和`es2015`，为了方便逻辑块的调用我们没有导出函数而是直接挂在到`window`对象上。调试本地html文件的话可以直接将编译后的`Js`引入页面，当我们需要调试在线的一些页面的话可以在浏览器的开发者工具=>`Sources`=>`Snippets`中新建一个片段将我们编译后的`Js`放进去，直接Run来执行。


#### 🥦逻辑：
主要的功能是使用`**Puppeteer**`来加载目标页面，并执行我们第一阶段调试的脚本，最终导出骨架片段并插入目标页面。逻辑块的代码由于我们后续想通过CLI的方式在`Node`环境执行，所以编译成了`CommonJS`模块。需要特殊记录一下的是脚本注入后的执行函数，如下：
```typescript
// 执行脚本获取生成的html片段
html = await page.evaluate((res) => {
	return window.evalDOMScripts.apply(window, res);
}, opts);
```
#### 🍦CLI：
这块的功能相对简单，主要是通过命令行的方式来收集用户的输入信息，构建初始化配置文件和执行逻辑部分导出的启动函数。

### 使用说明：
#### 🍕构建说明：

1. 全局安装Typescript，调试代码推荐一起安装ts-node：`yarn global add typescript ts-node`
2. 安装项目配置的依赖：`yarn`
#### 🍿脚本&源码编译：

1. 编译脚本文件：`yarn build:script`
1. 编译源码文件：`yarn build:source`
#### 🥗链接模块到本地NPM：

1. 建立连接命令：`npm link`
1. 反建立连接命令：`npm unlink`

注：目前无法发布到NPM仓库，提示原因是由于模块的版本或依赖的版本存在低于`1.2`的情况，不再允许添加到NPM的注册表，稳定的项目有效的托管的话挺不错，练手的就别提交上去浪费资源了🤣。
#### 🍝CLI使用说明：

1. 初始化配置文件：`ds init`
1. 执行生成函数：`ds start`
### 演示效果：
#### 手机版百度页面：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8afdf0b9fcce43ce95765daf9b6ba366~tplv-k3u1fbpfcp-zoom-1.image)![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6966f10366204deaad73d1473bce18dd~tplv-k3u1fbpfcp-zoom-1.image)
#### 手机版京东页面：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eedb6c86edd948a9b53ae27819f74544~tplv-k3u1fbpfcp-zoom-1.image)![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e78f49d6b8d47ee9c3dc2155d948de4~tplv-k3u1fbpfcp-zoom-1.image)


#### 手机版哔哩哔哩页面：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c5eae34cd0f42b29c2b1390dab93c99~tplv-k3u1fbpfcp-zoom-1.image)![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50f8c1b70fd34fec9d950d5b44b42ba6~tplv-k3u1fbpfcp-zoom-1.image)