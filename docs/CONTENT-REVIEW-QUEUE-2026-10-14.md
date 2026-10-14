# 内容人工复核队列（2026-10-14）

本文件把尚未完成内容复核的 `machine-assisted-candidate` 诗整理为可执行的人工复核队列。队列顺序只用于安排工作，**不代表这些诗已经通过审核**，也不会改变运行时的 `learningContract.status`。

## 第一批：10 首

这批诗同时具备较清晰的空间线索、较高的教材常见度和适合 7–12 岁儿童的短学习路径，适合作为下一轮 Gold Standard 复核对象。

| 顺序 | poem id | 诗题 | 作者 | 地理线索 | 复核重点 |
| --- | --- | --- | --- | --- | --- |
| 1 | `yellow-crane-song-meng-hao-ran` | 黄鹤楼送孟浩然之广陵 | 李白 | 黄鹤楼、扬州、长江 | 送别路线、楼与江的空间关系、地名拼音 |
| 2 | `child-deng-guan-que-lou` | 登鹳雀楼 | 王之涣 | 黄河 | “更上一层楼”的空间与寓意、鹳雀读音 |
| 3 | `child-zao-fa-bai-di-cheng` | 早发白帝城 | 李白 | 白帝城、江陵 | 三峡行程、朝发/千里语义、地名读音 |
| 4 | `child-liang-zhou-ci` | 凉州词 | 王之涣 | 凉州、玉门关 | 边塞语境、羌笛/杨柳的文化解释 |
| 5 | `child-song-yuan-er-an-xi` | 送元二使安西 | 王维 | 渭城、阳关 | “浥”“朝雨”的读音和送别路线 |
| 6 | `child-jiu-yue-jiu-ri` | 九月九日忆山东兄弟 | 王维 | 长安、华山 | “山东”古今含义、重阳习俗来源 |
| 7 | `child-bo-chuan-gua-zhou` | 泊船瓜洲 | 王安石 | 金陵、长江 | “间”的语境读音、江南距离关系 |
| 8 | `child-ci-bei-gu-shan-xia` | 次北固山下 | 王湾 | 北固山、洛阳 | “次”的义项、潮平/风正的空间画面 |
| 9 | `child-le-you-yuan` | 乐游原 | 李商隐 | 长安 | “乐游原”地名与夕阳意象 |
| 10 | `west-lake-yin-hu-shang` | 饮湖上初晴后雨·其二 | 苏轼 | 西湖 | “潋滟”“空蒙”的释义和西湖地理关系 |

## 每首诗的通过条件

- 正文与权威底本逐字核对，并记录来源；
- 标题、作者、朝代、专名和多音字拼音人工核对；
- 每句至少有一条儿童可理解的释义和一条画面/空间提示；
- 地理关系区分“诗中地点”“作者行迹证据”和“现代参考位置”；
- 释义、寓意与史实分开标注，推测内容不得写成确定事实；
- 通过桌面、390×844 手机和键盘/触摸流程检查；
- 完成后才允许把该条从 `machine-assisted-candidate` 提升为人工审核状态。

## 第二批：5 首已完成

第二批 `child-yong-e`《咏鹅》、`child-min-nong-two`《悯农·其二》、`child-jing-ye-si`《静夜思》、`child-chun-xiao`《春晓》、`child-cun-ju`《村居》，第三批 `child-xiao-chi`《小池》、`child-chile-ge`《敕勒歌》、`child-wang-dong-ting`《望洞庭》、`child-wang-tian-men-shan`《望天门山》、`child-feng-qiao-ye-bo`《枫桥夜泊》，以及第四批 `child-min-nong-one`《悯农·其一》、`child-suo-jian`《所见》、`child-chi-shang`《池上》、`child-ye-su-shan-si`《夜宿山寺》、`child-zeng-wang-lun`《赠汪伦》已补齐逐句释义、儿童误解提示、主动表达延伸和语境拼音校正。没有可核定地点的诗保留 `unassigned`，不虚构地理关系。

## 当前状态

- 已完整人工审核：10 首；
- 另有 57 首已标记 `curated_content_v1`（第一批 8 首 + 第二批 5 首 + 第三批 5 首 + 第四批 5 首 + 第五/六批 15 首 + 第七/八批 10 首 + 第九/十批 10 首）；
- 其余 43 首仍保持 `machine-assisted-candidate`，不会因进入队列而自动升级。

候选排序来自运行时目录的机器辅助评分，只用于安排人工工作，不是内容质量证明。
