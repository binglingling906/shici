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

  "child-yong-e": {
    overrideReason: "第二批内容复核：曲项、浮、拨的儿童释义与观察顺序已人工确认；不强加未经诗句证明的地理关系。",
    ...catalogReview({
      reviewNotes: "《咏鹅》是动物观察小诗，重点是声音、颜色和动作；目录保留无地点关系状态，不为动物诗虚构地理定位。",
      pinyinOverrides: [
        { path: "line-4.token-1", char: "曲", pinyin: "qū", reason: "‘曲项’指弯曲的脖子，读 qū，不是歌曲的 qǔ。" },
      ],
    }),
  },

  "child-min-nong-two": {
    overrideReason: "第二批内容复核：锄禾、汗滴与盘中餐的劳动关系已人工确认；不附会具体农田地点。",
    ...catalogReview({
      reviewNotes: "《悯农·其二》把餐桌与田间劳动连起来，属于普遍劳动教育语境；诗句没有可核定的单一地理地点。",
    }),
  },

  "child-jing-ye-si": {
    overrideReason: "第二批内容复核：床前月光—举头—低头的视线推进与思乡寓意已人工确认；不把诗意地点误写成作者行踪。",
    ...catalogReview({
      reviewNotes: "《静夜思》以室内月夜和故乡想象为核心，保留无地点关系状态，避免把常见传说地点当成诗句证据。",
    }),
  },

  "child-chun-xiao": {
    overrideReason: "第二批内容复核：闻的语境、觉的读音、风雨与花落的时间关系已人工确认。",
    ...catalogReview({
      reviewNotes: "《春晓》用声音回想昨夜花落，不把花落数量、天气或具体地点当作事实数据。",
      pinyinOverrides: [
        { path: "line-1.token-4", char: "觉", pinyin: "jué", reason: "‘不觉晓’表示不知不觉天亮，读 jué，不是睡觉的 jiào。" },
      ],
    }),
  },

  "child-cun-ju": {
    overrideReason: "第二批内容复核：草长、纸鸢等儿童易混词与远近镜头关系已人工确认；不推断诗人精确写作地点。",
    ...catalogReview({
      reviewNotes: "《村居》描写乡村早春与儿童放风筝，地理只保留乡村场景的文学尺度，不绑定现代行政地点。",
      pinyinOverrides: [
        { path: "line-1.token-2", char: "长", pinyin: "zhǎng", reason: "‘草长’写草木生长，读 zhǎng，不是长度的 cháng。" },
      ],
    }),
  },

  "child-xiao-chi": {
    overrideReason: "第三批内容复核：泉眼、树阴、小荷与蜻蜓的推近观察、拟人和初夏生命画面已人工确认；不把西湖候选误写成诗人精确观景地。",
    ...catalogReview({
      reviewNotes: "《小池》是小水面观察诗。运行时保留西湖作为候选水面参照，但诗句不点名西湖，地图只展示现代参考关系，不断言杨万里写作或观景位置。",
      pinyinOverrides: [
        { path: "line-3.token-4", char: "露", pinyin: "lù", reason: "‘才露尖尖角’中为露出、显现，读 lù；不是名词‘露水’之外的误读。" },
      ],
      spatialLearning: {
        coreRelation: "small-water-and-close-observation",
        observation: "视线从泉眼和树影推近到刚露尖角的小荷，最后停在荷尖上的蜻蜓；这是小池内部的近景关系。",
        mapAction: "把小池作为西湖水面意象的候选参照，但优先用‘泉眼—荷叶—蜻蜓’读近景，不绑定现代西湖具体位置。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "慢慢靠近小景，也能发现一整个有动作的自然世界。",
      },
      placeRelations: [
        { targetId: "west-lake", type: "interpretive_association", confidence: "low", assertion: "候选目录将西湖作为水面参照，但诗题与诗句只写小池，不直接点名西湖。", childMeaning: "先把它当作一方小池来观察。", sourceKeys: ["chinesePoetry"] },
      ],
    }),
  },

  "child-chile-ge": {
    overrideReason: "第三批内容复核：敕勒川、阴山、穹庐和风吹草低见牛羊的空间镜头与多音字已人工确认；保留历史地理边界。",
    ...catalogReview({
      reviewNotes: "诗中直接写敕勒川与阴山下的草原场景；阴山只作历史地理参照，不把敕勒川自动等同某个现代行政区或给出精确坐标。",
      pinyinOverrides: [
        { path: "line-4.token-1", char: "笼", pinyin: "lǒng", reason: "‘笼盖四野’是覆盖、包住，读 lǒng，不是灯笼的 lóng。" },
        { path: "line-7.token-5", char: "见", pinyin: "xiàn", reason: "‘风吹草低见牛羊’是牛羊显现，读 xiàn，不是看见的 jiàn。" },
      ],
      spatialLearning: {
        coreRelation: "grassland-horizon-and-wind",
        observation: "先看阴山脚下的草原和穹庐般的天空，再让风把草压低，使牛羊从视野中显现。",
        mapAction: "用阴山作历史区域参照，重点呈现‘山下—四野—风吹草低’的尺度变化，不绘制未经核定的敕勒川现代边界。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7"],
        childTakeaway: "风让原本辽阔而安静的草原显出生命。",
      },
      placeRelations: [
        { targetId: "yinshan", type: "landscape_mentioned", confidence: "medium", assertion: "第二句直接写阴山下，是诗中草原的地理参照；历史地域范围不自动等同现代行政区。", childMeaning: "阴山在草原一侧，帮助我们感受天地的远近。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["yinshan"],
    }),
  },

  "child-wang-dong-ting": {
    overrideReason: "第三批内容复核：湖光秋月、无风如镜和白银盘青螺比喻已人工确认；地理层只保留洞庭湖参照，不把比喻当测量事实。",
    ...catalogReview({
      reviewNotes: "题目直接点名洞庭，湖面是明确的诗境参照；‘白银盘’与‘青螺’属于形色比喻，不自动指认具体山体或诗人精确站位。",
      pinyinOverrides: [
        { path: "line-1.token-7", char: "和", pinyin: "hé", reason: "‘两相和’表示湖光与秋月和谐相融，读 hé。" },
        { path: "line-2.token-7", char: "磨", pinyin: "mó", reason: "‘镜未磨’是打磨镜面的磨，读 mó。" },
        { path: "line-4.token-5", char: "一", pinyin: "yì", reason: "‘一青螺’后接第一声 qīng，连续朗读取 yì。" },
      ],
      spatialLearning: {
        coreRelation: "lake-moon-and-mountain-metaphor",
        observation: "视线从月光与湖面移到远望洞庭的青山，再用银盘和青螺把湖山关系缩成清晰形状。",
        mapAction: "以洞庭湖作现代区域参照，先观察湖面—远山的关系；不把青螺比喻直接标成未经诗句确认的具体山名。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "比喻能把很大的湖山关系变成眼前看得见的形状。",
      },
      placeRelations: [
        { targetId: "dongting-lake", type: "lake", confidence: "high", assertion: "题目直接写洞庭，第三句再次写遥望洞庭；湖面是诗境的明确区域参照。", childMeaning: "月光照在洞庭湖面，远山像湖上的小景。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["dongting-lake"],
    }),
  },

  "child-wang-tian-men-shan": {
    overrideReason: "第三批内容复核：江水穿山、回旋、两岸相对与孤帆来处的空间关系已人工确认；不把诗意夸张当作地貌测量。",
    ...catalogReview({
      reviewNotes: "题目与首句把天门山、楚江作为山水参照；地图可以呈现两山夹江的现代相对位置，但不推断李白的精确观景坐标。",
      pinyinOverrides: [
        { path: "line-2.token-7", char: "回", pinyin: "huí", reason: "‘至此回’写江水在此回旋、转弯，读 huí，不是返回某处的固定路线。" },
        { path: "line-4.token-3", char: "一", pinyin: "yí", reason: "‘一片’后接去声 piàn，连续朗读取 yí。" },
      ],
      spatialLearning: {
        coreRelation: "river-through-mountains-and-approaching-sail",
        observation: "江水从两山之间穿过并回旋，两岸青山向行舟展开，远处孤帆沿日边驶来。",
        mapAction: "把天门山两岸与楚江画成‘山—江—山’的相对关系，再用箭头表示水流和帆船来向；不替诗人补写路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "方向、远近和动作能让一张山水图变成正在发生的行舟。",
      },
      placeRelations: [
        { targetId: "tianmen-mountain", type: "mountain_river", confidence: "high", assertion: "题目直接点名天门山，首句写楚江穿山，山水关系明确；不将夸张表达当作地貌测量。", childMeaning: "两山夹江，船从水道中望见山势展开。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["tianmen-mountain"],
    }),
  },

  "child-feng-qiao-ye-bo": {
    overrideReason: "第三批内容复核：月落、江枫渔火、寒山寺钟声的视听层次与姑苏古称已人工确认；不把文化地理关系升级为精确泊船位置。",
    ...catalogReview({
      reviewNotes: "诗中直接写姑苏城外寒山寺与客船；苏州只作文化地理参照，钟声传到客船是诗中听觉关系，不证明具体泊位。",
      pinyinOverrides: [
        { path: "line-1.token-2", char: "落", pinyin: "luò", reason: "‘月落’写月亮落下，读 luò，不是落下物品之外的其他语境。" },
      ],
      spatialLearning: {
        coreRelation: "night-waterway-and-sound",
        observation: "客船停在江夜，视觉从月、霜、枫树和渔火推向远处寺院，最后由钟声跨越水面抵达船上。",
        mapAction: "以苏州水网和寒山寺作文化地理参照，重点用‘寺—水道—客船—钟声’理解距离，不标注未经证实的精确泊位。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "声音能连接看不见的地方，让夜晚的地图有了方向。",
      },
      placeRelations: [
        { targetId: "suzhou", type: "cultural_association", confidence: "high", assertion: "‘姑苏’是苏州的古称，诗句直接写姑苏城外寒山寺；这说明文化地理场景，不等同精确泊船点。", childMeaning: "客船在苏州水网的夜色中听见寺钟。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["suzhou"],
    }),
  },

  "child-min-nong-one": {
    overrideReason: "第四批内容复核：播种—收获—天下田野—农夫处境的反差、‘种’读音与历史社会边界已人工确认；不把普遍劳动主题硬贴到具体地点。",
    ...catalogReview({
      reviewNotes: "诗句没有可核定的单一地理地点；‘四海’是天下各处的宽泛说法，不是现代行政边界，也不据此生成农田坐标。",
      pinyinOverrides: [
        { path: "line-1.token-2", char: "种", pinyin: "zhòng", reason: "‘春种一粒粟’中的种是播种动作，读 zhòng，不是名词‘种子’的 zhǒng。" },
      ],
      spatialLearning: {
        coreRelation: "seed-field-harvest-and-labor",
        observation: "视线从一粒种子和一块田，放大到四海田野，再落回农夫的生活处境；这是劳动关系的空间放大，不是路线地图。",
        mapAction: "可以画‘种子—田地—收成—餐桌/劳动者’的关系图；不把‘四海’画成精确边界，也不虚构诗人的行走地点。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "食物来自土地和劳动，读诗时既要珍惜粮食，也要看见劳动者。",
      },
    }),
  },

  "child-suo-jian": {
    overrideReason: "第四批内容复核：骑牛、回荡的歌声、捕蝉与忽然安静的动作链已人工确认；‘樾’的字义与读音已校正，不虚构诗中地点。",
    ...catalogReview({
      reviewNotes: "诗句只提供乡野树林的儿童观察场景，没有可核定的单一地点；‘林樾’是树荫空间，不等于地名或行政区域。",
      pinyinOverrides: [
        { path: "line-2.token-5", char: "樾", pinyin: "yuè", reason: "‘林樾’中的樾指树木枝叶形成的树荫，读 yuè，不作地点名处理。" },
      ],
      spatialLearning: {
        coreRelation: "pastoral-path-and-soundscape",
        observation: "孩子骑牛沿乡间路径移动，歌声从牛背传入树林；发现蝉后，声音和动作一起收住。",
        mapAction: "用‘小路—牛背—树荫—蝉声’画一条近距离观察路径，不把牧童的活动地点推定为某个真实村庄。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "空间不只靠地图大小，也能靠声音远近和动作变化被感知。",
      },
    }),
  },

  "child-chi-shang": {
    overrideReason: "第四批内容复核：小艇采莲、浮萍分开留下水痕的因果关系与‘解/藏’语境读音已人工确认；不把池塘场景误标为具体名胜。",
    ...catalogReview({
      reviewNotes: "诗中只有池塘、白莲、浮萍等水面意象，没有可核定的单一地理地点；‘一道开’是船行留下的局部水痕，不是道路或边界。",
      pinyinOverrides: [
        { path: "line-3.token-2", char: "解", pinyin: "jiě", reason: "‘不解’意为不懂得、不会，读 jiě，不是押解义的 jiè。" },
        { path: "line-3.token-3", char: "藏", pinyin: "cáng", reason: "‘藏踪迹’意为隐藏痕迹，读 cáng，不是宝藏义的 zàng。" },
      ],
      spatialLearning: {
        coreRelation: "pond-route-and-floating-plant-trace",
        observation: "小艇从白莲间返回，船身把浮萍向两边分开，水面留下能回望的路径痕迹。",
        mapAction: "把池塘画成‘采莲处—返程—浮萍水痕’的小尺度空间，不给它附会成某一处历史名胜。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "看似悄悄的行动也会在环境中留下线索。",
      },
    }),
  },

  "child-ye-su-shan-si": {
    overrideReason: "第四批内容复核：山寺高楼、星辰夸张与放轻声音的想象关系已人工确认；‘危’和‘语’的语境读音已校正，不把诗意高度当作实测建筑数据。",
    ...catalogReview({
      reviewNotes: "诗题只说明夜宿山寺，未提供可核定的具体寺名或坐标；‘危楼’的高与‘天上人’的想象不等同真实地理或建筑测量。",
      pinyinOverrides: [
        { path: "line-3.token-5", char: "语", pinyin: "yǔ", reason: "‘不敢高声语’中的语是说话，读 yǔ；‘高声’修饰声音大小。" },
      ],
      spatialLearning: {
        coreRelation: "mountain-temple-height-and-sky",
        observation: "站在山寺高楼，视线从楼脚抬向星辰；登高带来空间距离被压缩的感觉，随后夜色让人主动安静。",
        mapAction: "用‘山寺—高楼—星空’表示垂直层次，不为‘危楼’赋予未经诗句证明的高度，也不指定具体寺院。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "诗歌可以用夸张把登高时的惊奇放大，但想象不等于测量结果。",
      },
    }),
  },

  "child-zeng-wang-lun": {
    overrideReason: "第四批内容复核：桃花潭送别水面、岸上踏歌与水深—友情比较已人工确认；‘将/行/踏’读音已按语境校正，不由诗句推断完整历史航线。",
    ...catalogReview({
      reviewNotes: "桃花潭是诗中送别与水深比较的现代参考地点；诗句不提供具体泊位或完整行程，地图只呈现水面—岸边—离舟的关系。",
      pinyinOverrides: [
        { path: "line-1.token-5", char: "将", pinyin: "jiāng", reason: "‘将欲行’表示将要、正准备出发，读 jiāng，不是将领义的 jiàng。" },
        { path: "line-1.token-7", char: "行", pinyin: "xíng", reason: "‘欲行’表示出发、离开，读 xíng，不是银行义的 háng。" },
        { path: "line-2.token-5", char: "踏", pinyin: "tà", reason: "‘踏歌’是踏着节拍唱歌，读 tà，不是脚步之外的其他语境。" },
      ],
      spatialLearning: {
        coreRelation: "shore-song-and-departing-boat",
        observation: "李白的船将离开桃花潭，岸上汪伦踏歌相送；水面把出发者和送行者暂时分隔，又让歌声跨过来。",
        mapAction: "以桃花潭作现代区域参照，标出‘岸边—船—潭水’三者关系；不画成已核实的唐代精确航迹或泊位。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "地图能说明送别发生在哪里、彼此隔着什么；友情的深度仍要由诗句来感受。",
      },
      placeRelations: [
        { targetId: "taohuatan", type: "departure_place", confidence: "medium", assertion: "诗中写李白将欲行、岸上送歌，桃花潭是送别水面参照；不据此断言具体泊位或完整旅行路线。", childMeaning: "船将离岸，朋友的歌声从岸边追来。", sourceKeys: ["chinesePoetry"] },
        { targetId: "taohuatan", type: "river_imagery", confidence: "high", assertion: "桃花潭直接出现在第三句，是水深与友情比较的诗中景物。", childMeaning: "自然水深成为表达友情深度的参照。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["taohuatan"],
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
