# Phase 1 场景资产生成记录

生成方式：Codex 内置 ImageGen。生成日期：2026-09-01。四张图均为项目新生成资产，不含文字、标识、UI 或水印；最终项目使用 JPEG 质量 82 的响应式版本。未引用的工作区 PNG 中间件已清理，生成母版仍保留在 Codex 的 `generated_images` 目录，可恢复。

## 黄鹤楼

- 项目路径：`assets/art/phase1/yellow-crane-river.jpg`
- Prompt：`historical-scene`；面向儿童古诗学习场景的黄鹤楼与武汉长江远景，楼在林木山脊上，远帆没入江雾；博物馆级绢本水墨、浅矿物青绿、左侧留白、右侧地标与江面、低饱和、无现代天际线、无文字与水印。

## 西湖

- 项目路径：`assets/art/phase1/west-lake-lotus.jpg`
- Prompt：`historical-scene`；初夏杭州西湖，远山、长堤、右下荷叶、湖面经历晴雨转换；绢本水墨与透明矿物色，左侧留白，低饱和青绿、湖蓝灰与极少荷花色，无现代建筑、游客、文字与水印。

## 成都

- 项目路径：`assets/art/phase1/chengdu-spring-rain.jpg`
- Prompt：`historical-scene`；春雨后的成都夜晚，从安静草堂书房望向湿润庭院、暗色水面、一点舟灯与远方西岭雪峰；湿墨与纸纹，深靛、苔绿、暖灯，左侧留白，无现代城市、霓虹、文字与水印。

## 长安

- 项目路径：`assets/art/phase1/chang-an-autumn-moon.jpg`
- Prompt：`historical-scene`；唐代意象中的长安秋夜，层叠屋顶、城墙、远方关山、月光与院中捣衣布匹；克制矿物色和绢本水墨，左侧留白，右侧月亮与城市纵深，不伪装成考古复原，无战争、文字与水印。

## 使用边界

- 图像用于建立地点的情绪与视觉区分，不作为历史建筑位置、形制或诗人视点的事实证据。
- 地点、方向、距离、有效时间和争议说明仍来自结构化空间数据与 provenance 记录。
- 裁切策略优先保留右侧地标/自然物与左侧留白；移动端使用同一母版的响应式 `object-fit: cover`，不把关键主体裁出画面。
