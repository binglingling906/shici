/**
 * Content-owner edits are kept outside the raw source snapshot.  The build
 * script merges these by stable ID and never writes back to either this file
 * or `raw-candidates.json`.
 */

const CATALOG_REVIEW_STATUS = "curated_content_v1";

function catalogReview({
  status = CATALOG_REVIEW_STATUS,
  reviewNotes,
  pinyinOverrides = [],
  spatialLearning,
  placeRelations,
  canonicalPlaceIds = [],
  relationAliases = [],
}) {
  return {
    reviewStatus: status,
    reviewFlags: {
      textReviewed: true,
      pinyinReviewed: true,
      meaningReviewed: true,
      geoReviewed: true,
      conceptReviewed: false,
    },
    pronunciationOverrides: pinyinOverrides,
    spatialLearning,
    placeRelations,
    canonicalPlaceIds,
    relationAliases,
    reviewNotes,
  };
}

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
    ...catalogReview({
      status: "approved_full_experience",
      reviewNotes: "既有 Gold Standard 内容复核并补齐目录层的拼音、送别空间和长江关系声明；扬州是诗中目的地，不推断李白确切行程。",
      spatialLearning: {
        coreRelation: "river-journey-and-distance",
        observation: "黄鹤楼是送别起点，孤帆沿长江向扬州远去；船影消失后只剩江流把视线带向天际。",
        mapAction: "先定位今天的黄鹤楼与扬州，再用‘起点—顺江—远方’复述诗中的视线，不把地图线当作已证实的唐代航迹。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "地图帮助我们理解方向和距离，但诗中的不舍要回到‘孤帆’和‘唯见’。",
      },
      placeRelations: [
        { targetId: "yellow-crane", type: "departure_place", confidence: "high", assertion: "诗句直接把黄鹤楼写成送别起点。", childMeaning: "朋友从江边楼下出发。", sourceKeys: ["chinesePoetry", "yellowCraneWuchang"] },
        { targetId: "yangzhou", type: "destination_mentioned", confidence: "high", assertion: "扬州是诗中明确写出的目的地。", childMeaning: "船顺江驶向远方的扬州。", sourceKeys: ["chinesePoetry"] },
        { targetId: "yangtze", type: "river_imagery", confidence: "medium", assertion: "长江出现在末句，是送别视线的水路参照，不等于已核实诗人的具体航线。", childMeaning: "江水把目光送到天边。", sourceKeys: ["chinesePoetry", "yangtzeNDRC"] },
      ],
    }),
  },
  "west-lake-yin-hu-shang": {
    title: "饮湖上初晴后雨·其二",
    text: "水光潋滟晴方好，\n山色空蒙雨亦奇。\n欲把西湖比西子，\n淡妆浓抹总相宜。",
    author: "苏轼",
    dynasty: "宋",
    overrideReason: "统一题名异文格式，保留其二标记并与完整学习单元对齐。",
    reviewStatus: "approved_full_experience",
    ...catalogReview({
      status: "approved_full_experience",
      reviewNotes: "既有 Gold Standard 内容复核；‘潋滟、空蒙、西子’释义和晴雨对照已与西湖现代文化景观关系分开记录。",
      spatialLearning: {
        coreRelation: "weather-and-lake-view",
        observation: "同一片西湖在晴天显水光、雨天显山色；天气改变的是观看条件，不是地点本身。",
        mapAction: "先找到西湖，再比较‘晴’与‘雨’两种视线，不把诗句当作固定天气记录。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "同一处山水可以有不止一种好看的样子。",
      },
      placeRelations: [
        { targetId: "west-lake", type: "depicts_place", confidence: "high", assertion: "诗题与诗句直接写西湖景色。", childMeaning: "晴雨都在西湖这片山水中发生。", sourceKeys: ["chinesePoetry", "westLakeHangzhou"] },
        { targetId: "hangzhou", type: "city_context", confidence: "medium", assertion: "西湖是杭州的文化景观参照；诗中没有提供作者精确站位。", childMeaning: "把湖放回杭州的城市山水里。", sourceKeys: ["westLakeHangzhou"] },
      ],
    }),
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
  "child-deng-guan-que-lou": {
    overrideReason: "第一批内容复核：正文、鹳雀读音、逐句释义、登高寓意与黄河/楼址关系已人工确认；保留现代参考位置边界。",
    ...catalogReview({
      reviewNotes: "《登鹳雀楼》先按诗中观察位置教学；鹳雀楼历史地理与黄河关系作为参考，不把现代楼址自动当成王之涣当日站位。",
      pinyinOverrides: [
        { path: "title.token-2", char: "鹳", pinyin: "guàn", reason: "鹳雀楼专名读 guàn què。" },
        { path: "title.token-3", char: "雀", pinyin: "què", reason: "鹳雀楼专名读 guàn què。" },
        { path: "line-4.token-1", char: "更", pinyin: "gèng", reason: "‘更上一层楼’中为再、还要更高之意。" },
      ],
      spatialLearning: {
        coreRelation: "climb-and-horizon",
        observation: "楼上视线从夕阳、黄河推向千里之外；‘更上’是诗中具体的登高动作。",
        mapAction: "把鹳雀楼作为历史地标参考、黄河作为区域参照，先用‘楼—河—远方’说画面，不画出未经证实的诗人路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "改变观察高度，视野可能变得更开阔。",
      },
      placeRelations: [
        { targetId: "yellow-river", type: "river_imagery", confidence: "high", assertion: "黄河直接出现在第二句，是诗中远望的河流参照。", childMeaning: "河流把眼前的楼景带到远方。", sourceKeys: ["chinesePoetry"] },
        { targetId: "yellow-river", type: "landmark_reference", confidence: "medium", assertion: "鹳雀楼的常见历史定位与黄河沿岸区域有关；运行时只用黄河区域关系，不断言具体楼址争议已解决。", childMeaning: "山河和高楼共同打开远望尺度。", sourceKeys: ["chinesePoetry"] },
      ],
    }),
  },

  "child-zao-fa-bai-di-cheng": {
    overrideReason: "第一批内容复核：白帝城—江陵行舟空间、‘还/重’语境读音、速度夸张与归途背景边界已人工确认。",
    ...catalogReview({
      reviewNotes: "白帝城与江陵是诗句中的起点/方向参照；‘千里一日’按诗歌体验解释，不自动生成实际航程或精确路线。",
      pinyinOverrides: [
        { path: "line-2.token-7", char: "还", pinyin: "huán", reason: "‘一日还’是返回江陵，读 huán，不能沿用‘还有’语境的 hái。" },
        { path: "line-4.token-6", char: "重", pinyin: "chóng", reason: "‘万重山’表示层层山岭，不是重量的 zhòng。" },
      ],
      spatialLearning: {
        coreRelation: "river-journey-and-speed",
        observation: "船从白帝城顺江向江陵，猿声在两岸回响，船身却迅速穿过层层山峡。",
        mapAction: "连接白帝城和江陵两个诗中地点，再用箭头标顺江方向；明确这是诗中叙述的空间，不是现代导航路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "地名给方向，声音和动词让我们感到船行速度。",
      },
      placeRelations: [
        { targetId: "baidi-city", type: "departure_place", confidence: "high", assertion: "首句直接写从白帝城清晨出发。", childMeaning: "旅程从高处的山城开始。", sourceKeys: ["chinesePoetry"] },
        { targetId: "jiangling", type: "river_journey", confidence: "high", assertion: "第二句直接写向江陵返回；诗意‘千里一日’不等于核定航时。", childMeaning: "小舟沿江快速驶向江陵。", sourceKeys: ["chinesePoetry"] },
        { targetId: "yangtze", type: "river_journey", confidence: "medium", assertion: "白帝城—江陵关系落在长江上游峡江区域参照中，不能替代历史行程证据。", childMeaning: "江水把起点和目的地连起来。", sourceKeys: ["chinesePoetry", "yangtzeNDRC"] },
      ],
    }),
  },

  "child-liang-zhou-ci": {
    overrideReason: "第一批内容复核：羌笛/杨柳曲、玉门关边地语境、‘不度’变调与黄河空间参照已人工确认。",
    ...catalogReview({
      reviewNotes: "《凉州词》以边地诗境为主，不将‘春风不度’显示为气象事实；凉州、玉门关与黄河只作诗中/现代参考关系。",
      pinyinOverrides: [
        { path: "line-2.token-1", char: "一", pinyin: "yí", reason: "‘一片’后接去声，按连续朗读读 yí。" },
        { path: "line-4.token-3", char: "不", pinyin: "bú", reason: "‘不度’后接去声 dù，按连续朗读读 bú。" },
      ],
      spatialLearning: {
        coreRelation: "frontier-scale-and-sound",
        observation: "黄河、白云、孤城和高山先铺开边地尺度，羌笛再把人的乡愁带进玉门关的距离。",
        mapAction: "把凉州、玉门关和黄河作为区域参照点，用‘远、孤、关外’复述诗境；不把诗句画成春风的气象边界。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "宏大地图里的一个笛声，也能装下人的思乡。",
      },
      placeRelations: [
        { targetId: "liangzhou", type: "frontier", confidence: "medium", assertion: "题名和诗境常与唐代凉州边塞区域相连，作文化地理参照，不断言写作地点。", childMeaning: "把孤城放回西北边地。", sourceKeys: ["chinesePoetry"] },
        { targetId: "yumen-pass", type: "frontier", confidence: "high", assertion: "玉门关是诗中明确写出的边关地名。", childMeaning: "春意和思念被关隘隔向远方。", sourceKeys: ["chinesePoetry"] },
        { targetId: "yellow-river", type: "river_imagery", confidence: "high", assertion: "黄河直接出现在首句，是远望画面的河流参照，不是孤城的精确位置。", childMeaning: "河流从白云远处伸来。", sourceKeys: ["chinesePoetry"] },
      ],
    }),
  },

  "child-song-yuan-er-an-xi": {
    overrideReason: "第一批内容复核：浥、朝雨、故人及渭城—阳关送别方向已人工确认；兼容旧数据中的 weicheg 地点 ID。",
    ...catalogReview({
      reviewNotes: "将‘渭城’按长安西郊历史称谓处理，将阳关作出关方向；不把现代地图连线当成王维/元二完整行程证据。",
      pinyinOverrides: [
        { path: "line-1.token-3", char: "朝", pinyin: "zhāo", reason: "‘朝雨’为清晨的雨，读 zhāo。" },
        { path: "line-1.token-5", char: "浥", pinyin: "yì", reason: "‘浥’为沾湿、润湿，按词语语境确认。" },
        { path: "line-3.token-3", char: "更", pinyin: "gèng", reason: "‘更尽一杯酒’为再、又，读 gèng。" },
        { path: "line-3.token-5", char: "一", pinyin: "yì", reason: "‘一杯’按连续朗读读 yì。" },
      ],
      spatialLearning: {
        coreRelation: "farewell-route-and-threshold",
        observation: "送别发生在渭城客舍，阳关把眼前酒席与向西的远行分开；柳色是近景，关口是远景。",
        mapAction: "用渭城（兼容旧 ID weicheg）和阳关两个地点标出‘出发—出关’方向；不补写未被诗句证实的路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "一个方向和一杯酒，就能让告别从眼前延伸到远方。",
      },
      canonicalPlaceIds: ["weicheng", "yangguan"],
      relationAliases: [{ legacyId: "weicheg", canonicalId: "weicheng", label: "渭城", note: "保留旧地图节点 weicheg，内容关系采用规范拼写 weicheng；不破坏已有链接。" }],
      placeRelations: [
        { targetId: "weicheg", canonicalTargetId: "weicheng", type: "departure_place", confidence: "medium", assertion: "渭城是送别所在的历史地名；旧运行时 ID weicheg 保持兼容。", childMeaning: "雨后的客舍是送友出发前的地方。", sourceKeys: ["chinesePoetry"] },
        { targetId: "yangguan", type: "frontier", confidence: "high", assertion: "阳关是诗中明确写出的向西出关方向。", childMeaning: "朋友将走向更远的边地。", sourceKeys: ["chinesePoetry"] },
      ],
    }),
  },

  "child-jiu-yue-jiu-ri": {
    overrideReason: "第一批内容复核：‘山东’古义边界、重阳习俗、茱萸读音和长安—华山方向关系已人工确认。",
    ...catalogReview({
      reviewNotes: "题目中的山东采用‘华山以东’的传统解释，不直接等同现代山东省；地图只表达异乡与家乡方向，不生成王维具体行程。",
      pinyinOverrides: [
        { path: "line-1.token-5", char: "为", pinyin: "wéi", reason: "‘为异客’是作为、成为异乡客人，读 wéi。" },
        { path: "line-4.token-5", char: "少", pinyin: "shǎo", reason: "‘少一人’是少了、缺少，读 shǎo。" },
      ],
      spatialLearning: {
        coreRelation: "festival-distance-and-memory",
        observation: "诗人在异乡，想象兄弟在家乡登高；重阳习俗把两地画面连起来，‘少一人’标出缺席。",
        mapAction: "用长安与华山以东的家乡方向作现代参考，不把‘山东’钉成今天的山东省行政区，也不推断精确出发点。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "节日习俗能把不在一起的人放进同一幅记忆画面。",
      },
      canonicalPlaceIds: ["chang-an", "hua-shan"],
      placeRelations: [
        { targetId: "chang-an", type: "homecoming", confidence: "medium", assertion: "长安可作为诗人身处关中的现代区域参考，不主张诗句证明精确写作地点。", childMeaning: "诗人在离家很远的地方过节。", sourceKeys: ["chinesePoetry"] },
        { targetId: "hua-shan", type: "mountain_association", confidence: "medium", assertion: "‘山东’传统注释常以华山为界理解为山的东面；这是古义方向解释，不是现代省名。", childMeaning: "家乡在山的另一边。", sourceKeys: ["chinesePoetry"] },
      ],
    }),
  },

  "child-bo-chuan-gua-zhou": {
    overrideReason: "第一批内容复核：‘间、绿、还’语境读音、瓜洲—京口—钟山空间和归乡寓意已人工确认。",
    ...catalogReview({
      reviewNotes: "瓜洲、京口、钟山作为诗中地点关系；现代地图用于理解江南相对位置，不等同王安石当时精确航线。",
      pinyinOverrides: [
        { path: "line-1.token-7", char: "间", pinyin: "jiān", reason: "‘一水间’是中间、相隔，读 jiān。" },
        { path: "line-2.token-6", char: "重", pinyin: "chóng", reason: "‘数重山’是层层山岭，读 chóng。" },
        { path: "line-4.token-7", char: "还", pinyin: "huán", reason: "‘照我还’是回去，读 huán。" },
      ],
      spatialLearning: {
        coreRelation: "river-crossing-and-homecoming",
        observation: "瓜洲与京口隔一水，钟山在数重山外；春风让江南岸变绿，明月又把目光带回归乡。",
        mapAction: "按瓜洲—京口—钟山的相对关系看江南水陆距离，标注‘现代参考’并不复原诗人的完整路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "近的地点也可能因为江水和山路让归家变慢。",
      },
      canonicalPlaceIds: ["jinling", "yangtze"],
      placeRelations: [
        { targetId: "jinling", type: "homecoming", confidence: "medium", assertion: "钟山与金陵区域相关，作为诗中归乡方向参照，不断言作者此刻的确切停舟位置。", childMeaning: "山那边是想回去的地方。", sourceKeys: ["chinesePoetry"] },
        { targetId: "yangtze", type: "river_journey", confidence: "high", assertion: "京口、瓜洲之间的水面是诗中直接的空间分隔。", childMeaning: "一条江水隔开眼前和归处。", sourceKeys: ["chinesePoetry", "yangtzeNDRC"] },
      ],
    }),
  },

  "child-ci-bei-gu-shan-xia": {
    overrideReason: "第一批内容复核：‘次’题义、潮风日春的时间空间推进、归雁寄书寓意和北固山—洛阳关系已人工确认。",
    ...catalogReview({
      reviewNotes: "北固山与洛阳是诗中相对位置参照；归雁是诗意寄托，不把它显示为真实邮递路线。",
      pinyinOverrides: [
        { path: "title.token-1", char: "次", pinyin: "cì", reason: "‘次北固山下’中的‘次’为停留、驻扎。" },
        { path: "line-2.token-1", char: "行", pinyin: "xíng", reason: "‘行舟’为行进中的船，读 xíng。" },
        { path: "line-4.token-3", char: "一", pinyin: "yì", reason: "‘一帆’按连续朗读读 yì。" },
      ],
      spatialLearning: {
        coreRelation: "river-time-and-home-letter",
        observation: "行舟经过北固山，潮、风、日出和江春把旅途向前推；乡书和归雁把心思引向洛阳。",
        mapAction: "先看北固山附近的江面，再沿‘水路向前—目光回乡’两条箭头理解，不把现代路线当成王湾行迹证据。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8"],
        childTakeaway: "身体在路上，心也可以沿着一封信回到家乡。",
      },
      placeRelations: [
        { targetId: "beigu-mountain", type: "river_journey", confidence: "high", assertion: "题目直接以北固山下作为停舟/行舟的空间参照。", childMeaning: "诗人从山下江面观察潮风。", sourceKeys: ["chinesePoetry"] },
        { targetId: "luoyang", type: "homecoming", confidence: "high", assertion: "末句直接写洛阳，是乡书与归雁的目的方向。", childMeaning: "家书想沿雁路回到洛阳。", sourceKeys: ["chinesePoetry"] },
      ],
    }),
  },

  "child-le-you-yuan": {
    overrideReason: "第一批内容复核：乐游原历史地名、‘不适’语境读音、夕阳与黄昏的时间关系已人工确认。",
    ...catalogReview({
      reviewNotes: "乐游原作为长安南郊历史游览地参照；诗句不提供诗人精确站位，现代城市地图不等同唐代原貌。",
      pinyinOverrides: [
        { path: "line-1.token-4", char: "不", pinyin: "bù", reason: "‘不适’按词语本调标 bù shì，意为心情不舒畅；不采用自动连续变调候选 bú。" },
      ],
      spatialLearning: {
        coreRelation: "hilltop-and-sunset",
        observation: "诗人因傍晚心情郁闷登上长安南郊古原，从较高处看见夕阳，再意识到黄昏将近。",
        mapAction: "把乐游原作为长安历史游览地参照，使用‘城市—古原—远望’复述诗境，不标注未经证实的观景坐标。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "登高换来开阔的视野，也让时间将尽变得更清楚。",
      },
      canonicalPlaceIds: ["chang-an"],
      placeRelations: [
        { targetId: "chang-an", type: "historical_city", confidence: "medium", assertion: "乐游原是长安城南的历史游览地，诗中地名关系明确；现代城市边界不等同唐代景观。", childMeaning: "从城南高原看夕阳。", sourceKeys: ["chinesePoetry"] },
      ],
    }),
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
