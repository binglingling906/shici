/**
 * Content-owner edits are kept outside the raw source snapshot.  The build
 * script merges these by stable ID and never writes back to either this file
 * or `raw-candidates.json`.
 */

export const curatedOverrides = {
  "lushan-wang-lushan-pubu": {
    title: "望庐山瀑布",
    text: "日照香炉生紫烟，\n遥看瀑布挂前川。\n飞流直下三千尺，\n疑是银河落九天。",
    author: "李白",
    dynasty: "唐",
    overrideReason: "与已审核完整学习单元逐字对齐。",
    reviewStatus: "approved_full_experience",
  },
  "lushan-ti-xi-lin-bi": {
    title: "题西林壁",
    text: "横看成岭侧成峰，\n远近高低各不同。\n不识庐山真面目，\n只缘身在此山中。",
    author: "苏轼",
    dynasty: "宋",
    overrideReason: "与已审核完整学习单元逐字对齐。",
    reviewStatus: "approved_full_experience",
  },
  "yellow-crane-huang-he-lou": {
    title: "黄鹤楼",
    text: "昔人已乘黄鹤去，\n此地空余黄鹤楼。\n黄鹤一去不复返，\n白云千载空悠悠。\n晴川历历汉阳树，\n芳草萋萋鹦鹉洲。\n日暮乡关何处是？\n烟波江上使人愁。",
    author: "崔颢",
    dynasty: "唐",
    overrideReason: "与已审核完整学习单元逐字对齐。",
    reviewStatus: "approved_full_experience",
  },
  "yellow-crane-song-meng-hao-ran": {
    title: "黄鹤楼送孟浩然之广陵",
    text: "故人西辞黄鹤楼，\n烟花三月下扬州。\n孤帆远影碧空尽，\n唯见长江天际流。",
    author: "李白",
    dynasty: "唐",
    overrideReason: "采用教材常见‘唯见’版本，并与已审核学习单元对齐。",
    reviewStatus: "approved_full_experience",
  },
  "west-lake-yin-hu-shang": {
    title: "饮湖上初晴后雨·其二",
    text: "水光潋滟晴方好，\n山色空蒙雨亦奇。\n欲把西湖比西子，\n淡妆浓抹总相宜。",
    author: "苏轼",
    dynasty: "宋",
    overrideReason: "统一题名异文格式，保留其二标记并与完整学习单元对齐。",
    reviewStatus: "approved_full_experience",
  },
  "west-lake-xiao-chu-jing-ci-si": {
    title: "晓出净慈寺送林子方",
    text: "毕竟西湖六月中，\n风光不与四时同。\n接天莲叶无穷碧，\n映日荷花别样红。",
    author: "杨万里",
    dynasty: "宋",
    overrideReason: "与已审核完整学习单元逐字对齐。",
    reviewStatus: "approved_full_experience",
  },
  "chengdu-chun-ye-xi-yu": {
    title: "春夜喜雨",
    text: "好雨知时节，\n当春乃发生。\n随风潜入夜，\n润物细无声。\n野径云俱黑，\n江船火独明。\n晓看红湿处，\n花重锦官城。",
    author: "杜甫",
    dynasty: "唐",
    overrideReason: "与已审核完整学习单元逐字对齐。",
    reviewStatus: "approved_full_experience",
  },
  "chengdu-jueju-two-orioles": {
    title: "绝句（两个黄鹂鸣翠柳）",
    text: "两个黄鹂鸣翠柳，\n一行白鹭上青天。\n窗含西岭千秋雪，\n门泊东吴万里船。",
    author: "杜甫",
    dynasty: "唐",
    overrideReason: "以首句为辨识语，避免与其他‘绝句’混淆。",
    reviewStatus: "approved_full_experience",
  },
  "chang-an-chun-wang": {
    title: "春望",
    text: "国破山河在，\n城春草木深。\n感时花溅泪，\n恨别鸟惊心。\n烽火连三月，\n家书抵万金。\n白头搔更短，\n浑欲不胜簪。",
    author: "杜甫",
    dynasty: "唐",
    overrideReason: "与已审核完整学习单元逐字对齐。",
    reviewStatus: "approved_full_experience",
  },
  "chang-an-zi-ye-wu-ge-qiu-ge": {
    title: "子夜吴歌·秋歌",
    text: "长安一片月，\n万户捣衣声。\n秋风吹不尽，\n总是玉关情。\n何日平胡虏，\n良人罢远征。",
    author: "李白",
    dynasty: "唐",
    overrideReason: "与已审核完整学习单元逐字对齐。",
    reviewStatus: "approved_full_experience",
  },
  "child-lu-chai": {
    text: "空山不见人，但闻人语响。\n返景入深林，复照青苔上。",
    overrideReason: "修正候选快照把‘但闻人语响’误录为‘但余钟磬音’的问题；保留原始快照，由人工 override 覆盖运行时。",
    overrideSource: {
      title: "人民教育出版社转载教材唐诗汇编 · 鹿柴",
      url: "https://www.pep.com.cn/rjdt/mtbd/202307/t20230718_1984406.shtml",
      retrievedAt: "2026-09-05",
      supports: ["text_original", "variant_correction"],
      license: "source-defined",
    },
    reviewStatus: "source_checked_text_override",
  },
  "child-qi-bu-shi": {
    genre: "五言古诗",
    overrideReason: "正文六句均为五字句，原始候选的‘四言古诗’会污染体裁检索；只修正体裁，不擅自合并六句本与四句本。",
    overrideSource: {
      title: "香港教育局《积累与感兴》· 七步诗参考版本",
      url: "https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/resources/primary/lang/jilei_shi_pdf/jilei_shi_007.pdf",
      retrievedAt: "2026-09-05",
      supports: ["five_character_line_structure", "variant_review"],
      license: "source-defined",
    },
    reviewStatus: "source_checked_genre_override",
  },
};

export default curatedOverrides;
