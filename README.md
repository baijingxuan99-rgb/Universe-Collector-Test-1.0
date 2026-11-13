# 宇宙收藏家 · 迭代原型与工作台

- [版本索引与试玩笔记](public/workbench.html)
- [现有互动工作台](https://cosmic-collector-workbench.popular-tremors-2r46.chatgpt.site/)
- [今晚来过的人](public/index.html) · [把琴声挪一拍](public/sound-shop.html)
- [PC 与 Windows 原型](public/releases) · [玩法文档和数据](public/project)

解压或克隆后，打开 `public/workbench.html` 可搜索和试玩。Netlify 的发布目录是 `public`。

# 宇宙收藏家 · 玩法大迭代 V1

打开 public/index.html 可开始两晚 A/B 试玩。每组从 12 币、6 格货架和空库存开始。试玩记录可在页内导出为 JSON。

## GitHub 与 Netlify

将解压后的文件提交到独立的 GitHub 仓库。在 Netlify 导入该仓库并选定部署分支。保留根目录 netlify.toml，发布目录是 public，构建命令留空。将仓库绑定到 Netlify 后，可按该项目的部署设置从 Git 提交更新。

如仅需手动预览，可把解压后的 public 文件夹上传到 Netlify。手动部署与 GitHub 自动同步是两个独立入口。
