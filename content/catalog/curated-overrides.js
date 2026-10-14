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
    ...catalogReview({
      status: "approved_full_experience",
      reviewNotes: "完整单元已复核；瀑布、香炉峰和远望关系用于理解观察尺度，庐山坐标只是今天的山体参考，不还原李白精确行程。",
      spatialLearning: {
        coreRelation: "mountain-waterfall-and-vertical-gaze",
        observation: "视线先落在香炉峰的光雾，再退到远处瀑布，随后沿水流向下，最后用银河想象把高度推向天空。",
        mapAction: "先定位庐山，再用‘山峰—瀑布—山下—天际’复述高低远近，不把夸张的三千尺当作测量值。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "看山水时换一换距离和方向，眼前的同一处景物会打开不同的尺度。",
      },
      placeRelations: [
        { targetId: "lushan", type: "depicts_place", confidence: "high", assertion: "诗题直接写庐山，瀑布和香炉峰构成庐山山水观察参照。", childMeaning: "从山峰和瀑布的高低关系认识庐山。", sourceKeys: ["chinesePoetry", "unescoLushan"] },
        { targetId: "yangtze", type: "regional_context", confidence: "medium", assertion: "庐山处在长江中游山水区域中，长江只作区域参照，不等同诗中瀑布的具体水路。", childMeaning: "把一座山放回江湖相邻的山水区域。", sourceKeys: ["yangtzeNDRC", "unescoLushan"] },
      ],
      canonicalPlaceIds: ["lushan"],
    }),
  },
  "lushan-ti-xi-lin-bi": {
    title: "题西林壁",
    text: "横看成岭侧成峰，\n远近高低各不同。\n不识庐山真面目，\n只缘身在此山中。",
    author: "苏轼",
    dynasty: "宋",
    overrideReason: "与已审核完整学习单元逐字对齐。",
    reviewStatus: "approved_full_experience",
    ...catalogReview({
      status: "approved_full_experience",
      reviewNotes: "完整单元已复核；横侧、远近、高低的视角变化是学习重点，庐山现代参考点不代表苏轼写诗时的精确站位。",
      spatialLearning: {
        coreRelation: "mountain-viewpoint-and-limited-perspective",
        observation: "镜头先在山中横看、侧看，再拉开远近和高低，最后意识到身在山中会挡住完整面貌。",
        mapAction: "用‘山中局部—换方向—拉开距离—看整体’表示观察过程，不把诗句当成四个固定景点。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "遇到看不全的事，可以换位置、补信息，再判断整体。",
      },
      placeRelations: [
        { targetId: "lushan", type: "depicts_place", confidence: "high", assertion: "诗句直接围绕庐山不同视角展开，庐山是观察对象而非精确路线。", childMeaning: "同一座山从不同位置会呈现不同样子。", sourceKeys: ["chinesePoetry", "unescoLushan"] },
      ],
      canonicalPlaceIds: ["lushan"],
    }),
  },
  "yellow-crane-huang-he-lou": {
    title: "黄鹤楼",
    text: "昔人已乘黄鹤去，\n此地空余黄鹤楼。\n黄鹤一去不复返，\n白云千载空悠悠。\n晴川历历汉阳树，\n芳草萋萋鹦鹉洲。\n日暮乡关何处是？\n烟波江上使人愁。",
    author: "崔颢",
    dynasty: "唐",
    overrideReason: "与已审核完整学习单元逐字对齐。",
    reviewStatus: "approved_full_experience",
    ...catalogReview({
      status: "approved_full_experience",
      reviewNotes: "完整单元已复核；楼、江、洲和乡关构成由眼前到故乡的视线链，黄鹤楼现代位置用于文化参照，不把诗句还原为崔颢精确行程。",
      pinyinOverrides: [
        { path: "line-4.token-4", char: "载", pinyin: "zǎi", reason: "‘千载’表示千年时间，载读 zǎi，不是装载义的 zài。" },
      ],
      spatialLearning: {
        coreRelation: "tower-river-and-homesickness",
        observation: "视线从传说和黄鹤楼落到晴川、汉阳树、鹦鹉洲，日暮时越过烟波江面回到乡关的牵挂。",
        mapAction: "先定位黄鹤楼，再用‘楼—江洲—乡关’复述由近及远的观察，不把汉阳树和鹦鹉洲当作作者完整路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8"],
        childTakeaway: "站在一个地方远望，眼前的江景也可能把心带回自己的故乡。",
      },
      placeRelations: [
        { targetId: "yellow-crane", type: "depicts_place", confidence: "high", assertion: "题目和诗句直接写黄鹤楼，是登临远望的空间起点。", childMeaning: "从楼上打开江天和城市的视野。", sourceKeys: ["chinesePoetry", "yellowCraneWuhan"] },
        { targetId: "yangtze", type: "river_imagery", confidence: "high", assertion: "烟波江上是诗中乡愁视线的江面参照，不证明诗人的精确站位。", childMeaning: "江水和烟波把目光带向更远的地方。", sourceKeys: ["chinesePoetry", "yangtzeNDRC"] },
      ],
      canonicalPlaceIds: ["yellow-crane"],
    }),
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
    ...catalogReview({
      status: "approved_full_experience",
      reviewNotes: "完整单元已复核；净慈寺出行、六月西湖与莲叶荷花的季节关系清楚，地图只表达西湖和杭州文化景观参照。",
      spatialLearning: {
        coreRelation: "temple-exit-and-summer-lake-color",
        observation: "镜头从净慈寺出门来到六月西湖，先总写季节不同，再由莲叶铺开的绿色推进到映日荷花的红色。",
        mapAction: "用‘净慈寺—西湖湖面—莲叶—荷花’复述从出寺到湖景的观察顺序，不把‘接天’解释成真实无边界。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "同一片湖水在不同季节有自己的颜色和气质，观察要回到具体景物。",
      },
      placeRelations: [
        { targetId: "west-lake", type: "depicts_place", confidence: "high", assertion: "诗句直接写西湖六月风光，西湖是主要观察空间。", childMeaning: "从湖面的莲叶和荷花读夏天。", sourceKeys: ["chinesePoetry", "westLakeHangzhou"] },
        { targetId: "hangzhou", type: "city_context", confidence: "medium", assertion: "西湖位于今天杭州的城市文化景观中，诗句不提供作者精确行走路线。", childMeaning: "把湖景放回杭州的城市山水背景。", sourceKeys: ["westLakeHangzhou"] },
      ],
      canonicalPlaceIds: ["west-lake"],
    }),
  },
  "chengdu-chun-ye-xi-yu": {
    title: "春夜喜雨",
    text: "好雨知时节，\n当春乃发生。\n随风潜入夜，\n润物细无声。\n野径云俱黑，\n江船火独明。\n晓看红湿处，\n花重锦官城。",
    author: "杜甫",
    dynasty: "唐",
    overrideReason: "与已审核完整学习单元逐字对齐。",
    reviewStatus: "approved_full_experience",
    ...catalogReview({
      status: "approved_full_experience",
      reviewNotes: "完整单元已复核；夜雨、野径、江船和锦官城构成从郊野到城市的时间推进，成都为文化地理参考，不推断杜甫的精确行程。",
      pinyinOverrides: [
        { path: "line-8.token-2", char: "重", pinyin: "zhòng", reason: "‘花重’写花朵被雨水压得沉重，重读 zhòng，不是层叠义的 chóng。" },
      ],
      spatialLearning: {
        coreRelation: "spring-rain-and-city-river-light",
        observation: "诗从春雨落下的夜晚推进到黑云笼罩的野径与独明江船，再在清晨落到湿润花朵和锦官城。",
        mapAction: "画‘野径—江船—成都城’的远近关系，按夜晚到清晨复述光线变化，不把诗句当成精确降雨记录。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8"],
        childTakeaway: "一场细雨可以同时改变田野、江面和城市花色，时间让同一场雨慢慢显出结果。",
      },
      placeRelations: [
        { targetId: "chengdu", type: "written_at_context", confidence: "high", assertion: "‘锦官城’是成都的文学称呼，诗句把春雨后的城市作为清晨落点。", childMeaning: "从成都的花城背景观察雨后颜色。", sourceKeys: ["chinesePoetry", "chengduGovernment"] },
      ],
      canonicalPlaceIds: ["chengdu"],
    }),
  },
  "chengdu-jueju-two-orioles": {
    title: "绝句（两个黄鹂鸣翠柳）",
    text: "两个黄鹂鸣翠柳，\n一行白鹭上青天。\n窗含西岭千秋雪，\n门泊东吴万里船。",
    author: "杜甫",
    dynasty: "唐",
    overrideReason: "以首句为辨识语，避免与其他‘绝句’混淆。",
    ...catalogReview({
      status: "curated_content_v1",
      reviewNotes: "本批复核正文、逐句学习内容与近远空间链；成都/草堂只作文化区域参照，不把窗门景象还原为杜甫精确站位或万里航线。",
      spatialLearning: {
        coreRelation: "window-door-and-distant-mountains",
        observation: "视线从柳间黄鹂和高空白鹭，推进到窗框里的西岭积雪，再由门边远船打开东吴水路；近处居所与远方山河同在一幅画里。",
        mapAction: "以成都作为现代区域参照，把近景柳树、中景窗门、远景西岭和水路分层理解，不绘未经证实的草堂精确位置或诗人航线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "日常的窗和门，也能把很远的山河带到眼前。",
      },
      placeRelations: [
        { targetId: "chengdu", type: "written_at_context", confidence: "medium", assertion: "作品与杜甫成都草堂时期形成常见文化关联，具体窗门位置不作精确断言。", childMeaning: "把成都居所里的近景和远方山河放在一起观察。", sourceKeys: ["chinesePoetry", "chengduOverview"] },
        { targetId: "xiling-mountain", type: "landscape_mentioned", confidence: "medium_high", assertion: "‘西岭’是诗句中的远山景物，不是成都城内可直接定位的诗人站位。", childMeaning: "窗框把积雪远山收进生活视野。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["chengdu", "xiling-mountain"],
    }),
  },
  "chang-an-chun-wang": {
    title: "春望",
    text: "国破山河在，\n城春草木深。\n感时花溅泪，\n恨别鸟惊心。\n烽火连三月，\n家书抵万金。\n白头搔更短，\n浑欲不胜簪。",
    author: "杜甫",
    dynasty: "唐",
    overrideReason: "与已审核完整学习单元逐字对齐。",
    ...catalogReview({
      status: "curated_content_v1",
      reviewNotes: "本批复核战乱城市、家书与个人处境的逐句解释；长安及渭水仅作历史城市/区域参照，不推断杜甫精确写作位置或战事路线。",
      pinyinOverrides: [
        { path: "line-8.token-3", char: "不", pinyin: "bù", reason: "‘不胜簪’中‘不’表示不能，按词义读 bù；不是受后字影响的轻读变调。" },
      ],
      spatialLearning: {
        coreRelation: "war-damaged-city-and-family-distance",
        observation: "诗从国破而山河仍在、城中草木深写起，经过花鸟触发的伤时与离别，再转到烽火、家书，最后落到白发和簪子。",
        mapAction: "以长安作为历史城市参照，把城中景物、战乱时间和家书去向连成理解链，不绘作者的精确逃难或通信路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8"],
        childTakeaway: "战争不只在地图上，也会进入城市、家庭的等待和一个人的身体感受。",
      },
      placeRelations: [
        { targetId: "chang-an", type: "historical_association", confidence: "medium_high", assertion: "作品通常置于安史之乱中长安陷落的历史语境，具体写作位置不作精确断言。", childMeaning: "从长安城市景物理解时代变化和个人忧愁。", sourceKeys: ["chinesePoetry", "changAnOverview"] },
        { targetId: "wei-river", type: "regional_context", confidence: "medium", assertion: "长安位于关中平原与渭水区域；诗句没有直接写渭水，因此只作区域参照。", childMeaning: "历史城市也有山河和日常生活的底色。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["chang-an"],
    }),
  },
  "chang-an-zi-ye-wu-ge-qiu-ge": {
    title: "子夜吴歌·秋歌",
    text: "长安一片月，\n万户捣衣声。\n秋风吹不尽，\n总是玉关情。\n何日平胡虏，\n良人罢远征。",
    author: "李白",
    dynasty: "唐",
    overrideReason: "与已审核完整学习单元逐字对齐。",
    ...catalogReview({
      status: "curated_content_v1",
      reviewNotes: "本批复核长安月色、捣衣声、玉关意象和远征家庭的逐句关系；玉关作为边关想象参照，不等于李白本人行程或真实通信路线。",
      pinyinOverrides: [
        { path: "line-3.token-4", char: "不", pinyin: "bù", reason: "‘吹不尽’中‘不’表示未能、不能尽，按词义保留 bù 的规范读法。" },
      ],
      spatialLearning: {
        coreRelation: "chang-an-moonlight-and-frontier-distance",
        observation: "月光和万户捣衣声留在长安，秋风把共同的牵挂推向玉关，最后由‘何日’和‘良人’落到盼望征人归来。",
        mapAction: "以长安为眼前城市、玉关为边关方向参照，分清可见的城中声音与诗中想象的远方，不绘李白边关路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6"],
        childTakeaway: "一座城里的声音，也能让人想起很远的亲人和和平。",
      },
      placeRelations: [
        { targetId: "chang-an", type: "mentions_place", confidence: "high", assertion: "首句直接写长安月色，捣衣声把许多家户放进同一座城。", childMeaning: "在同一轮月光下听见城市里许多人的生活。", sourceKeys: ["chinesePoetry", "changAnOverview"] },
        { targetId: "yumen-pass", type: "imagined_frontier", confidence: "medium_high", assertion: "玉关是诗中思念远征亲人的边关意象，不是本单元可验证的个人行程。", childMeaning: "思念从城里的月光伸向很远的边关。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["chang-an", "yumen-pass"],
    }),
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

  "child-furong-lou-song-xin-jian": {
    overrideReason: "第五批内容复核：寒雨送客、洛阳亲友与冰心玉壶的空间和比喻关系已人工确认。",
    ...catalogReview({
      reviewNotes: "芙蓉楼与洛阳分别作为送别场景和远方亲友参照；不把现代位置连线解释为王昌龄此行的完整历史路线。",
      spatialLearning: {
        coreRelation: "sendoff-and-distant-friends",
        observation: "夜雨连江进入吴地，清晨送客望楚山；目光从江边送别转向洛阳亲友，最后落在冰心玉壶的内心比喻。",
        mapAction: "先标芙蓉楼与洛阳两个关系点，用‘眼前送别—远方亲友—内心品格’复述诗境，不画未经证实的行程线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "地图能标出送别与远方的关系，品格比喻要回到诗句理解。",
      },
      placeRelations: [
        { targetId: "furong-lou", type: "departure_place", confidence: "medium", assertion: "诗题直接点出芙蓉楼送辛渐，作为送别场景参照；不把现代楼址当作精确站位。", childMeaning: "诗人在江边楼处送朋友。", sourceKeys: ["chinesePoetry"] },
        { targetId: "luoyang", type: "destination_mentioned", confidence: "high", assertion: "第三句直接写洛阳亲友，是远方关系参照。", childMeaning: "朋友或亲友在洛阳方向，诗人把话送向远方。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["furong-lou", "luoyang"],
    }),
  },

  "child-wang-yue": {
    overrideReason: "第五批内容复核：泰山观察视线、齐鲁空间尺度、阴阳光影与登顶愿望已人工确认；岱、夫、了、眦、凌按诗句语境校正。",
    ...catalogReview({
      reviewNotes: "泰山是题名和诗句的明确参照；齐鲁、阴阳、归鸟用于空间镜头，不把‘一览众山小’当现实地貌测量。",
      pinyinOverrides: [
        { path: "line-1.token-1", char: "岱", pinyin: "dài", reason: "‘岱宗’是泰山尊称，岱读 dài。" },
        { path: "line-1.token-3", char: "夫", pinyin: "fū", reason: "‘夫如何’中的夫为语气词，读 fū。" },
        { path: "line-2.token-5", char: "了", pinyin: "liǎo", reason: "‘未了’意为没有尽头，了读 liǎo。" },
        { path: "line-6.token-2", char: "眦", pinyin: "zì", reason: "‘决眦’中的眦指眼角，读 zì。" },
        { path: "line-7.token-3", char: "凌", pinyin: "líng", reason: "‘凌绝顶’意为登上、越过最高峰，凌读 líng。" },
      ],
      spatialLearning: {
        coreRelation: "mountain-climb-and-changing-horizon",
        observation: "视线从泰山脚下抬向齐鲁山色、阴阳光影、层云和归鸟，最后落到想登绝顶的行动愿望。",
        mapAction: "把泰山作为观察中心，用‘齐鲁远景—山体光影—峰顶视野’表达尺度变化；不将诗句当作精确地形测量。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8"],
        childTakeaway: "换一个高度和视角，能看见更大的范围；愿望还要通过行动靠近。",
      },
      placeRelations: [
        { targetId: "mount-tai", type: "mountain_association", confidence: "high", assertion: "诗题和‘岱宗’直接指向泰山，作为诗境山体参照。", childMeaning: "诗人面对泰山，视线从山脚一路抬到峰顶。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["mount-tai"],
    }),
  },

  "child-ye-yu-ji-bei": {
    overrideReason: "第五批内容复核：巴山夜雨、归期未定与西窗未来团聚的时间关系已人工确认；涨按水位上涨语境读 zhǎng。",
    ...catalogReview({
      reviewNotes: "巴山是诗中夜雨区域参照，西窗是室内未来想象；不把诗句推断成作者精确写作坐标或实际归期。",
      pinyinOverrides: [
        { path: "line-2.token-5", char: "涨", pinyin: "zhǎng", reason: "‘涨秋池’指雨水使池水上涨，涨读 zhǎng。" },
      ],
      spatialLearning: {
        coreRelation: "rain-now-and-homecoming-future",
        observation: "巴山夜雨和秋池构成眼前的旅夜空间，西窗则是未来与家人团聚、回忆今夜的室内空间。",
        mapAction: "以巴山作诗中区域参照，用时间轴连接‘今夜听雨—未来西窗共话’，不画成已确定的返乡路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "同一场雨可以连接现在的牵挂和未来的共同回忆。",
      },
      placeRelations: [
        { targetId: "bashan", type: "cultural_association", confidence: "medium", assertion: "诗句直接写巴山夜雨，作为旅夜雨景的区域参照；不据此断言精确写作地点。", childMeaning: "诗人在巴山一带听雨，想念远方的家人。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["bashan"],
    }),
  },

  "child-wu-yi-xiang": {
    overrideReason: "第五批内容复核：朱雀桥、乌衣巷与王谢旧宅构成的金陵历史城市参照已人工确认；斜、燕按语境校正。",
    ...catalogReview({
      reviewNotes: "朱雀桥、乌衣巷与王谢旧宅构成金陵历史城市参照；燕子带出古今变化，不把诗句当作今天遗址的完整复原。",
      pinyinOverrides: [
        { path: "line-2.token-7", char: "斜", pinyin: "xié", reason: "‘夕阳斜’写夕阳斜照，斜读 xié。" },
        { path: "line-3.token-7", char: "燕", pinyin: "yàn", reason: "‘堂前燕’指燕子，燕读 yàn。" },
      ],
      spatialLearning: {
        coreRelation: "old-city-and-changing-neighborhood",
        observation: "视线从朱雀桥边的野草花移到乌衣巷口的夕阳，再由燕子把王谢旧宅和寻常百姓家连接起来。",
        mapAction: "以金陵旧城作历史城市参照，标出‘桥—巷—旧宅—寻常人家’的观察关系；不把诗句当作遗址复原图。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "景物可能还在，但城市里生活的人和方式会随着时间改变。",
      },
      placeRelations: [
        { targetId: "jinling", type: "historical_city", confidence: "high", assertion: "朱雀桥和乌衣巷是金陵历史城市的直接参照，诗用燕子观察古今变化。", childMeaning: "一座旧城里，桥巷、燕子和住家共同见证时间。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["jinling"],
    }),
  },

  "child-chu-sai": {
    overrideReason: "第五批内容复核：秦汉明月、边关、未归士兵与阴山守护愿望的历史空间关系已人工确认；还、将、教、度按语境校正。",
    ...catalogReview({
      reviewNotes: "诗中秦汉、关塞、阴山构成历史边塞想象；玉门关与阴山为文化地理参照，不把诗句当成具体军情或个人路线。",
      pinyinOverrides: [
        { path: "line-2.token-7", char: "还", pinyin: "huán", reason: "‘人未还’意为人还没有回来，读 huán。" },
        { path: "line-3.token-6", char: "将", pinyin: "jiàng", reason: "‘飞将在’中的将是将领，读 jiàng。" },
        { path: "line-4.token-2", char: "教", pinyin: "jiào", reason: "‘不教’意为不让、不要使，读 jiào。" },
        { path: "line-4.token-5", char: "度", pinyin: "dù", reason: "‘度阴山’意为越过阴山，度读 dù。" },
      ],
      spatialLearning: {
        coreRelation: "frontier-history-and-homecoming",
        observation: "月亮把秦汉历史和眼前关塞连接起来，万里征途落到未归士兵，最后由阴山构成守护边地的愿望边界。",
        mapAction: "用玉门关、阴山作文化地理参照，画‘关塞—远征—守护’关系，不把诗中边塞想象当作个人行军路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "边塞景物承载着等待归来和守护平安的愿望，历史想象要和现代事实区分。",
      },
      placeRelations: [
        { targetId: "yumen-pass", type: "frontier_region", confidence: "medium", assertion: "关塞与长城边地可用玉门关作区域文化参照，但诗句未直接点名玉门关。", childMeaning: "古代边地有许多关塞，玉门关是认识这一空间的参照点。", sourceKeys: ["chinesePoetry"] },
        { targetId: "yinshan", type: "frontier_mountain", confidence: "high", assertion: "末句直接写阴山，是诗中边地山脉参照。", childMeaning: "阴山像边地的山关，承载守护和平的愿望。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["yumen-pass", "yinshan"],
    }),
  },

  "child-du-zuo-jing-ting-shan": {
    overrideReason: "第五批内容复核：群鸟、孤云离去与诗人和敬亭山相看不厌的陪伴关系已人工确认；敬亭山只作诗题地点参照，不推断精确观景位置。",
    ...catalogReview({
      reviewNotes: "题目直接写敬亭山，地图可使用今天的敬亭山作现代山体参照；诗句没有提供诗人具体站位，也不把‘只有’解释成现实地理上只剩一座山。",
      pinyinOverrides: [
        { path: "line-3.token-1", char: "相", pinyin: "xiāng", reason: "‘相看’表示彼此相看，读 xiāng，不是相貌义的 xiàng。" },
      ],
      spatialLearning: {
        coreRelation: "solitary-viewpoint-and-mountain-companionship",
        observation: "鸟和云从天空远去，视线逐渐收束到独坐的诗人与敬亭山；山成为画面中稳定留下的参照。",
        mapAction: "以敬亭山作现代山体参照，先复述‘鸟—云—人—山’的视线收束，不标出未经诗句证明的诗人具体坐标。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "地图能说明山在哪里，诗句则让我们感受一座山怎样成为陪伴。",
      },
      placeRelations: [
        { targetId: "jingting-mountain", type: "mountain_association", confidence: "high", assertion: "题目直接点名敬亭山，是诗境的明确山体参照；不等同于诗人当时的精确观察点。", childMeaning: "鸟云远去后，诗人的目光停在敬亭山上。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["jingting-mountain"],
    }),
  },

  "child-jiang-nan": {
    overrideReason: "第五批内容复核：江南采莲、莲叶茂盛与东南西北方向展开已人工确认；‘间’的语境读音和江南区域边界已明确。",
    ...catalogReview({
      reviewNotes: "‘江南’是诗歌中的宽泛水乡地域和文化称呼，不是现代行政区边界；本诗没有可核定的单一池塘坐标，方向词只用于同一莲塘的观察。",
      pinyinOverrides: [
        { path: "line-3.token-5", char: "间", pinyin: "jiān", reason: "‘莲叶间’表示莲叶之间，读 jiān，不是间隔义的 jiàn。" },
      ],
      spatialLearning: {
        coreRelation: "regional-water-and-directional-lotus-pond",
        observation: "从江南这一宽泛水乡区域进入一片莲塘，先看莲叶，再用东、西、南、北展开鱼儿的活动范围。",
        mapAction: "用示意图画一片莲塘的中心、东、西、南、北，不勾勒江南现代行政边界，也不把诗歌方向直接换成真实坐标。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7"],
        childTakeaway: "方向词能让孩子在一片水面里找到观察顺序，区域名称则需要保留它的宽泛边界。",
      },
    }),
  },

  "child-hui-xiang-ou-shu": {
    overrideReason: "第五批内容复核：少年离家、年老归来、乡音未改与儿童发问的时间关系已人工确认；‘少/衰/相’按诗句语境校正，不据候选地点推断故乡坐标。",
    ...catalogReview({
      reviewNotes: "诗句没有说出具体故乡名称或回乡路线；候选目录中的地点只作待考参考，不升级为地理关系，地图不应把贺知章的故乡或归途画成诗中事实。",
      pinyinOverrides: [
        { path: "line-1.token-1", char: "少", pinyin: "shào", reason: "‘少小’指年少，读 shào，不是数量少的 shǎo。" },
        { path: "line-2.token-7", char: "衰", pinyin: "shuāi", reason: "‘鬓毛衰’写鬓发稀疏衰老，读 shuāi。" },
        { path: "line-3.token-3", char: "相", pinyin: "xiāng", reason: "‘儿童相见’表示彼此见面，读 xiāng，不是相貌义的 xiàng。" },
        { path: "line-3.token-6", char: "相", pinyin: "xiāng", reason: "‘不相识’表示彼此不认识，读 xiāng，不是相貌义的 xiàng。" },
      ],
      spatialLearning: {
        coreRelation: "departure-return-and-recognition",
        observation: "空间从‘离家’拉到‘回乡’，最后缩近到孩子和老人面对面的一问；故乡的地点没有被诗句具体化。",
        mapAction: "可以画‘少年离家—多年后归来—孩子相遇’的时间路线，但不添加未经诗句证明的城市、门牌或实际行程。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "回到原来的地方不一定立刻被认出，时间会改变人的外貌和彼此的关系。",
      },
    }),
  },

  "child-yong-liu": {
    overrideReason: "第五批内容复核：整树—柳条—细叶—春风剪刀的观察层次与比喻关系已人工确认；‘一/绦/似’按语境校正，不虚构具体地理地点。",
    ...catalogReview({
      reviewNotes: "诗只写春日柳树与春风，没有可核定的单一地理地点；柳树的自然生长场景不应被强行关联到某个城市或景区。",
      pinyinOverrides: [
        { path: "line-1.token-5", char: "一", pinyin: "yí", reason: "‘一树’后接去声 shù，连续朗读读 yí，保留普通话变调呈现。" },
        { path: "line-2.token-7", char: "绦", pinyin: "tāo", reason: "‘丝绦’指丝带，绦读 tāo，是需要人工确认的生僻字。" },
        { path: "line-4.token-5", char: "似", pinyin: "sì", reason: "‘似剪刀’表示像剪刀，读 sì，不是相似之外的其他语境。" },
      ],
      spatialLearning: {
        coreRelation: "tree-to-branch-to-leaf-observation",
        observation: "视线从整棵柳树落到万条柳枝，再靠近细叶，最后由春风的方向把想象收回到整片春色。",
        mapAction: "用树冠—枝条—叶片的近距离空间关系学习观察层次，不给柳树场景添加未经诗句证明的城市坐标。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "看自然时先看整体、再看细节，最后可以用一个好比喻说出发现。",
      },
    }),
  },

  "child-chang-ge-xing": {
    overrideReason: "第五批内容复核：春荣—秋衰、百川入海与珍惜年少的时间关系已人工确认；‘朝/晞/华/衰/少’按语境校正，不将百川误标为黄河或具体航线。",
    ...catalogReview({
      reviewNotes: "‘百川东到海’是众多河流和时间流逝的泛化意象，不特指黄河，也不提供诗人具体行程；目录中的候选河流仅作机器辅助提示，不提升为已确认地理关系。",
      pinyinOverrides: [
        { path: "line-2.token-1", char: "朝", pinyin: "zhāo", reason: "‘朝露’指清晨的露水，读 zhāo，不是朝代义的 cháo。" },
        { path: "line-2.token-5", char: "晞", pinyin: "xī", reason: "‘晞’意为晒干、干燥，是‘朝露待日晞’中的生僻字读音。" },
        { path: "line-6.token-3", char: "华", pinyin: "huā", reason: "‘华叶’指花叶，读 huā，不是华丽义的 huá。" },
        { path: "line-6.token-5", char: "衰", pinyin: "shuāi", reason: "‘华叶衰’写花叶衰败，读 shuāi。" },
        { path: "line-9.token-1", char: "少", pinyin: "shào", reason: "‘少壮’指年轻的时候，读 shào，不是数量少的 shǎo。" },
      ],
      spatialLearning: {
        coreRelation: "seasonal-growth-and-river-time-arrow",
        observation: "视线从园中葵花和春光，转到秋叶衰败，再沿百川向东入海，把自然方向变成时间不可回流的比喻。",
        mapAction: "画‘春—秋—河流向海—年少到年老’的关系图；不绘制百川的具体河道，也不把它等同黄河或某条现实航线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8", "line-9", "line-10"],
        childTakeaway: "自然有方向、时间会向前，今天能开始的小行动值得被珍惜。",
      },
    }),
  },

  "child-mei-hua": {
    overrideReason: "第六批内容复核：墙角梅枝、凌寒独开与暗香辨认的观察链已人工确认；数、凌、为按语境校正。",
    ...catalogReview({
      reviewNotes: "诗中是墙角梅花的近距离季节观察，没有可核定的单一地理地点；不把墙角推断为具体园林坐标。",
      pinyinOverrides: [
        { path: "line-1.token-3", char: "数", pinyin: "shù", reason: "‘数枝梅’中的数表示几枝，读 shù。" },
        { path: "line-2.token-1", char: "凌", pinyin: "líng", reason: "‘凌寒’意为面对、顶着寒冷，凌读 líng。" },
        { path: "line-4.token-1", char: "为", pinyin: "wèi", reason: "‘为有暗香来’意为因为有，读 wèi。" },
      ],
      spatialLearning: {
        coreRelation: "winter-corner-and-scent",
        observation: "视线从院墙角落的几枝梅，经过寒风中的独开，转到远处辨认花朵的暗香；空间很小，感官线索很丰富。",
        mapAction: "用‘墙角—梅枝—寒风—飘来的香气’画一张观察小地图，不给梅花附会具体名园地点。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "不显眼的景物也能用颜色和气味留下可靠线索。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-hui-chong-chun-jiang": {
    overrideReason: "第六批内容复核：桃花、鸭子、水暖、江岸植物和河豚上溯的早春观察链已人工确认；蒌、豚按语境校正。",
    ...catalogReview({
      reviewNotes: "诗是一幅江岸早春画面，没有单一地点可核定；春江和河豚上溯是季节与生态关系，不生成虚构路线。",
      pinyinOverrides: [
        { path: "line-3.token-1", char: "蒌", pinyin: "lóu", reason: "‘蒌蒿’是江岸植物，蒌读 lóu。" },
        { path: "line-4.token-4", char: "豚", pinyin: "tún", reason: "‘河豚’中的豚是鱼类名称，读 tún。" },
      ],
      spatialLearning: {
        coreRelation: "riverbank-season-and-animal-sense",
        observation: "竹外桃花位于江岸近景，鸭子在水面先感到水暖，蒌蒿芦芽铺在岸边，河豚沿江上溯，季节线索层层展开。",
        mapAction: "画‘竹林—桃花—春江—江岸植物—河豚上溯’的生态关系图，不把诗境等同一个可考的具体河段。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "植物、动物和水温一起提供春天到来的证据。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-si-shi-tian-yuan": {
    overrideReason: "第六批内容复核：果实、花田、长日篱落与昆虫飞舞的夏日田园镜头已人工确认；蛱按语境校正。",
    ...catalogReview({
      reviewNotes: "诗提供的是乡村田园季节观察，没有可核定的单一地理地点；不把篱落或花田推断成具体村庄。",
      pinyinOverrides: [
        { path: "line-4.token-5", char: "蛱", pinyin: "jiá", reason: "‘蛱蝶’是蝴蝶一类，蛱读 jiá。" },
      ],
      spatialLearning: {
        coreRelation: "summer-field-and-insect-soundscape",
        observation: "近处果实和花田先提供季节颜色，镜头移到篱落和空小路，再由蜻蜓蛱蝶的飞动补足安静田园的生命感。",
        mapAction: "用‘果树—花田—篱落—昆虫’画一张小尺度田园观察图，不虚构诗人的具体行走地点。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "无人经过不等于没有生命，安静能让细小动作更清楚。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-zhu-shi": {
    overrideReason: "第六批内容复核：青山破岩扎根、经受磨击和四面风中的坚韧关系已人工确认；还、劲按语境校正。",
    ...catalogReview({
      reviewNotes: "诗以竹子和岩石构成象征性的山地近景，没有可核定的具体地名；不把青山、破岩当作真实路线。",
      pinyinOverrides: [
        { path: "line-3.token-5", char: "还", pinyin: "hái", reason: "‘还坚劲’意为仍然坚强有力，读 hái。" },
        { path: "line-3.token-7", char: "劲", pinyin: "jìng", reason: "‘坚劲’意为坚强有力，劲读 jìng。" },
      ],
      spatialLearning: {
        coreRelation: "rock-root-and-four-direction-wind",
        observation: "竹根从破岩缝中扎入青山，时间和磨击从各方向施加压力，竹子摇动却不失去根基。",
        mapAction: "用‘青山—破岩—竹根—四方来风’画垂直和方向关系，不把诗句解读为作者的登山路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "坚韧是在变化和压力中守住根基，不等于完全不动。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-shan-po-yang-tong-guan": {
    overrideReason: "第六批内容复核：潼关山河险要、西都历史视线、宫阙兴亡与百姓处境的关系已人工确认；踌、行、兴、亡按语境校正。",
    ...catalogReview({
      reviewNotes: "潼关是诗中明确的关隘参照，西都、秦汉和宫阙属于历史文化视线；不把历史兴亡简化成现代路线，也不把山河壮景遮住百姓处境。",
      pinyinOverrides: [
        { path: "line-2.token-6", char: "踌", pinyin: "chóu", reason: "‘踌躇’表示心情徘徊感慨，踌读 chóu。" },
        { path: "line-3.token-6", char: "行", pinyin: "xíng", reason: "‘经行处’意为经过的地方，行读 xíng。" },
        { path: "line-4.token-1", char: "兴", pinyin: "xīng", reason: "‘兴’与‘亡’相对，指王朝兴起，读 xīng。" },
        { path: "line-4.token-7", char: "亡", pinyin: "wáng", reason: "‘亡’与‘兴’相对，指王朝灭亡，读 wáng。" },
      ],
      spatialLearning: {
        coreRelation: "pass-landscape-history-and-people",
        observation: "潼关山河先形成雄险入口，视线再向西都和秦汉旧地延伸，宫阙化土后落回兴亡中的百姓生活。",
        mapAction: "以潼关作关隘参照，连出‘山河—西都—秦汉遗迹—百姓生活’的历史关系，不把诗句绘成个人行军路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "看历史地图既要看关隘和王朝，也要追问普通人承受了什么。",
      },
      placeRelations: [
        { targetId: "tongguan", type: "mountain_pass", confidence: "high", assertion: "曲题和‘潼关路’直接指向潼关关隘，山河险要是诗境入口。", childMeaning: "山和河围出一条重要的关隘道路。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["tongguan"],
    }),
  },

  "child-mu-jiang-yin": {
    overrideReason: "第八批内容复核：残阳铺江、半江青红、九月初三夜与露月比喻的时间和光色关系已人工确认；似按‘像’的语境校正。",
    ...catalogReview({
      reviewNotes: "诗写江边从夕阳到秋夜的感官观察，没有可核定的单一地理地点；江水是诗境，不应被强行绑定到某条具体河流。",
      pinyinOverrides: [
        { path: "line-2.token-3", char: "瑟", pinyin: "sè", reason: "‘瑟瑟’在此写江水的青绿色，瑟读 sè。" },
        { path: "line-4.token-2", char: "似", pinyin: "sì", reason: "‘露似真珠’表示像珍珠，似读 sì。" },
        { path: "line-4.token-6", char: "似", pinyin: "sì", reason: "‘月似弓’表示像弯弓，似读 sì。" },
      ],
      spatialLearning: {
        coreRelation: "river-sunset-to-autumn-moon",
        observation: "视线从江面上将落的夕阳和青红色水面，转到九月初三的露珠与弯月，时间推进带来感官焦点变化。",
        mapAction: "画‘江面—夕阳—露珠—弯月’的时间观察链，不把江水定位成未经诗句确认的具体河流。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "同一处自然景物会随时间改变颜色和形状，观察要留意光线。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-yuan-ri": {
    overrideReason: "第八批内容复核：爆竹、屠苏、曈曈日和桃符构成的除旧迎新生活场景已人工确认；屠、曈按节日语境校正。",
    ...catalogReview({
      reviewNotes: "诗写古代春节的家庭与街巷习俗，没有可核定的单一地理地点；千门万户是共同生活场景，不是现代行政范围。",
      pinyinOverrides: [
        { path: "line-2.token-6", char: "屠", pinyin: "tú", reason: "‘屠苏’是春节酒名或习俗，屠读 tú。" },
        { path: "line-2.token-7", char: "苏", pinyin: "sū", reason: "‘屠苏’中的苏读 sū，保留专名语境。" },
        { path: "line-3.token-5", char: "曈", pinyin: "tóng", reason: "‘曈曈’写初升太阳明亮，曈读 tóng。" },
        { path: "line-3.token-6", char: "曈", pinyin: "tóng", reason: "‘曈曈’为叠词，第二个曈同样读 tóng。" },
      ],
      spatialLearning: {
        coreRelation: "household-new-year-and-shared-custom",
        observation: "诗从一家的爆竹声和屠苏酒，扩展到千门万户的阳光与桃符，节日空间由屋内、门口延伸到整条街巷。",
        mapAction: "画‘家中—门口—街巷—千家万户’的习俗扩散关系，不把千门万户画成精确地理边界。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "节日文化由许多家庭共同实践，再通过物件和动作传给下一代。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-ma-shi": {
    overrideReason: "第八批内容复核：大漠、燕山月色、金络脑与骏马奔驰的边地空间和志向隐喻已人工确认；燕、似按语境校正。",
    ...catalogReview({
      reviewNotes: "大漠与燕山构成北方边地文化地理参照，金络脑与快走是骏马和志向的诗意想象；不把诗句解释成李贺的个人行军路线。",
      pinyinOverrides: [
        { path: "line-2.token-1", char: "燕", pinyin: "yān", reason: "‘燕山’是北方山脉名称，燕读 yān，不是燕子的 yàn。" },
        { path: "line-2.token-4", char: "似", pinyin: "sì", reason: "‘月似钩’表示像弯钩，似读 sì。" },
      ],
      spatialLearning: {
        coreRelation: "desert-mountain-moon-and-racing-horse",
        observation: "空间从大漠沙地抬到燕山弯月，再从夜景转入想象中的骏马和秋日奔驰，边地的空旷成为行动舞台。",
        mapAction: "以燕山和敦煌作边地文化参照，表达‘大漠—山月—骏马—秋风’的关系；不绘制未经证实的诗人路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "自然景物既能建立空间，也能承载一个人等待机会、施展力量的愿望。",
      },
      placeRelations: [
        { targetId: "yan-mountain", type: "mountain_association", confidence: "high", assertion: "第二句直接写燕山，是边地山脉参照；燕读 yān。", childMeaning: "弯月挂在北方燕山上，构成诗中的夜景。", sourceKeys: ["chinesePoetry"] },
        { targetId: "dunhuang", type: "desert_region", confidence: "medium", assertion: "大漠意象可用敦煌作北方西部沙漠文化参照，诗句未直接点名敦煌。", childMeaning: "大漠是辽阔的沙地空间，不等于某一条已经确认的行军路线。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["yan-mountain", "dunhuang"],
    }),
  },

  "child-guan-shu-you-gan": {
    overrideReason: "第八批内容复核：方塘镜面、天光云影、追问清澈原因与源头活水的学习隐喻已人工确认；渠、那、为按语境校正。",
    ...catalogReview({
      reviewNotes: "诗以方塘和源头活水构成学习与思考的象征性空间，没有可核定的单一地点；不把方塘推断为朱熹的具体居所。",
      pinyinOverrides: [
        { path: "line-1.token-6", char: "鉴", pinyin: "jiàn", reason: "‘一鉴’指一面镜子，鉴读 jiàn。" },
        { path: "line-3.token-2", char: "渠", pinyin: "qú", reason: "‘问渠’指问池水或水体，渠读 qú。" },
        { path: "line-3.token-3", char: "那", pinyin: "nǎ", reason: "‘那得’表示怎么能、从哪里得到，那读 nǎ。" },
        { path: "line-4.token-1", char: "为", pinyin: "wèi", reason: "‘为有源头’表示因为有，读 wèi。" },
      ],
      spatialLearning: {
        coreRelation: "clear-pond-and-living-source",
        observation: "方塘承接天光云影，诗人从池面清澈追问源头；空间从眼前镜面推向看不见但持续流入的源头。",
        mapAction: "画‘源头—活水—方塘—天光云影’的关系图，再把它转译为‘新知识—思考—清楚表达’的学习链。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "保持清楚需要持续接触活水般的新知识，也要主动追问原因。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-su-jiande-jiang": {
    overrideReason: "第八批内容复核：移舟停渚、日暮客愁、旷野低天与清江近月的空间视线已人工确认；泊、渚按语境校正。",
    ...catalogReview({
      reviewNotes: "诗写旅夜江边的小尺度观察，没有可核定的单一地理地点；建德江是诗题参照，但不据此推断孟浩然的完整行程。",
      pinyinOverrides: [
        { path: "line-1.token-3", char: "泊", pinyin: "bó", reason: "‘泊烟渚’意为停船，泊读 bó。" },
        { path: "line-1.token-5", char: "渚", pinyin: "zhǔ", reason: "‘烟渚’指烟雾中的水中小洲，渚读 zhǔ。" },
      ],
      spatialLearning: {
        coreRelation: "moored-boat-and-near-moon",
        observation: "旅舟从移动变为停在烟渚，视线由日暮的客愁拉到旷野低天，再收回清江中的月影和人。",
        mapAction: "画‘舟—烟渚—旷野—树—江月’的由近及远再回收关系，不虚构诗人的具体航行路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "陌生旅途中，开阔的空间和清亮的月色也可以成为安静的陪伴。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-gu-lang-yue-xing": {
    overrideReason: "内容复核：月亮意象、想象推进与儿童可理解的夸张表达已人工确认；不把传说性月宫想象当作天文学事实。",
    ...catalogReview({
      reviewNotes: "《古朗月行》以儿童视角写月亮的形状变化和神话想象，保留无确定地点关系，不把月宫叙事解释为地理事实。",
    }),
  },

  "child-zhu-li-guan": {
    overrideReason: "内容复核：独坐、幽篁、明月和琴声的静谧空间关系已人工确认；不绑定诗人精确隐居地点。",
    ...catalogReview({
      reviewNotes: "《竹里馆》重在竹林独处的声音与光线，地理只保留竹林场景尺度，不把传说性居所当作确证地点。",
    }),
  },

  "child-you-zi-yin": {
    overrideReason: "内容复核：游子出门、慈母缝衣与归期难定的时间情感已人工确认；不推断具体行旅路线。",
    ...catalogReview({
      reviewNotes: "《游子吟》以家庭关系和离别时间为核心，没有可核定的单一地点，保留 unassigned 地理状态。",
    }),
  },

  "child-qian-tang-hu-chun-xing": {
    overrideReason: "第七批内容复核：西湖地标、湖天视线、早春鸟花草与湖东白沙堤的行走关系已人工确认；燕、啄、没、行按语境校正。",
    ...catalogReview({
      reviewNotes: "诗题与景物明确指向钱塘湖（今杭州西湖）一带；地图只呈现现代参考位置和湖边观察关系，不自动等同白居易当日的完整历史路线。",
      pinyinOverrides: [
        { path: "line-4.token-4", char: "燕", pinyin: "yàn", reason: "‘新燕’指燕子，燕读 yàn。" },
        { path: "line-4.token-5", char: "啄", pinyin: "zhuó", reason: "‘啄春泥’指燕子用嘴取泥，啄读 zhuó。" },
        { path: "line-6.token-5", char: "没", pinyin: "mò", reason: "‘没马蹄’意为遮住、淹没马蹄，没读 mò。" },
        { path: "line-7.token-5", char: "行", pinyin: "xíng", reason: "‘行不足’意为行走不够、看不够，行读 xíng。" },
      ],
      spatialLearning: {
        coreRelation: "west-lake-spring-walk",
        observation: "视线从孤山寺、贾亭的湖边地标出发，经过湖面低云、早莺新燕、乱花浅草，最后抵达湖东绿杨阴里的白沙堤。",
        mapAction: "在现代西湖地图上连出‘孤山寺—贾亭—湖东白沙堤’的参考观察链，再用鸟、花、草复述一路春景；不把连线当作已核实的唐代行程。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8", "line-9", "line-10", "line-11", "line-12", "line-13", "line-14", "line-15", "line-16"],
        childTakeaway: "地图先帮我们找到地方，诗句再让地方长出水云、鸟花和脚步的春天。",
      },
      placeRelations: [
        { targetId: "west-lake", type: "depicts_place", confidence: "high", assertion: "钱塘湖是诗题和诗境的直接湖泊参照，现代西湖是其常用对应地点。", childMeaning: "沿着今天西湖一带的湖边参照，理解诗人的早春观察。", sourceKeys: ["chinesePoetry", "westLakeHangzhou"] },
        { targetId: "hangzhou", type: "city_context", confidence: "medium", assertion: "西湖位于杭州；城市关系用于现代地图定位，不推断诗人的精确站位。", childMeaning: "把湖边春景放回杭州的山水城市背景。", sourceKeys: ["westLakeHangzhou"] },
      ],
      canonicalPlaceIds: ["west-lake"],
    }),
  },

  "child-deng-fei-lai-feng": {
    overrideReason: "第七批内容复核：飞来山、千寻塔、鸡鸣日升与浮云最高层的登高视线已人工确认；畏、缘按语境校正。",
    ...catalogReview({
      reviewNotes: "飞来峰（飞来山）与杭州灵隐一带存在常见文化地理对应，但诗句不能单独证明王安石的具体登临路线；地图仅作现代区域参照。",
      pinyinOverrides: [
        { path: "line-3.token-2", char: "畏", pinyin: "wèi", reason: "‘不畏’意为不害怕，畏读 wèi。" },
        { path: "line-4.token-2", char: "缘", pinyin: "yuán", reason: "‘自缘’意为只是因为，缘读 yuán。" },
      ],
      spatialLearning: {
        coreRelation: "mountain-tower-and-wide-view",
        observation: "登山到塔的高处，视线从山体和塔身推向鸡鸣日升，再回到浮云遮眼与最高层的上下关系。",
        mapAction: "以杭州飞来峰（飞来山）作现代区域参照，画出‘山—塔—日升—浮云—高层’的视线关系，不绘制未经证实的历史路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8"],
        childTakeaway: "换到更高、更清楚的位置，才能看见眼前遮挡之外的关系。",
      },
      placeRelations: [
        { targetId: "hangzhou", type: "mountain_association", confidence: "medium", assertion: "飞来峰（飞来山）常与杭州灵隐区域关联，作为现代地域参照，不等同于已证实的诗人路线。", childMeaning: "把登高诗境放进杭州山地文化的现代参照中。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["hangzhou"],
    }),
  },

  "child-chuzhou-xijian": {
    overrideReason: "第十批内容复核：涧边幽草、深树黄鹂、春潮晚雨与无人野渡的空间层次已人工确认；怜、涧、鹂、横按语境校正。",
    ...catalogReview({
      reviewNotes: "滁州西涧是诗题直接提供的水岸参照；诗句写涧、野渡与春潮的局部关系，不据此推断韦应物的完整行程。",
      pinyinOverrides: [
        { path: "line-1.token-2", char: "怜", pinyin: "lián", reason: "‘独怜’意为独自喜爱，怜读 lián。" },
        { path: "line-1.token-5", char: "涧", pinyin: "jiàn", reason: "‘涧边’指山间小水流边，涧读 jiàn。" },
        { path: "line-2.token-4", char: "鹂", pinyin: "lí", reason: "‘黄鹂’是鸟名，鹂读 lí。" },
        { path: "line-4.token-7", char: "横", pinyin: "héng", reason: "‘舟自横’意为小船自然横在水面，横读 héng。" },
      ],
      spatialLearning: {
        coreRelation: "creek-bank-and-empty-ferry",
        observation: "近处是涧边幽草与深树鸟声，远处转入晚来的春潮和雨，最后收束到没有人的野渡与横舟。",
        mapAction: "以滁州西涧作水岸参照，画‘涧边—深树—春潮—野渡—横舟’的观察路径，不绘制未经诗句确认的行程。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "无人处也有草、鸟、潮和船的动作，安静不等于空白。",
      },
      placeRelations: [
        { targetId: "chuzhou", type: "waterway_scene", confidence: "high", assertion: "诗题直接点出滁州西涧，是涧边、野渡和春潮的现代地理参照。", childMeaning: "诗人观察滁州一处水边小涧和渡口。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["chuzhou"],
    }),
  },

  "child-cong-jun-xing": {
    overrideReason: "第九批内容复核：青海雪山、孤城玉门关、黄沙战甲与楼兰誓言的边塞空间已人工确认；长、还按语境校正。",
    ...catalogReview({
      reviewNotes: "诗中青海、玉门关和楼兰构成唐代西北边塞文化地理；玉门关作为现代参考地点，楼兰保留为历史地名与诗中指代，不把诗句绘成将士的已证实路线。",
      pinyinOverrides: [
        { path: "line-1.token-3", char: "长", pinyin: "cháng", reason: "‘长云’指绵延的云层，长读 cháng。" },
        { path: "line-4.token-7", char: "还", pinyin: "huán", reason: "‘终不还’意为最终不回来，还读 huán。" },
      ],
      spatialLearning: {
        coreRelation: "frontier-pass-and-distant-vow",
        observation: "视线从青海、长云和雪山的远景收束到孤城，再指向玉门关；黄沙和磨穿战甲把宏大边塞落到人的经历，楼兰成为誓言的历史指代。",
        mapAction: "以青海、玉门关作西北边塞文化参照，另标出楼兰历史地名；只画‘雪山—孤城—关口—远方’关系，不虚构个人行军路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "地图让我们看见边塞距离，诗句让我们理解守护和回家的愿望。",
      },
      placeRelations: [
        { targetId: "yumen-pass", type: "frontier_pass", confidence: "high", assertion: "‘玉门关’是诗句直接写出的边关地名。", childMeaning: "孤城把目光投向遥远的关口。", sourceKeys: ["chinesePoetry"] },
        { targetId: "loulan", type: "historical_place_reference", confidence: "medium", assertion: "‘楼兰’是诗中直接出现的古代西域地名和边塞历史指代，不等同于现代行政路线。", childMeaning: "誓言把边关任务指向遥远的历史地名。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["yumen-pass"],
    }),
  },

  "child-shan-ju-qiu-ming": {
    overrideReason: "第九批内容复核：雨后秋山、月松泉石、浣女渔舟与可留山居的声景关系已人工确认；浣按语境校正。",
    ...catalogReview({
      reviewNotes: "《山居秋暝》写泛化的山居秋景，没有可核定的单一地理地点；不把王维的诗中山居推断为某个具体景区。",
      pinyinOverrides: [
        { path: "line-5.token-4", char: "浣", pinyin: "huàn", reason: "‘浣女’指洗衣女子，浣读 huàn。" },
      ],
      spatialLearning: {
        coreRelation: "rain-washed-mountain-and-living-soundscape",
        observation: "空间从雨后空山和晚秋天气，推进到松间月光、石上清泉，再由竹林浣女和荷间渔舟引入人的声音与动作。",
        mapAction: "画‘空山—松间—石上—竹林—荷塘’的声景关系，不绑定诗人的历史住址或旅行路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8"],
        childTakeaway: "安静的自然和人的生活声音可以同时存在，构成值得停留的地方。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-jiang-pan-du-bu-xun-hua": {
    overrideReason: "第九批内容复核：成都江畔花路、压枝花朵、流连戏蝶与娇莺声景已人工确认；蹊按语境校正。",
    ...catalogReview({
      reviewNotes: "诗题与作者经历使成都可作为现代区域参照，但黄四娘家不是可核定的具体地址；不把花路绘成杜甫的精确行走轨迹。",
      pinyinOverrides: [
        { path: "line-1.token-7", char: "蹊", pinyin: "qī", reason: "‘花满蹊’中的蹊指小路，按教材常读 qī。" },
      ],
      spatialLearning: {
        coreRelation: "chengdu-riverside-spring-soundscape",
        observation: "江畔小路从黄四娘家花满蹊展开，花枝低垂形成近景，视线再转向戏蝶和娇莺的动作与声音。",
        mapAction: "以成都江畔作现代区域参照，画‘花路—低枝—蝴蝶—黄莺’的观察链；不标出黄四娘家的虚构坐标。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "一个地方的春天既可以用颜色看，也可以用动作和声音听见。",
      },
      placeRelations: [
        { targetId: "chengdu", type: "regional_association", confidence: "medium", assertion: "诗题和杜甫成都时期创作背景可作成都江畔的现代区域参照，不证明黄四娘家的确切位置。", childMeaning: "把花路和鸟声放回成都的江畔春景中。", sourceKeys: ["chinesePoetry", "chengduOverview"] },
      ],
      canonicalPlaceIds: ["chengdu"],
    }),
  },

  "child-jueju-chi-ri": {
    overrideReason: "第九批内容复核：春日江山、花草香、泥融飞燕与暖沙鸳鸯的动静关系已人工确认；燕按语境校正。",
    ...catalogReview({
      reviewNotes: "《绝句·迟日江山丽》写泛化的春日江山与水岸动物，没有可核定的单一地点；不把诗句强行绑定到杜甫某一处行迹。",
      pinyinOverrides: [
        { path: "line-3.token-4", char: "燕", pinyin: "yàn", reason: "‘飞燕子’中的燕指燕子，读 yàn。" },
      ],
      spatialLearning: {
        coreRelation: "spring-riverbank-and-animal-rhythm",
        observation: "视线从江山和春风花草的远景收进泥地、飞燕、暖沙与安睡鸳鸯，动景和静景相互衬托。",
        mapAction: "画‘江山—花草—泥地—沙岸’的春日观察层级，不创建诗人具体站位或路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "春天既有飞翔和香气，也有暖沙上安静休息的生命。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-fu-de-gu-yuan-cao": {
    overrideReason: "第十批内容复核：古原草的荣枯、野火再生、古道荒城与送别情绪的时间空间链已人工确认；尽、侵、萋按语境校正。",
    ...catalogReview({
      reviewNotes: "古原、古道、荒城是诗中的泛化田野与历史景观，不对应一个可核定的单一地名；自然循环与送别关系优先于虚构路线。",
      pinyinOverrides: [
        { path: "line-3.token-5", char: "尽", pinyin: "jìn", reason: "‘烧不尽’意为不能烧光草根和生命力，尽读 jìn。" },
        { path: "line-5.token-3", char: "侵", pinyin: "qīn", reason: "‘侵古道’意为芳草蔓延到古道边，侵读 qīn。" },
        { path: "line-8.token-1", char: "萋", pinyin: "qī", reason: "‘萋萋’形容草木茂盛，萋读 qī。" },
      ],
      spatialLearning: {
        coreRelation: "grass-cycle-and-parting-road",
        observation: "草从古原近景延伸到古道和荒城，春风使它重新生长，朋友沿着被芳草侵近的道路远行。",
        mapAction: "画‘古原—古道—荒城—送别方向’的关系和‘枯—烧—生—荣’时间环，不绑定具体历史路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8"],
        childTakeaway: "自然有再生的时间节奏，人的离别也会被眼前景物保存和表达。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-da-lin-si-taohua": {
    overrideReason: "第十批内容复核：人间与山寺桃花花期错位、寻找春天与意外发现的空间转折已人工确认；尽、盛、觅、转按语境校正。",
    ...catalogReview({
      reviewNotes: "诗只提供人间与山寺的相对高度和花期对照，没有可核定的寺院坐标；不把大林寺桃花误绘成完整登山路线。",
      pinyinOverrides: [
        { path: "line-1.token-7", char: "尽", pinyin: "jìn", reason: "‘芳菲尽’意为花期将尽，尽读 jìn。" },
        { path: "line-2.token-6", char: "盛", pinyin: "shèng", reason: "‘始盛开’意为开始盛放，盛读 shèng。" },
        { path: "line-3.token-6", char: "觅", pinyin: "mì", reason: "‘无觅处’意为寻找不到，觅读 mì。" },
        { path: "line-4.token-3", char: "转", pinyin: "zhuǎn", reason: "‘转入此中’写春色换到山寺，转读 zhuǎn。" },
      ],
      spatialLearning: {
        coreRelation: "human-world-and-mountain-temple-season",
        observation: "人间四月花期将尽，视线向山寺抬高却发现桃花正盛；‘春归’的疑问在另一处空间得到回答。",
        mapAction: "用‘人间—山路—山寺桃花’表示高度与花期差异，不把诗意发现扩写成作者的精确登山轨迹。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "换一个位置和观察角度，可能找到以为已经消失的美好。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-mo-mei": {
    overrideReason: "第十批内容复核：洗砚池梅树、淡墨花痕、拒绝外在夸赞与清气品格的象征关系已人工确认；砚、夸、乾按语境校正。",
    ...catalogReview({
      reviewNotes: "洗砚池和梅树构成诗人的书斋近景，没有可核定的单一地理地点；不把池头树推断为具体名园或历史遗址。",
      pinyinOverrides: [
        { path: "line-1.token-4", char: "砚", pinyin: "yàn", reason: "‘洗砚池’中的砚指写字磨墨的砚台，读 yàn。" },
        { path: "line-3.token-4", char: "夸", pinyin: "kuā", reason: "‘人夸’意为别人夸赞，夸读 kuā。" },
        { path: "line-4.token-6", char: "乾", pinyin: "qián", reason: "‘乾坤’指天地，乾读 qián。" },
        { path: "line-4.token-7", char: "坤", pinyin: "kūn", reason: "‘乾坤’指天地，坤读 kūn。" },
      ],
      spatialLearning: {
        coreRelation: "ink-wash-pool-and-moral-fragrance",
        observation: "梅树从洗砚池边的书斋生活近景展开，墨色花痕转向不求人夸的选择，最后把清气扩展到天地。",
        mapAction: "画‘洗砚池—梅树—花痕—天地清气’的由近及远关系，不附会具体园林坐标。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "外在颜色会被看见，内在清正也值得坚持，不必只靠别人夸奖确认价值。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-guan-canghai": {
    overrideReason: "第十批内容复核：碣石登临、沧海水岛、秋风洪波与日月星汉宇宙想象的空间递进已人工确认；碣、澹、竦、峙、萧、灿、咏按语境校正。",
    ...catalogReview({
      reviewNotes: "碣石是题句直接提供的登临山地参照，海景和宇宙想象从此处展开；不把诗歌的夸张空间当作实测海岸或天文说明。",
      pinyinOverrides: [
        { path: "line-1.token-3", char: "碣", pinyin: "jié", reason: "‘碣石’是山名参照，碣读 jié。" },
        { path: "line-3.token-3", char: "澹", pinyin: "dàn", reason: "‘澹澹’写水波浩荡，澹读 dàn。" },
        { path: "line-3.token-4", char: "澹", pinyin: "dàn", reason: "‘澹澹’为叠词，第二个澹同样读 dàn。" },
        { path: "line-4.token-3", char: "竦", pinyin: "sǒng", reason: "‘竦峙’写山岛高耸，竦读 sǒng。" },
        { path: "line-4.token-4", char: "峙", pinyin: "zhì", reason: "‘竦峙’写山岛直立，峙读 zhì。" },
        { path: "line-7.token-3", char: "萧", pinyin: "xiāo", reason: "‘萧瑟’写秋风吹动草木的声响和气氛，萧读 xiāo。" },
        { path: "line-11.token-3", char: "灿", pinyin: "càn", reason: "‘灿烂’写星光明亮，灿读 càn。" },
        { path: "line-14.token-3", char: "咏", pinyin: "yǒng", reason: "‘咏志’意为歌咏志向，咏读 yǒng。" },
      ],
      spatialLearning: {
        coreRelation: "mountain-coast-to-cosmic-horizon",
        observation: "视线从碣石山上的登临位置落到海水、山岛、树草和洪波，再抬向日月星汉，最后回到诗人的志向。",
        mapAction: "以碣石山作海岸文化地理参照，画‘山—海—岛—浪—天空—星汉’的层级递进，不把夸张想象当作精确天文路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8", "line-9", "line-10", "line-11", "line-12", "line-13", "line-14"],
        childTakeaway: "站在山海之间，视野可以从眼前景物扩展到整个天地，再回到自己的志向。",
      },
      placeRelations: [
        { targetId: "jieshi-mountain", type: "coastal_mountain", confidence: "high", assertion: "‘东临碣石’直接写登临碣石，是观看沧海的地理起点。", childMeaning: "诗人站在碣石山上，从高处看海和天地。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["jieshi-mountain"],
    }),
  },

  "child-wang-hu-lou-zui-shu": {
    overrideReason: "第十二批内容复核：黑云白雨、卷地风和望湖楼雨后水天的天气变化链已人工确认；遮、跳、卷、散按语境校正。",
    ...catalogReview({
      reviewNotes: "望湖楼与西湖是诗题和诗境直接提供的观察参照；诗写一场阵雨的短时变化，不据此推断苏轼完整游踪。",
      pinyinOverrides: [
        { path: "line-1.token-6", char: "遮", pinyin: "zhē", reason: "‘未遮山’意为乌云尚未完全遮住山，遮读 zhē。" },
        { path: "line-2.token-3", char: "跳", pinyin: "tiào", reason: "‘跳珠’写雨点弹跳，跳读 tiào。" },
        { path: "line-3.token-1", char: "卷", pinyin: "juǎn", reason: "‘卷地风’写风势卷过地面和湖面，卷读 juǎn。" },
        { path: "line-3.token-7", char: "散", pinyin: "sàn", reason: "‘吹散’意为云雨散开，散读 sàn。" },
      ],
      spatialLearning: {
        coreRelation: "west-lake-storm-and-clearing",
        observation: "西湖望湖楼下先见乌云压山和白雨入船，风来后云雨迅速散开，最后湖面重新与天空相接。",
        mapAction: "以西湖和望湖楼作观察参照，画‘山—湖—船—风—开阔水天’的天气变化，不扩写成苏轼完整游览路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "把云、雨、风和水面的连续变化连起来，才能读懂阵雨的节奏。",
      },
      placeRelations: [
        { targetId: "west-lake", type: "lake_observation", confidence: "high", assertion: "题目直接写望湖楼，诗中水面和天气观察以西湖为参照。", childMeaning: "诗人在西湖望湖楼附近看一场来得急、去得快的阵雨。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["west-lake"],
    }),
  },

  "child-sai-xia-lulun": {
    overrideReason: "第十二批内容复核：暗月高雁、单于夜遁、轻骑追逐和大雪弓刀的边塞行动关系已人工确认；单、遁、将、骑按语境校正。",
    ...catalogReview({
      reviewNotes: "诗用月黑、雁群、大雪和弓刀构成泛化边塞夜战画面，没有可核定的单一关隘；不把它当作具体军情或个人路线。",
      pinyinOverrides: [
        { path: "line-2.token-1", char: "单", pinyin: "chán", reason: "‘单于’是古代北方首领称号，单读 chán。" },
        { path: "line-2.token-4", char: "遁", pinyin: "dùn", reason: "‘夜遁逃’意为趁夜逃走，遁读 dùn。" },
        { path: "line-3.token-2", char: "将", pinyin: "jiāng", reason: "‘欲将轻骑’意为想要带领骑兵，将读 jiāng。" },
        { path: "line-3.token-4", char: "骑", pinyin: "jì", reason: "‘轻骑’指轻装骑兵，骑读 jì，不是骑马动作的 qí。" },
      ],
      spatialLearning: {
        coreRelation: "frontier-night-pursuit-and-snow",
        observation: "夜色中的雁群和逃敌先在远处出现，轻骑把视线带向追击方向，最后大雪落到弓刀的近景。",
        mapAction: "用‘暗月—雁群—逃遁方向—骑兵—雪中弓刀’表现边塞行动关系，不指定未经诗句确认的关隘坐标。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "困难环境不能代替判断，清楚目标并彼此配合，才能继续行动。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-zao-chun-shui-bu": {
    overrideReason: "第十二批内容复核：长安街雨、远近草色、早春时节和烟柳皇都的比较关系已人工确认；酥、处、胜按语境校正。",
    ...catalogReview({
      reviewNotes: "天街、皇都构成长安城市参照，诗重点在早春雨色和远近观察；不把诗句解释成韩愈的完整城市路线。",
      pinyinOverrides: [
        { path: "line-1.token-7", char: "酥", pinyin: "sū", reason: "‘润如酥’用酥油比喻细雨滋润，酥读 sū。" },
        { path: "line-3.token-7", char: "处", pinyin: "chù", reason: "‘春好处’指美好的时节或景处，处读 chù。" },
        { path: "line-4.token-2", char: "胜", pinyin: "shèng", reason: "‘绝胜’意为远远胜过，胜读 shèng。" },
      ],
      spatialLearning: {
        coreRelation: "chang-an-street-and-early-spring-distance",
        observation: "长安街上的细雨润地，远处草色若有若无，皇都烟柳成为晚春参照；诗用远近和时序观察早春。",
        mapAction: "以长安城作城市参照，画‘天街—远处草色—皇都烟柳’的视线与季节关系，不虚构诗人行走路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "刚发生的细微变化值得慢慢观察，早春的美不一定最浓烈才最好。",
      },
      placeRelations: [
        { targetId: "chang-an", type: "city_observation", confidence: "high", assertion: "‘天街’和‘皇都’直接构成长安城市参照，诗写城中早春观察。", childMeaning: "长安街上的细雨和草色让人发现春天刚刚开始。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["chang-an"],
    }),
  },

  "child-shi-hui-yin": {
    overrideReason: "第十二批内容复核：千锤万凿、烈火、粉骨碎身与清白品格的物我关系已人工确认；凿、焚、浑按语境校正。",
    ...catalogReview({
      reviewNotes: "诗以石灰开采和烧炼过程承载品格象征，没有可核定的单一地点；深山是泛化材料来源，不虚构矿山坐标。",
      pinyinOverrides: [
        { path: "line-1.token-4", char: "凿", pinyin: "záo", reason: "‘千锤万凿’中的凿指开凿，读 záo。" },
        { path: "line-2.token-3", char: "焚", pinyin: "fén", reason: "‘焚烧’意为用火烧炼，焚读 fén。" },
        { path: "line-3.token-5", char: "浑", pinyin: "hún", reason: "‘浑不怕’意为完全不怕，浑读 hún。" },
      ],
      spatialLearning: {
        coreRelation: "mountain-stone-fire-and-clear-integrity",
        observation: "石灰从深山岩石出发，经锤凿、烈火和粉碎，最后把白色清白留在人间；空间过程对应品格选择。",
        mapAction: "画‘深山—开凿—火炉—人间’的材料路径，再把它转译成‘考验—选择—清白’的学习关系，不标具体矿山。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "清白不是没有经历困难，而是在困难和代价面前仍守住原则。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-tian-jing-sha-qiu-si": {
    overrideReason: "第十二批内容复核：枯藤老树、桥水人家、古道瘦马与天涯断肠人的秋日旅途画面已人工确认；藤、瘦、肠、涯按语境校正。",
    ...catalogReview({
      reviewNotes: "散曲提供的是泛化秋日旅途空间，没有可核定的单一地理地点；景物串联表达漂泊心情，不生成虚构路线。",
      pinyinOverrides: [
        { path: "line-1.token-2", char: "藤", pinyin: "téng", reason: "‘枯藤’指枯萎的藤蔓，藤读 téng。" },
        { path: "line-2.token-5", char: "瘦", pinyin: "shòu", reason: "‘瘦马’写旅途劳顿，瘦读 shòu。" },
        { path: "line-3.token-7", char: "肠", pinyin: "cháng", reason: "‘断肠人’是极度悲伤的夸张表达，肠读 cháng。" },
        { path: "line-3.token-11", char: "涯", pinyin: "yá", reason: "‘天涯’指遥远的地方，涯读 yá。" },
      ],
      spatialLearning: {
        coreRelation: "autumn-road-and-distant-home",
        observation: "景物从枯藤老树和小桥流水的近远并置，经过古道西风瘦马，最后在夕阳和天涯旅人处收束为漂泊心情。",
        mapAction: "画‘树藤—桥水人家—古道—瘦马—夕阳—天涯’的旅途镜头，不把散曲虚构成作者实际路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3"],
        childTakeaway: "具体景物可以共同表达没有直接说出的心情，观察顺序会改变阅读感受。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-xiao-er-chui-diao": {
    overrideReason: "第十一批内容复核：儿童垂钓、远处招手与怕惊鱼的安静动作链已人工确认；纶、应按语境校正，不附会具体地点。",
    ...catalogReview({
      reviewNotes: "《小儿垂钓》只提供泛化的水边儿童观察场景，没有可核定的单一地理地点；保留儿童行为和水边尺度，不生成虚构路线。",
      pinyinOverrides: [
        { path: "line-1.token-7", char: "纶", pinyin: "lún", reason: "‘垂纶’指垂下钓线，纶读 lún。" },
        { path: "line-4.token-5", char: "不", pinyin: "bù", reason: "‘不应人’中不后接一声 yìng，按词语本调读 bù。" },
        { path: "line-4.token-6", char: "应", pinyin: "yìng", reason: "‘不应人’意为不回应路人，应读 yìng。" },
      ],
      spatialLearning: {
        coreRelation: "waterside-child-and-quiet-attention",
        observation: "视线从孩子的蓬头、钓线和莓苔近景，移到远处路人，再回到孩子怕惊鱼而保持安静的动作。",
        mapAction: "画‘水边—孩子—钓线—远处路人’的观察关系，不标注诗人或孩子的实际地点。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "地图可以帮助我们安排观察位置，诗句让我们理解一个孩子为什么选择安静。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-xiang-cun-si-yue": {
    overrideReason: "第十一批内容复核：山原河川、子规烟雨与养蚕插田的四月农事顺序已人工确认；了按完成义校正。",
    ...catalogReview({
      reviewNotes: "《乡村四月》是泛化的江南乡村农事与春雨画面，没有可核定的单一地点；不把候选地点扩写成作者行程。",
      pinyinOverrides: [
        { path: "line-4.token-2", char: "了", pinyin: "liǎo", reason: "‘才了蚕桑’意为刚完成养蚕采桑，了读 liǎo。" },
      ],
      spatialLearning: {
        coreRelation: "spring-rural-landscape-and-farm-work",
        observation: "远景从绿山原、白河川和烟雨展开，再收进乡村道路与连续农事，景物和人的动作共同构成四月。",
        mapAction: "画‘山原—河川—村庄—桑蚕—水田’的乡村观察层级，不虚构诗人的精确写作地点。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "春雨让乡村变得清润，季节也安排着人们一项接一项的劳动。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-zeng-liu-jing-wen": {
    overrideReason: "第十一批内容复核：荷尽菊残、傲霜枝与橙黄橘绿的晚秋观察和勉励寓意已人工确认；擎、傲按语境校正。",
    ...catalogReview({
      reviewNotes: "《赠刘景文》以泛化的晚秋池塘和果树为背景，没有可核定的单一地理地点；不将季节景物误写成作者路线。",
      pinyinOverrides: [
        { path: "line-1.token-5", char: "擎", pinyin: "qíng", reason: "‘擎雨盖’意为托起雨水，擎读 qíng。" },
        { path: "line-2.token-5", char: "傲", pinyin: "ào", reason: "‘傲霜枝’写菊枝不怕霜，傲读 ào。" },
      ],
      spatialLearning: {
        coreRelation: "late-autumn-pond-and-fruit-color",
        observation: "视线从荷尽的池面移到霜中的菊枝，再转向橙黄橘绿的果树，写出晚秋由衰到盛的另一种层次。",
        mapAction: "画‘池塘—菊枝—果树’的晚秋观察关系，不标定诗人的具体观景位置。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "同一个季节也有不同阶段，花叶退去之后，枝条和果实仍然可以成为好景。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-qing-ping-le-cun-ju": {
    overrideReason: "第十一批内容复核：溪边茅檐、吴音翁媪、三子分工与小儿剥莲蓬的家庭空间已人工确认；亡、剥及标点后的逐字拼音按语境校正。",
    ...catalogReview({
      reviewNotes: "《清平乐·村居》保留泛化村居家庭空间，不把吴地口音直接等同于作者或词作的精确居所；现代地图不生成虚构坐标。",
      pinyinOverrides: [
        { path: "line-1.token-6", char: "溪", pinyin: "xī", reason: "‘溪上’中的溪读 xī；修正标点后的逐字对齐。" },
        { path: "line-1.token-7", char: "上", pinyin: "shàng", reason: "‘溪上’表示溪水上方或溪边，读 shàng；修正标点后的逐字对齐。" },
        { path: "line-1.token-8", char: "青", pinyin: "qīng", reason: "‘青青草’中青读 qīng；修正标点后的逐字对齐。" },
        { path: "line-1.token-10", char: "草", pinyin: "cǎo", reason: "‘青草’中的草读 cǎo；修正标点后的逐字对齐。" },
        { path: "line-2.token-9", char: "白", pinyin: "bái", reason: "‘白发’中的白读 bái；修正标点后的逐字对齐。" },
        { path: "line-2.token-10", char: "发", pinyin: "fà", reason: "‘白发’指头发，发读 fà；修正标点后的逐字对齐。" },
        { path: "line-2.token-11", char: "谁", pinyin: "shuí", reason: "‘谁家’中的谁读 shuí；修正标点后的逐字对齐。" },
        { path: "line-2.token-12", char: "家", pinyin: "jiā", reason: "‘谁家’中的家读 jiā；修正标点后的逐字对齐。" },
        { path: "line-2.token-13", char: "翁", pinyin: "wēng", reason: "‘翁媪’中的翁读 wēng；修正标点后的逐字对齐。" },
        { path: "line-2.token-14", char: "媪", pinyin: "ǎo", reason: "‘翁媪’中的媪读 ǎo；修正标点后的逐字对齐。" },
        { path: "line-3.token-8", char: "中", pinyin: "zhōng", reason: "‘中儿’指排行居中的儿子，中读 zhōng；修正标点后的逐字对齐。" },
        { path: "line-3.token-9", char: "儿", pinyin: "ér", reason: "‘中儿’中的儿读 ér；修正标点后的逐字对齐。" },
        { path: "line-3.token-10", char: "正", pinyin: "zhèng", reason: "‘正织’表示正在编织，正读 zhèng；修正标点后的逐字对齐。" },
        { path: "line-3.token-11", char: "织", pinyin: "zhī", reason: "‘织鸡笼’中的织读 zhī；修正标点后的逐字对齐。" },
        { path: "line-3.token-12", char: "鸡", pinyin: "jī", reason: "‘鸡笼’中的鸡读 jī；修正标点后的逐字对齐。" },
        { path: "line-3.token-13", char: "笼", pinyin: "lóng", reason: "‘鸡笼’中的笼读 lóng，指笼子；修正标点后的逐字对齐。" },
        { path: "line-4.token-5", char: "亡", pinyin: "wú", reason: "‘亡赖’通‘无赖’，表示顽皮自在，亡读 wú。" },
        { path: "line-4.token-8", char: "溪", pinyin: "xī", reason: "‘溪头’中的溪读 xī；修正标点后的逐字对齐。" },
        { path: "line-4.token-9", char: "头", pinyin: "tóu", reason: "‘溪头’中的头读 tóu；修正标点后的逐字对齐。" },
        { path: "line-4.token-10", char: "卧", pinyin: "wò", reason: "‘卧剥’中的卧读 wò；修正标点后的逐字对齐。" },
        { path: "line-4.token-11", char: "剥", pinyin: "bāo", reason: "‘剥莲蓬’意为剥开，剥读 bāo；修正标点后的逐字对齐。" },
        { path: "line-4.token-12", char: "莲", pinyin: "lián", reason: "‘莲蓬’中的莲读 lián；修正标点后的逐字对齐。" },
        { path: "line-4.token-13", char: "蓬", pinyin: "péng", reason: "‘莲蓬’中的蓬读 péng；修正标点后的逐字对齐。" },
      ],
      spatialLearning: {
        coreRelation: "streamside-family-yard",
        observation: "空间从溪边茅檐和青草展开，经过老人说笑、溪东锄豆和编笼，最后落到溪头小儿剥莲蓬的近景。",
        mapAction: "画‘茅檐—溪水—溪东田地—溪头莲蓬’的家庭生活关系，不把吴音扩写成精确历史居所。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "一家人的位置和动作连在一起，普通的村居也能成为有层次的生活地图。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-wan-chun": {
    overrideReason: "第十一批内容复核：暮春将尽、百花争芳与杨花榆荚飞絮的拟人链已人工确认；斗、解按语境校正。",
    ...catalogReview({
      reviewNotes: "《晚春》写泛化暮春植物景象，没有可核定的单一地点；不把花木的拟人想象当作地理事实。",
      pinyinOverrides: [
        { path: "line-2.token-5", char: "斗", pinyin: "dòu", reason: "‘斗芳菲’意为争相展示芳香和颜色，斗读 dòu。" },
        { path: "line-4.token-2", char: "解", pinyin: "jiě", reason: "‘惟解’意为只会、只懂得，解读 jiě。" },
      ],
      spatialLearning: {
        coreRelation: "late-spring-flower-and-seed-flight",
        observation: "视线先看百花的颜色和芳香，再转向不起眼的杨花、榆荚，最后追踪它们漫天飞散的动作。",
        mapAction: "画‘花枝—杨花—榆荚—空中飞絮’的暮春观察层级，不创建虚构的诗人行走路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "普通植物也会用自己的方式参与季节，观察不只要看最显眼的花。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-shi-zhi-sai-shang": {
    overrideReason: "第十三批内容复核：出使边地、居延历史地名、大漠孤烟、长河落日与候骑燕然的远近空间已人工确认；属、骑按历史语境校正。",
    ...catalogReview({
      reviewNotes: "《使至塞上》直接提供居延、萧关、燕然等历史边塞参照；现代地图只用玉门关作西北边地文化参照，不把出使诗句扩写为已证实的个人军行路线。",
      pinyinOverrides: [
        { path: "line-2.token-1", char: "属", pinyin: "shǔ", reason: "‘属国’是古代官职或使者身份称谓，属读 shǔ。" },
        { path: "line-7.token-5", char: "骑", pinyin: "qí", reason: "‘候骑’指巡察骑兵，骑读 qí。" },
      ],
      spatialLearning: {
        coreRelation: "frontier-mission-and-desert-horizon",
        observation: "视线从使车和历史地名推进到蓬草、归雁、大漠、长河和落日，最后在萧关遇到候骑并指向燕然。",
        mapAction: "以玉门关作西北边地文化参照，画‘使车—居延—大漠—长河—萧关—燕然’的历史空间关系，不画个人出使路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8"],
        childTakeaway: "地名给出边塞尺度，烟、雁、落日和人物行动让辽阔空间变得可以观察。",
      },
      placeRelations: [
        { targetId: "yumen-pass", type: "frontier_region", confidence: "medium", assertion: "居延、萧关、燕然构成历史边塞文化空间，可用玉门关作西北区域参照，不等同于诗中每个地名。", childMeaning: "把大漠、关口和远方长河放回西北边地的尺度。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["yumen-pass"],
    }),
  },

  "child-du-jing-men-song-bie": {
    overrideReason: "第十三批内容复核：荆门入楚、山随平野、江入大荒、月影海楼与故乡水送行的空间推进已人工确认；不把诗意行舟路线当作现代导航。",
    ...catalogReview({
      reviewNotes: "荆门、楚地和长江是诗中远游空间的直接参照；地图可展示现代荆门—长江关系，不推断李白当日的精确航道和停泊点。",
      spatialLearning: {
        coreRelation: "jingmen-river-journey-and-homecoming",
        observation: "船从荆门外进入楚地，山势退远、长江展开，月影和云气把夜景推向水天，最后故乡水回到送行关系。",
        mapAction: "连接荆门与长江作现代地理参照，再用‘山退—江开—月镜—海楼—故乡水’复述诗中观察，不绘制唐代精确航线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8"],
        childTakeaway: "远行让山河不断变换，故乡水又把遥远的路和心里的家连在一起。",
      },
      placeRelations: [
        { targetId: "jingmen", type: "departure_region", confidence: "high", assertion: "荆门直接出现在诗句中，是远游进入楚地的区域参照，不证明诗人精确出发坐标。", childMeaning: "船从荆门山河进入更开阔的水路。", sourceKeys: ["chinesePoetry"] },
        { targetId: "yangtze", type: "river_journey", confidence: "high", assertion: "江水直接构成山随平野、江入大荒和送行舟的水路参照，不等于已核实历史航迹。", childMeaning: "长江把远方和故乡的记忆串起来。", sourceKeys: ["chinesePoetry", "yangtzeNDRC"] },
      ],
      canonicalPlaceIds: ["jingmen", "yangtze"],
    }),
  },

  "child-lang-tao-sha": {
    overrideReason: "第十三批内容复核：黄河曲折沙浪、风簸天涯与银河牵牛织女的现实—想象跃迁已人工确认；簸按语境校正。",
    ...catalogReview({
      reviewNotes: "《浪淘沙》以黄河为现实地理参照，以银河和牵牛织女保留神话想象；不把诗中直上银河解释为真实水路或航天路线。",
      pinyinOverrides: [
        { path: "line-2.token-4", char: "簸", pinyin: "bǒ", reason: "‘风簸’写风吹浪翻、上下颠动，簸读 bǒ。" },
      ],
      spatialLearning: {
        coreRelation: "yellow-river-to-mythic-galaxy",
        observation: "镜头从九曲黄河和万里沙浪开始，经过风簸天涯的远景，再沿诗人的想象向上连接银河与牵牛织女。",
        mapAction: "先定位黄河作为现实参照，再用虚线把黄河的力量延伸到银河神话；明确区分地图事实与诗歌想象。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "想象可以从真实的河流和风浪长出来，但神话空间不等于现实地图。",
      },
      placeRelations: [
        { targetId: "yellow-river", type: "river_imagery", confidence: "high", assertion: "黄河直接出现在首句，是现实山河的核心参照。", childMeaning: "从黄河的曲折和风浪开始读这首诗。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["yellow-river"],
    }),
  },

  "child-yi-jiang-nan": {
    overrideReason: "第十三批内容复核：江南熟景、日出江花、春来江水的红绿对照与反问怀念已人工确认；标点后的逐字拼音和谙、胜按语境校正。",
    ...catalogReview({
      reviewNotes: "《忆江南》写江南区域记忆，不把候选西湖直接当作唯一写作地点；地图只展示江南水乡的现代区域参照，颜色和怀念回到诗句。",
      pinyinOverrides: [
        { path: "line-1.token-5", char: "风", pinyin: "fēng", reason: "‘风景’中的风读 fēng；修正词调标点后的逐字对齐。" },
        { path: "line-1.token-6", char: "景", pinyin: "jǐng", reason: "‘风景’中的景读 jǐng；修正词调标点后的逐字对齐。" },
        { path: "line-1.token-7", char: "旧", pinyin: "jiù", reason: "‘旧曾谙’中的旧读 jiù；修正词调标点后的逐字对齐。" },
        { path: "line-1.token-8", char: "曾", pinyin: "céng", reason: "‘旧曾谙’表示过去曾经熟悉，曾读 céng；修正词调标点后的逐字对齐。" },
        { path: "line-1.token-9", char: "谙", pinyin: "ān", reason: "‘谙’意为熟悉、了解，读 ān；修正词调标点后的逐字对齐。" },
        { path: "line-2.token-9", char: "春", pinyin: "chūn", reason: "‘春来’中的春读 chūn；修正词调标点后的逐字对齐。" },
        { path: "line-2.token-10", char: "来", pinyin: "lái", reason: "‘春来’中的来读 lái；修正词调标点后的逐字对齐。" },
        { path: "line-2.token-11", char: "江", pinyin: "jiāng", reason: "‘江水’中的江读 jiāng；修正词调标点后的逐字对齐。" },
        { path: "line-2.token-12", char: "水", pinyin: "shuǐ", reason: "‘江水’中的水读 shuǐ；修正词调标点后的逐字对齐。" },
        { path: "line-2.token-13", char: "绿", pinyin: "lǜ", reason: "‘江水绿’中的绿读 lǜ；修正词调标点后的逐字对齐。" },
        { path: "line-2.token-14", char: "如", pinyin: "rú", reason: "‘绿如蓝’中的如读 rú；修正词调标点后的逐字对齐。" },
        { path: "line-2.token-15", char: "蓝", pinyin: "lán", reason: "‘蓝’指蓝草颜色，读 lán；修正词调标点后的逐字对齐。" },
      ],
      spatialLearning: {
        coreRelation: "jiangnan-color-and-memory",
        observation: "记忆先从江南总景展开，再收进日出时的江花和春来的江水，最后由颜色回到不能忘怀的地方。",
        mapAction: "以江南水乡作宽泛现代区域参照，不强行绑定西湖或作者精确写作地点；用‘花红—水绿—忆江南’复述颜色与记忆。",
        evidenceLineIds: ["line-1", "line-2", "line-3"],
        childTakeaway: "地图能给一个区域，颜色和记忆才让‘想念一个地方’变得具体。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-guo-gu-ren-zhuang": {
    overrideReason: "第十三批内容复核：鸡黍相邀、村树青山、开轩话桑麻与重阳再访的友情时间链已人工确认；重、还按语境校正。",
    ...catalogReview({
      reviewNotes: "《过故人庄》提供的是泛化乡村朋友家和田园生活，没有可核定的单一地点；不把村居景物扩写为孟浩然的具体行程。",
      pinyinOverrides: [
        { path: "line-8.token-1", char: "还", pinyin: "huán", reason: "‘还来就菊花’表示回来再访，读 huán。" },
      ],
      spatialLearning: {
        coreRelation: "village-home-and-friendship-return",
        observation: "空间从朋友家和鸡黍展开，经村边绿树、郭外青山进入窗前田园，最后由重阳约定把眼前村居延伸到未来。",
        mapAction: "画‘故人家—村边树—郭外山—场圃—重阳菊花’的生活空间，不创建诗人的历史访问路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8"],
        childTakeaway: "友情由一顿家常饭、一次田园聊天和下一次相见的约定组成。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-shui-diao-ge-tou": {
    overrideReason: "第十四批内容复核：中秋饮酒、问月、月宫想象、月圆思亲与千里共婵娟的情绪推进已人工确认；标点后的逐字拼音与不应、胜等语境读音已校正。",
    ...catalogReview({
      reviewNotes: "词的常见创作背景与黄州有关，但诗句本身重点是中秋月夜与思亲祝愿；地图只作文化区域参照，不断言苏轼当晚的精确站位。",
      pinyinOverrides: [
        { path: "line-1.token-6", char: "欢", pinyin: "huān", reason: "修正首句逗号后的逐字拼音对齐。" },
        { path: "line-1.token-7", char: "饮", pinyin: "yǐn", reason: "‘欢饮’指欢乐饮酒，饮读 yǐn。" },
        { path: "line-1.token-8", char: "达", pinyin: "dá", reason: "‘达旦’意为到天亮，达读 dá。" },
        { path: "line-1.token-9", char: "旦", pinyin: "dàn", reason: "‘达旦’的旦指天亮，读 dàn。" },
        { path: "line-1.token-11", char: "大", pinyin: "dà", reason: "‘大醉’的‘大’表示程度深，读 dà。" },
        { path: "line-1.token-12", char: "醉", pinyin: "zuì", reason: "‘大醉’的醉读 zuì。" },
        { path: "line-1.token-14", char: "作", pinyin: "zuò", reason: "‘作此篇’意为写下这篇词，作读 zuò。" },
        { path: "line-1.token-15", char: "此", pinyin: "cǐ", reason: "‘此篇’指这篇词，此读 cǐ。" },
        { path: "line-1.token-16", char: "篇", pinyin: "piān", reason: "‘此篇’的篇读 piān。" },
        { path: "line-1.token-18", char: "兼", pinyin: "jiān", reason: "‘兼怀子由’意为同时思念弟弟，兼读 jiān。" },
        { path: "line-1.token-19", char: "怀", pinyin: "huái", reason: "‘怀’意为思念，读 huái。" },
        { path: "line-1.token-20", char: "子", pinyin: "zǐ", reason: "‘子由’是苏辙的字，子读 zǐ。" },
        { path: "line-1.token-21", char: "由", pinyin: "yóu", reason: "‘子由’专名中的由读 yóu。" },
        { path: "line-2.token-7", char: "把", pinyin: "bǎ", reason: "‘把酒’意为端起酒杯，把读 bǎ。" },
        { path: "line-2.token-8", char: "酒", pinyin: "jiǔ", reason: "‘把酒’的酒读 jiǔ。" },
        { path: "line-2.token-9", char: "问", pinyin: "wèn", reason: "‘问青天’的问读 wèn。" },
        { path: "line-2.token-10", char: "青", pinyin: "qīng", reason: "‘青天’的青读 qīng。" },
        { path: "line-2.token-11", char: "天", pinyin: "tiān", reason: "‘青天’的天读 tiān。" },
        { path: "line-3.token-8", char: "今", pinyin: "jīn", reason: "‘今夕’的今读 jīn。" },
        { path: "line-3.token-9", char: "夕", pinyin: "xī", reason: "‘今夕’的夕读 xī。" },
        { path: "line-3.token-10", char: "是", pinyin: "shì", reason: "‘是何年’的是否义读 shì。" },
        { path: "line-3.token-11", char: "何", pinyin: "hé", reason: "‘何年’的何读 hé。" },
        { path: "line-3.token-12", char: "年", pinyin: "nián", reason: "‘何年’的年读 nián。" },
        { path: "line-4.token-8", char: "又", pinyin: "yòu", reason: "‘又恐’的又读 yòu。" },
        { path: "line-4.token-9", char: "恐", pinyin: "kǒng", reason: "‘又恐’意为又担心，恐读 kǒng。" },
        { path: "line-4.token-10", char: "琼", pinyin: "qióng", reason: "‘琼楼’的琼读 qióng。" },
        { path: "line-4.token-11", char: "楼", pinyin: "lóu", reason: "‘琼楼’的楼读 lóu。" },
        { path: "line-4.token-12", char: "玉", pinyin: "yù", reason: "‘玉宇’的玉读 yù。" },
        { path: "line-4.token-13", char: "宇", pinyin: "yǔ", reason: "‘玉宇’的宇读 yǔ。" },
        { path: "line-4.token-15", char: "高", pinyin: "gāo", reason: "‘高处’的高读 gāo。" },
        { path: "line-4.token-16", char: "处", pinyin: "chù", reason: "‘高处’指高的地方，处读 chù。" },
        { path: "line-4.token-17", char: "不", pinyin: "bù", reason: "‘不胜寒’中不按词语本调标 bù。" },
        { path: "line-4.token-18", char: "胜", pinyin: "shèng", reason: "‘不胜寒’意为承受不了寒冷，胜读 shèng。" },
        { path: "line-4.token-19", char: "寒", pinyin: "hán", reason: "‘不胜寒’的寒读 hán。" },
        { path: "line-5.token-7", char: "何", pinyin: "hé", reason: "‘何似’的何读 hé。" },
        { path: "line-5.token-8", char: "似", pinyin: "sì", reason: "‘何似在人间’意为哪里比得上，似读 sì。" },
        { path: "line-5.token-9", char: "在", pinyin: "zài", reason: "‘在人间’的在读 zài。" },
        { path: "line-5.token-10", char: "人", pinyin: "rén", reason: "‘人间’的人读 rén。" },
        { path: "line-5.token-11", char: "间", pinyin: "jiān", reason: "‘人间’的间指世间，读 jiān。" },
        { path: "line-6.token-5", char: "低", pinyin: "dī", reason: "‘低绮户’的低读 dī。" },
        { path: "line-6.token-6", char: "绮", pinyin: "qǐ", reason: "‘绮户’指有花纹的窗户，绮读 qǐ。" },
        { path: "line-6.token-7", char: "户", pinyin: "hù", reason: "‘绮户’的户读 hù。" },
        { path: "line-6.token-9", char: "照", pinyin: "zhào", reason: "‘照无眠’的照读 zhào。" },
        { path: "line-6.token-10", char: "无", pinyin: "wú", reason: "‘无眠’意为睡不着，无读 wú。" },
        { path: "line-6.token-11", char: "眠", pinyin: "mián", reason: "‘无眠’的眠读 mián。" },
        { path: "line-7.token-1", char: "不", pinyin: "bù", reason: "‘不应有恨’意为不应该有怨恨，不按自动连续变调标 bù。" },
        { path: "line-7.token-2", char: "应", pinyin: "yīng", reason: "‘不应有恨’中的应是应该，读 yīng。" },
        { path: "line-7.token-6", char: "何", pinyin: "hé", reason: "‘何事’的何读 hé。" },
        { path: "line-7.token-7", char: "事", pinyin: "shì", reason: "‘何事’的事读 shì。" },
        { path: "line-7.token-8", char: "长", pinyin: "cháng", reason: "‘长向’意为总是、常常，长读 cháng。" },
        { path: "line-7.token-9", char: "向", pinyin: "xiàng", reason: "‘长向别时圆’的向读 xiàng。" },
        { path: "line-7.token-10", char: "别", pinyin: "bié", reason: "‘别时’指离别时，别读 bié。" },
        { path: "line-7.token-11", char: "时", pinyin: "shí", reason: "‘别时’的时读 shí。" },
        { path: "line-7.token-12", char: "圆", pinyin: "yuán", reason: "‘月圆’的圆读 yuán。" },
        { path: "line-8.token-8", char: "月", pinyin: "yuè", reason: "‘月有阴晴’的月读 yuè。" },
        { path: "line-8.token-9", char: "有", pinyin: "yǒu", reason: "‘月有’的有读 yǒu。" },
        { path: "line-8.token-10", char: "阴", pinyin: "yīn", reason: "‘阴晴’的阴读 yīn。" },
        { path: "line-8.token-11", char: "晴", pinyin: "qíng", reason: "‘阴晴’的晴读 qíng。" },
        { path: "line-8.token-12", char: "圆", pinyin: "yuán", reason: "‘圆缺’的圆读 yuán。" },
        { path: "line-8.token-13", char: "缺", pinyin: "quē", reason: "‘圆缺’的缺读 quē。" },
        { path: "line-8.token-15", char: "此", pinyin: "cǐ", reason: "‘此事’的此读 cǐ。" },
        { path: "line-8.token-16", char: "事", pinyin: "shì", reason: "‘此事’的事读 shì。" },
        { path: "line-8.token-17", char: "古", pinyin: "gǔ", reason: "‘古难全’的古读 gǔ。" },
        { path: "line-8.token-18", char: "难", pinyin: "nán", reason: "‘难全’意为难以完全，难读 nán。" },
        { path: "line-8.token-19", char: "全", pinyin: "quán", reason: "‘难全’的全读 quán。" },
        { path: "line-9.token-7", char: "千", pinyin: "qiān", reason: "‘千里’的千读 qiān。" },
        { path: "line-9.token-8", char: "里", pinyin: "lǐ", reason: "‘千里’的里读 lǐ。" },
        { path: "line-9.token-9", char: "共", pinyin: "gòng", reason: "‘共婵娟’意为共同分享，共读 gòng。" },
        { path: "line-9.token-10", char: "婵", pinyin: "chán", reason: "‘婵娟’的婵读 chán。" },
        { path: "line-9.token-11", char: "娟", pinyin: "juān", reason: "‘婵娟’指美好的月亮，娟读 juān。" },
      ],
      spatialLearning: {
        coreRelation: "moonlight-distance-and-family",
        observation: "词从中秋夜的酒杯和明月展开，经过月宫想象、朱阁绮户和无眠，再由月圆月缺回到相隔千里的亲人。",
        mapAction: "以黄州作常见创作背景的文化区域参考，用‘眼前月色—想象月宫—千里共月’复述距离关系；不画苏轼当晚的精确站位或行程。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8", "line-9"],
        childTakeaway: "地图可以说明亲人相隔很远，月光和祝愿让远方的人仍然共享同一个夜晚。",
      },
      placeRelations: [
        { targetId: "huangzhou", type: "historical_association", confidence: "medium", assertion: "常见创作背景将此词与黄州中秋相联系；诗句本身不证明当晚的精确地点。", childMeaning: "把月夜和思亲放回苏轼生活过的黄州区域参照中。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["huangzhou"],
    }),
  },

  "child-wen-guan-jun-shou-he-nan-he-bei": {
    overrideReason: "第十四批内容复核：捷报、喜泪、家人、歌酒和巴峡—巫峡—襄阳—洛阳归乡想象已人工确认；卷、还及标点后的逐字拼音已校正。",
    ...catalogReview({
      reviewNotes: "诗中明确出现河南河北、巴峡、巫峡、襄阳、洛阳等归乡方向；地图只帮助理解水路与目的地，不把想象中的归途当作杜甫已完成的精确航线。",
      pinyinOverrides: [
        { path: "line-4.token-2", char: "卷", pinyin: "juǎn", reason: "‘漫卷诗书’意为随手卷起诗书，卷读 juǎn。" },
        { path: "line-6.token-6", char: "还", pinyin: "huán", reason: "‘好还乡’意为返回故乡，还读 huán。" },
      ],
      spatialLearning: {
        coreRelation: "victory-news-and-homecoming-river-route",
        observation: "捷报从河南河北传到蜀地，诗人由家人和歌酒的近景跳到巴峡、巫峡、襄阳，最后把视线落到洛阳。",
        mapAction: "标出蜀地听报、峡江归途和洛阳目的方向，使用‘想象中的归乡路线’标签，不绘制已证实的杜甫个人航迹。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8"],
        childTakeaway: "好消息让远方变成有方向的归途，地点越具体，诗人的希望越有形。",
      },
      placeRelations: [
        { targetId: "luoyang", type: "destination_mentioned", confidence: "high", assertion: "末句直接写洛阳，是诗中归乡目的方向。", childMeaning: "诗人的喜悦最后指向故乡洛阳。", sourceKeys: ["chinesePoetry"] },
        { targetId: "baidi-city", type: "river_route_reference", confidence: "medium", assertion: "峡江地名为归乡想象提供三峡水路尺度；不据此断言诗人在此刻已到白帝城或完成航行。", childMeaning: "山峡把归乡想象串成一条水路。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["luoyang", "baidi-city"],
    }),
  },

  "child-shu-hu-yin-xian-sheng-bi": {
    overrideReason: "第十四批内容复核：茅檐、花畦、水护田、两山送青的庭院—山水关系已人工确认；一水的连续朗读和排闼语境已校正。",
    ...catalogReview({
      reviewNotes: "诗写湖阴先生家周围的泛化田园空间；候选中的西湖不等于诗句已证明的精确地点，暂不绑定现代景点坐标。",
      pinyinOverrides: [
        { path: "line-3.token-1", char: "一", pinyin: "yì", reason: "‘一水’后接第三声，按连续朗读呈现 yì。" },
      ],
      spatialLearning: {
        coreRelation: "courtyard-fields-and-mountain-green",
        observation: "空间从常扫的茅檐和亲手栽种的花畦展开，经过水护田，再由两山把青色送到门前。",
        mapAction: "画‘屋檐—花畦—水田—远山—门’的关系，不把湖阴先生的住处绑定为西湖或某个现代坐标。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "人的日常劳动和自然景物彼此照应，小院也能连接到开阔山水。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-dong-ye-du-shu": {
    overrideReason: "第十四批内容复核：无遗力、少壮工夫、纸上觉浅与躬行实践的学习论证已人工确认；少壮的少按语境读 shào。",
    ...catalogReview({
      reviewNotes: "《冬夜读书示子聿》重点是学习与实践的关系，冬夜是时间氛围而非可核定地点；不为诗歌虚构地理路线。",
      pinyinOverrides: [
        { path: "line-2.token-1", char: "少", pinyin: "shào", reason: "‘少壮’指年轻时期，少读 shào。" },
      ],
      spatialLearning: {
        coreRelation: "winter-study-and-practice",
        observation: "空间由冬夜灯下的读书近景展开，随后从纸上知识转向真实生活的实践场，重点是学习路径而非地理迁移。",
        mapAction: "用‘书桌—书本—真实行动’的认知空间代替虚构地图地点，强调诗句如何把知道推进到做到。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "读书给出方向，亲自实践让知识真正变成自己的能力。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-nan-xiang-zi-beigu": {
    overrideReason: "第十四批内容复核：北固楼、长江、千古兴亡与孙权英雄担当的登楼视线已人工确认；年少、标点后的逐字拼音按语境校正。",
    ...catalogReview({
      reviewNotes: "京口北固亭、长江和孙权典故构成历史地理参照；现代地图用于理解江山尺度，不把词中的历史想象还原成辛弃疾的精确行程。",
      pinyinOverrides: [
        { path: "line-1.token-7", char: "满", pinyin: "mǎn", reason: "问号后的‘满眼’按词语逐字对齐，满读 mǎn。" },
        { path: "line-1.token-8", char: "眼", pinyin: "yǎn", reason: "‘满眼’的眼读 yǎn。" },
        { path: "line-1.token-9", char: "风", pinyin: "fēng", reason: "‘风光’的风读 fēng。" },
        { path: "line-1.token-10", char: "光", pinyin: "guāng", reason: "‘风光’的光读 guāng。" },
        { path: "line-1.token-11", char: "北", pinyin: "běi", reason: "‘北固楼’的北读 běi。" },
        { path: "line-1.token-12", char: "固", pinyin: "gù", reason: "‘北固楼’的固读 gù。" },
        { path: "line-1.token-13", char: "楼", pinyin: "lóu", reason: "‘北固楼’的楼读 lóu。" },
        { path: "line-2.token-9", char: "悠", pinyin: "yōu", reason: "问号后的‘悠悠’按词语逐字对齐，悠读 yōu。" },
        { path: "line-4.token-2", char: "少", pinyin: "shào", reason: "‘年少’指年轻，少读 shào。" },
        { path: "line-4.token-7", char: "坐", pinyin: "zuò", reason: "逗号后的‘坐断’意为牢牢守住，坐读 zuò。" },
        { path: "line-4.token-8", char: "断", pinyin: "duàn", reason: "‘坐断’的断读 duàn。" },
        { path: "line-4.token-9", char: "东", pinyin: "dōng", reason: "‘东南’的东读 dōng。" },
        { path: "line-4.token-10", char: "南", pinyin: "nán", reason: "‘东南’的南读 nán。" },
        { path: "line-4.token-11", char: "战", pinyin: "zhàn", reason: "‘战未休’的战读 zhàn。" },
        { path: "line-4.token-12", char: "未", pinyin: "wèi", reason: "‘未休’的未读 wèi。" },
        { path: "line-4.token-13", char: "休", pinyin: "xiū", reason: "‘战未休’意为战争没有停止，休读 xiū。" },
        { path: "line-5.token-9", char: "曹", pinyin: "cáo", reason: "问号后的‘曹刘’按历史人物专名对齐，曹读 cáo。" },
        { path: "line-5.token-10", char: "刘", pinyin: "liú", reason: "‘曹刘’中的刘读 liú。" },
      ],
      spatialLearning: {
        coreRelation: "tower-river-history-and-heroic-memory",
        observation: "视线从北固楼的江山风光拉到长江滚流和千古兴亡，最后落到孙权与曹刘的历史人物比较。",
        mapAction: "以京口北固亭和长江作现代历史地理参照，用‘楼—江—历史人物’复述空间与时间尺度，不绘制辛弃疾的具体登临路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6"],
        childTakeaway: "登高改变视野，江流把眼前山河和久远历史连接起来；英雄的担当仍要回到人物选择理解。",
      },
      placeRelations: [
        { targetId: "jinling", type: "historical_city", confidence: "medium", assertion: "京口北固亭属于镇江一带的历史城市参照，可与金陵区域关系一起帮助理解东南江山，不等同词中精确站位。", childMeaning: "北固楼在东南江山中打开远望视线。", sourceKeys: ["chinesePoetry"] },
        { targetId: "yangtze", type: "river_imagery", confidence: "high", assertion: "长江直接出现在词句中，是登楼观察和历史思考的水流参照。", childMeaning: "长江滚滚流，把眼前的江山带向远方和古今。", sourceKeys: ["chinesePoetry", "yangtzeNDRC"] },
      ],
      canonicalPlaceIds: ["jinling", "yangtze"],
    }),
  },

  "child-huan-xi-sha-qishui": {
    overrideReason: "下一批内容复核：蕲水清泉寺、兰溪、暮雨子规与西流流水的空间和人生旷达关系已人工确认；标点后的逐字拼音及再少、休将按语境校正。",
    ...catalogReview({
      reviewNotes: "蕲水、清泉寺和兰溪是词中明确的游览参照；地图只表达寺、溪、山的相对关系，不把西流流水解释成作者完整行程。",
      pinyinOverrides: [
        { path: "line-1.token-8", char: "寺", pinyin: "sì", reason: "第二个‘寺’在‘寺临兰溪’中仍读 sì。" },
        { path: "line-1.token-9", char: "临", pinyin: "lín", reason: "‘寺临兰溪’意为寺院临近兰溪，临读 lín。" },
        { path: "line-1.token-10", char: "兰", pinyin: "lán", reason: "‘兰溪’的兰读 lán。" },
        { path: "line-1.token-11", char: "溪", pinyin: "xī", reason: "‘兰溪’的溪读 xī。" },
        { path: "line-1.token-14", char: "水", pinyin: "shuǐ", reason: "‘溪水’的水读 shuǐ。" },
        { path: "line-1.token-16", char: "流", pinyin: "liú", reason: "‘西流’意为向西流，流读 liú。" },
        { path: "line-2.token-7", char: "松", pinyin: "sōng", reason: "逗号后的‘松间’按逐字对齐，松读 sōng。" },
        { path: "line-2.token-8", char: "间", pinyin: "jiān", reason: "‘松间’指松树之间，间读 jiān。" },
        { path: "line-2.token-9", char: "沙", pinyin: "shā", reason: "‘沙路’的沙读 shā。" },
        { path: "line-2.token-10", char: "路", pinyin: "lù", reason: "‘沙路’的路读 lù。" },
        { path: "line-2.token-11", char: "净", pinyin: "jìng", reason: "‘净无泥’意为干净没有泥，净读 jìng。" },
        { path: "line-2.token-12", char: "无", pinyin: "wú", reason: "‘无泥’的无读 wú。" },
        { path: "line-2.token-13", char: "泥", pinyin: "ní", reason: "‘无泥’的泥读 ní。" },
        { path: "line-4.token-9", char: "门", pinyin: "mén", reason: "问号后的‘门前’按逐字对齐，门读 mén。" },
        { path: "line-4.token-10", char: "前", pinyin: "qián", reason: "‘门前’的前读 qián。" },
        { path: "line-4.token-11", char: "流", pinyin: "liú", reason: "‘流水’的流读 liú。" },
        { path: "line-4.token-12", char: "水", pinyin: "shuǐ", reason: "‘流水’的水读 shuǐ。" },
        { path: "line-4.token-7", char: "少", pinyin: "shào", reason: "‘再少’意为重新恢复青春，少读 shào，不是‘多少’的 shǎo。" },
        { path: "line-4.token-13", char: "尚", pinyin: "shàng", reason: "‘尚能西’意为还能够向西，尚读 shàng。" },
        { path: "line-4.token-14", char: "能", pinyin: "néng", reason: "‘尚能西’的能读 néng。" },
        { path: "line-4.token-15", char: "西", pinyin: "xī", reason: "‘向西流’的西读 xī。" },
        { path: "line-4.token-17", char: "休", pinyin: "xiū", reason: "感叹号后的‘休将’意为不要，休读 xiū。" },
        { path: "line-4.token-18", char: "将", pinyin: "jiāng", reason: "‘休将白发’意为不要把，表示将要/把的语法义，读 jiāng。" },
        { path: "line-4.token-19", char: "白", pinyin: "bái", reason: "‘白发’的白读 bái。" },
        { path: "line-4.token-20", char: "发", pinyin: "fà", reason: "‘白发’指头发，发读 fà。" },
        { path: "line-4.token-21", char: "唱", pinyin: "chàng", reason: "‘唱黄鸡’的唱读 chàng。" },
        { path: "line-4.token-22", char: "黄", pinyin: "huáng", reason: "‘黄鸡’的黄读 huáng。" },
        { path: "line-4.token-23", char: "鸡", pinyin: "jī", reason: "‘黄鸡’的鸡读 jī。" },
      ],
      spatialLearning: {
        coreRelation: "temple-stream-and-renewed-vitality",
        observation: "空间从清泉寺和兰溪展开，经过山下兰芽、松间沙路与暮雨子规，最后回到门前向西流的溪水和对人生的反问。",
        mapAction: "标出蕲水—清泉寺—兰溪的相对关系，再用‘山下—松间—门前’复述视线，不把词中的水流延伸为作者完整游踪。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "自然景物不只是背景，也可以给人重新开始的勇气。",
      },
      placeRelations: [
        { targetId: "qishui", type: "visit_place", confidence: "high", assertion: "词题和首句直接写游蕲水清泉寺，蕲水是游览区域参照。", childMeaning: "寺院和溪流是这次观察的起点。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["qishui"],
    }),
  },

  "child-bu-suan-zi-yong-mei-legacy": {
    overrideReason: "下一批内容复核：驿外断桥、黄昏风雨、不争群芳与香如故的梅花品格链已人工确认；著、任及标点后的逐字拼音按语境校正。",
    ...catalogReview({
      reviewNotes: "词写驿外断桥边的泛化梅花处境，没有可核定的单一地点；不为梅花景物虚构作者行程或园林坐标。",
      pinyinOverrides: [
        { path: "line-1.token-7", char: "寂", pinyin: "jì", reason: "逗号后的‘寂寞’按逐字对齐，寂读 jì。" },
        { path: "line-1.token-8", char: "寞", pinyin: "mò", reason: "‘寂寞’的寞读 mò。" },
        { path: "line-1.token-9", char: "开", pinyin: "kāi", reason: "‘开无主’的开读 kāi。" },
        { path: "line-1.token-10", char: "无", pinyin: "wú", reason: "‘无主’的无读 wú。" },
        { path: "line-1.token-11", char: "主", pinyin: "zhǔ", reason: "‘无主’意为无人照料，主读 zhǔ。" },
        { path: "line-2.token-9", char: "更", pinyin: "gèng", reason: "‘更著风和雨’意为又受到，‘更’读 gèng。" },
        { path: "line-2.token-10", char: "著", pinyin: "zhuó", reason: "‘更著风和雨’意为受到、遭受，著读 zhuó。" },
        { path: "line-2.token-11", char: "风", pinyin: "fēng", reason: "‘风和雨’的风读 fēng。" },
        { path: "line-2.token-12", char: "和", pinyin: "hé", reason: "‘风和雨’中的和意为与，读 hé。" },
        { path: "line-2.token-13", char: "雨", pinyin: "yǔ", reason: "‘风和雨’的雨读 yǔ。" },
        { path: "line-3.token-7", char: "一", pinyin: "yī", reason: "‘一任’意为任凭，一读 yī。" },
        { path: "line-3.token-8", char: "任", pinyin: "rèn", reason: "‘一任群芳妒’意为任凭，任读 rèn。" },
        { path: "line-3.token-9", char: "群", pinyin: "qún", reason: "‘群芳’指百花，群读 qún。" },
        { path: "line-3.token-10", char: "芳", pinyin: "fāng", reason: "‘群芳’的芳读 fāng。" },
        { path: "line-3.token-11", char: "妒", pinyin: "dù", reason: "‘群芳妒’的妒读 dù。" },
        { path: "line-4.token-9", char: "只", pinyin: "zhǐ", reason: "逗号后的‘只有’按逐字对齐，只读 zhǐ。" },
        { path: "line-4.token-10", char: "有", pinyin: "yǒu", reason: "‘只有’的有读 yǒu。" },
        { path: "line-4.token-11", char: "香", pinyin: "xiāng", reason: "‘香如故’的香读 xiāng。" },
        { path: "line-4.token-12", char: "如", pinyin: "rú", reason: "‘香如故’的如读 rú。" },
        { path: "line-4.token-13", char: "故", pinyin: "gù", reason: "‘香如故’意为香气如从前，故读 gù。" },
      ],
      spatialLearning: {
        coreRelation: "isolated-mei-and-inner-fragrance",
        observation: "梅花从驿外断桥边的孤独近景展开，经过黄昏风雨和群芳对照，最后在泥尘中留下不变的清香。",
        mapAction: "用‘驿外—断桥—风雨—泥土’表示梅花的环境变化，不把词中梅花绑定到一个可核定的现代地点。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "外在处境会变化，真正想守住的品格可以不随环境改变。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-you-shan-xi-cun-legacy": {
    overrideReason: "下一批内容复核：农家待客、山重水复、柳暗花明、春社古风与月下叩门的乡村生活空间已人工确认；重按层叠义校正。",
    ...catalogReview({
      reviewNotes: "《游山西村》写泛化乡村游历和人情，不把‘山西村’自动等同今天的山西省，也不生成陆游的精确行程。",
      pinyinOverrides: [
        { path: "line-3.token-2", char: "重", pinyin: "chóng", reason: "‘山重水复’写山岭一层又一层，重读 chóng。" },
      ],
      spatialLearning: {
        coreRelation: "village-hospitality-and-turning-road",
        observation: "空间从农家饭桌和腊酒展开，沿重山回水的道路转入柳暗花明的村庄，再延伸到春社、田园和未来月下叩门。",
        mapAction: "画‘农家—山路—新村—春社—田园—村门’的生活空间，不把诗句还原成作者已核实的现代路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8"],
        childTakeaway: "人情让陌生道路变得温暖，转过一个弯也可能遇见新的希望。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-xi-jiang-yue-huang-sha-legacy": {
    overrideReason: "下一批内容复核：黄沙道夏夜的月、鹊、蝉、稻花、蛙声、星雨和转桥见店的感官顺序已人工确认；一片变调与忽见读音已校正。",
    ...catalogReview({
      reviewNotes: "词写泛化的夏夜乡村行路空间，没有可核定的单一地理地点；黄沙道、社林和茅店用于镜头关系，不虚构辛弃疾的具体路线。",
      pinyinOverrides: [
        { path: "line-1.token-8", char: "清", pinyin: "qīng", reason: "逗号后的‘清风’按逐字对齐，清读 qīng。" },
        { path: "line-1.token-9", char: "风", pinyin: "fēng", reason: "‘清风’的风读 fēng。" },
        { path: "line-1.token-10", char: "半", pinyin: "bàn", reason: "‘半夜’的半读 bàn。" },
        { path: "line-1.token-11", char: "夜", pinyin: "yè", reason: "‘半夜’的夜读 yè。" },
        { path: "line-1.token-12", char: "鸣", pinyin: "míng", reason: "‘鸣蝉’的鸣读 míng。" },
        { path: "line-1.token-13", char: "蝉", pinyin: "chán", reason: "‘鸣蝉’的蝉读 chán。" },
        { path: "line-2.token-9", char: "听", pinyin: "tīng", reason: "逗号后的‘听取’按逐字对齐，听读 tīng。" },
        { path: "line-2.token-10", char: "取", pinyin: "qǔ", reason: "‘听取蛙声’的取读 qǔ。" },
        { path: "line-2.token-11", char: "蛙", pinyin: "wā", reason: "‘蛙声’的蛙读 wā。" },
        { path: "line-2.token-12", char: "声", pinyin: "shēng", reason: "‘蛙声’的声读 shēng。" },
        { path: "line-2.token-13", char: "一", pinyin: "yí", reason: "‘一片’后接去声，连续朗读读 yí。" },
        { path: "line-2.token-14", char: "片", pinyin: "piàn", reason: "‘一片’的片读 piàn。" },
        { path: "line-3.token-8", char: "两", pinyin: "liǎng", reason: "逗号后的‘两三点’按逐字对齐，两读 liǎng。" },
        { path: "line-3.token-9", char: "三", pinyin: "sān", reason: "‘两三’的三读 sān。" },
        { path: "line-3.token-10", char: "点", pinyin: "diǎn", reason: "‘两三点’的点读 diǎn。" },
        { path: "line-3.token-11", char: "雨", pinyin: "yǔ", reason: "‘点雨’的雨读 yǔ。" },
        { path: "line-3.token-12", char: "山", pinyin: "shān", reason: "‘山前’的山读 shān。" },
        { path: "line-3.token-13", char: "前", pinyin: "qián", reason: "‘山前’的前读 qián。" },
        { path: "line-4.token-9", char: "路", pinyin: "lù", reason: "逗号后的‘路转’按逐字对齐，路读 lù。" },
        { path: "line-4.token-10", char: "转", pinyin: "zhuǎn", reason: "‘路转溪桥’意为道路转过，转读 zhuǎn。" },
        { path: "line-4.token-11", char: "溪", pinyin: "xī", reason: "‘溪桥’的溪读 xī。" },
        { path: "line-4.token-12", char: "桥", pinyin: "qiáo", reason: "‘溪桥’的桥读 qiáo。" },
        { path: "line-4.token-13", char: "忽", pinyin: "hū", reason: "‘忽见’表示突然，忽读 hū。" },
        { path: "line-4.token-14", char: "见", pinyin: "xiàn", reason: "‘忽见’意为突然显现、映入眼帘，见读 xiàn。" },
      ],
      spatialLearning: {
        coreRelation: "summer-night-sensory-road",
        observation: "夜行视线从月光和树枝近景，经过稻花与蛙声的田野，再到稀星、山前小雨，最后在转过溪桥时看见旧茅店。",
        mapAction: "画‘黄沙道—稻田—山前—社林—溪桥—茅店’的观察顺序，不把词中夜行路线当成作者精确地图轨迹。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "慢慢走、打开感官，熟悉的地方也会在转弯处重新带来发现。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-yin-jiu-tao-yuanming": {
    overrideReason: "下一批内容复核：人境心远、东篱采菊、南山暮景、归鸟与忘言留白的田园空间已人工确认；还按归还义校正，不把南山绑定为现代单一坐标。",
    ...catalogReview({
      reviewNotes: "诗写泛化田园隐居经验，南山是眼前诗境而非可核定的单一现代山名；候选庐山只作历史文化关联，暂不绑定地图坐标。",
      pinyinOverrides: [
        { path: "line-8.token-5", char: "还", pinyin: "huán", reason: "‘飞鸟相与还’意为鸟儿结伴归去，还读 huán。" },
      ],
      spatialLearning: {
        coreRelation: "human-settlement-and-inner-quiet",
        observation: "空间从人境中的居所转入心远后的安静，再经过东篱、南山和暮归飞鸟，最后落在难以言说的生活真意。",
        mapAction: "用‘人境—屋舍—东篱—南山—归鸟’表达观察层级，明确南山不是已核定的现代坐标，也不绘制陶渊明的精确路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8", "line-9", "line-10"],
        childTakeaway: "地点可以给出生活背景，内心的安静和注意力才让普通田园显出深长意味。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-jiang-nan-feng-li-guinian": {
    overrideReason: "第十五批内容复核：岐王宅、崔九堂的旧日歌声与江南落花重逢的时间层次已人工确认；江南与金陵的空间边界按文化区域处理。",
    ...catalogReview({
      reviewNotes: "诗从旧日宅第和歌声转到江南暮春的重逢；江南是宽广文化区域，金陵只作现代文化地理参考，不断言杜甫或李龟年的精确行程。",
      spatialLearning: {
        coreRelation: "jiangnan-memory-and-reunion",
        observation: "视线先回到岐王宅、崔九堂的旧日相遇，再转到江南落花时节的眼前重逢；过去与现在叠在同一首短诗里。",
        mapAction: "用江南与金陵作文化区域参照，复述‘旧日宅第—江南暮春—再次相逢’的关系，不绘作者或李龟年的具体路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "地图能帮助理解区域和距离，落花与歌声则让孩子感到重逢背后的时间变化。",
      },
      placeRelations: [
        { targetId: "jinling", type: "cultural_region", confidence: "medium", assertion: "江南是诗句直接写出的宽广文化区域，金陵可作为其中的现代历史城市参照，不等同诗中精确站位。", childMeaning: "把眼前江南风景放回江南水乡与历史城市的区域关系中。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: [],
    }),
  },

  "child-bu-suan-zi-yong-mei": {
    overrideReason: "第十五批内容复核：驿外断桥、风雨、群芳与零落成尘仍留香的梅花品格已人工确认；词中逗号后的逐字拼音错位及著的语境读音已校正。",
    ...catalogReview({
      reviewNotes: "‘驿外断桥边’是词中的泛化孤梅环境，没有可核定的具体地点；学习重点是风雨中的不争与守香，不绑定陆游的精确行迹。",
      pinyinOverrides: [
        { path: "line-1.token-7", char: "寂", pinyin: "jì", reason: "修正词牌句内逗号后的逐字拼音对齐。" },
        { path: "line-1.token-8", char: "寞", pinyin: "mò", reason: "‘寂寞’的寞读 mò。" },
        { path: "line-1.token-9", char: "开", pinyin: "kāi", reason: "‘开无主’的开读 kāi。" },
        { path: "line-1.token-10", char: "无", pinyin: "wú", reason: "‘无主’的无读 wú。" },
        { path: "line-1.token-11", char: "主", pinyin: "zhǔ", reason: "‘无主’指无人照料，主读 zhǔ。" },
        { path: "line-2.token-9", char: "更", pinyin: "gèng", reason: "‘更著’意为又加上，‘更’读 gèng。" },
        { path: "line-2.token-10", char: "著", pinyin: "zhuó", reason: "‘更著风和雨’意为又遭受风雨，著读 zhuó。" },
        { path: "line-2.token-11", char: "风", pinyin: "fēng", reason: "修正‘风和雨’的逐字拼音对齐。" },
        { path: "line-2.token-12", char: "和", pinyin: "hé", reason: "‘风和雨’的和表示并列，读 hé。" },
        { path: "line-2.token-13", char: "雨", pinyin: "yǔ", reason: "‘风和雨’的雨读 yǔ。" },
        { path: "line-3.token-7", char: "一", pinyin: "yī", reason: "‘一任’意为任凭，一按词语读 yī。" },
        { path: "line-3.token-8", char: "任", pinyin: "rèn", reason: "‘一任’意为任凭，任读 rèn。" },
        { path: "line-3.token-9", char: "群", pinyin: "qún", reason: "修正‘群芳’的逐字拼音对齐。" },
        { path: "line-3.token-10", char: "芳", pinyin: "fāng", reason: "‘群芳’指各种花，芳读 fāng。" },
        { path: "line-3.token-11", char: "妒", pinyin: "dù", reason: "‘群芳妒’中的妒读 dù。" },
        { path: "line-4.token-9", char: "只", pinyin: "zhǐ", reason: "‘只有’的只读 zhǐ。" },
        { path: "line-4.token-10", char: "有", pinyin: "yǒu", reason: "‘只有’的有读 yǒu。" },
        { path: "line-4.token-11", char: "香", pinyin: "xiāng", reason: "‘香如故’的香读 xiāng。" },
        { path: "line-4.token-12", char: "如", pinyin: "rú", reason: "‘如故’意为像从前，如读 rú。" },
        { path: "line-4.token-13", char: "故", pinyin: "gù", reason: "‘香如故’的故读 gù。" },
      ],
      spatialLearning: {
        coreRelation: "lonely-post-road-and-mei-character",
        observation: "空间由驿站外、断桥边的孤梅近景展开，黄昏和风雨加深环境压力，最后由零落成尘转到仍不改变的香气。",
        mapAction: "用‘驿站—断桥—孤梅—风雨’的关系图理解环境，不创建梅花或陆游的虚构坐标与路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "地方可以很偏、环境可以有风雨，但一个人的品格仍能保持自己的方向。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-you-shan-xi-cun": {
    overrideReason: "第十五批内容复核：农家待客、山路转折、春社风俗与月夜再访的乡村空间已人工确认；山重水复的重按语境读 chóng。",
    ...catalogReview({
      reviewNotes: "《游山西村》提供的是一条乡村访问路线和生活场景，诗句没有足够证据核定现代具体村址；不把‘山西’误解为今天的山西省。",
      pinyinOverrides: [
        { path: "line-3.token-2", char: "重", pinyin: "chóng", reason: "‘山重水复’意为山峦重重、层层叠叠，重读 chóng，不是重量的 zhòng。" },
      ],
      spatialLearning: {
        coreRelation: "village-hospitality-and-turning-road",
        observation: "行走顺序从农家酒食到山重水复，再到柳暗花明的新村、春社鼓乐和下一次月夜敲门。",
        mapAction: "画‘农家—曲折山路—新村—春社—月夜门前’的叙事关系，不把题名中的‘山西’当作现代省份坐标，也不绘作者的精确路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8"],
        childTakeaway: "一条路的希望来自继续走，也来自沿途真实的人情和愿意再相见的约定。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-chun-ri-zhu-xi": {
    overrideReason: "第十五批内容复核：泗水寻芳、景物焕新、东风拟人与万紫千红的春日观察链已人工确认；泗水仅作诗句河流参照，不推断精确站位。",
    ...catalogReview({
      reviewNotes: "诗句直接写‘泗水滨’，可用泗水作为河流文化地理参照；地图不把它自动解释为朱熹当日的精确游踪或单一观景点。",
      spatialLearning: {
        coreRelation: "riverbank-spring-observation",
        observation: "视线沿泗水边寻找春景，从河岸的无边光景推进到东风和万紫千红的季节感知。",
        mapAction: "标出泗水这一河流参照，用‘河边寻芳—景物焕新—春风—花色’复述观察顺序，不绘朱熹的精确行走轨迹。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "地图给出观察发生的河流背景，孩子还要回到颜色、风和景物变化寻找春天的证据。",
      },
      placeRelations: [
        { targetId: "sishui", type: "river_imagery", confidence: "high", assertion: "‘泗水滨’直接写出泗水边，是诗中寻找春景的河流空间参照；不证明作者当日的精确站位。", childMeaning: "沿河行走，眼前的春色一层层打开。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["sishui"],
    }),
  },

  "child-xi-jiang-yue-huang-sha": {
    overrideReason: "第十五批内容复核：黄沙道夏夜的鹊蝉、稻香蛙声、星雨与溪桥茅店路线已人工确认；词句逗号后的拼音错位与忽见的见读 xiàn 已校正。",
    ...catalogReview({
      reviewNotes: "黄沙道、社林、茅店是词中乡村夜行的泛化空间，暂不绑定辛弃疾某个可核定地点；地图用叙事关系表达道路、稻田、溪桥和村店。",
      pinyinOverrides: [
        { path: "line-1.token-8", char: "清", pinyin: "qīng", reason: "修正词句内逗号后的逐字拼音对齐。" },
        { path: "line-1.token-9", char: "风", pinyin: "fēng", reason: "‘清风’的风读 fēng。" },
        { path: "line-1.token-10", char: "半", pinyin: "bàn", reason: "‘半夜’的半读 bàn。" },
        { path: "line-1.token-11", char: "夜", pinyin: "yè", reason: "‘半夜’的夜读 yè。" },
        { path: "line-1.token-12", char: "鸣", pinyin: "míng", reason: "‘鸣蝉’的鸣读 míng。" },
        { path: "line-1.token-13", char: "蝉", pinyin: "chán", reason: "‘鸣蝉’的蝉读 chán。" },
        { path: "line-2.token-9", char: "听", pinyin: "tīng", reason: "‘听取’的听读 tīng。" },
        { path: "line-2.token-10", char: "取", pinyin: "qǔ", reason: "‘听取’意为听见、听到，取读 qǔ。" },
        { path: "line-2.token-11", char: "蛙", pinyin: "wā", reason: "‘蛙声’的蛙读 wā。" },
        { path: "line-2.token-12", char: "声", pinyin: "shēng", reason: "‘蛙声’的声读 shēng。" },
        { path: "line-2.token-13", char: "一", pinyin: "yí", reason: "‘一片’连续朗读中一读 yí。" },
        { path: "line-2.token-14", char: "片", pinyin: "piàn", reason: "‘一片’的片读 piàn。" },
        { path: "line-3.token-8", char: "两", pinyin: "liǎng", reason: "‘两三点’的两读 liǎng。" },
        { path: "line-3.token-9", char: "三", pinyin: "sān", reason: "‘两三点’的三读 sān。" },
        { path: "line-3.token-10", char: "点", pinyin: "diǎn", reason: "‘两三点雨’的点读 diǎn。" },
        { path: "line-3.token-11", char: "雨", pinyin: "yǔ", reason: "‘点雨’的雨读 yǔ。" },
        { path: "line-3.token-12", char: "山", pinyin: "shān", reason: "‘山前’的山读 shān。" },
        { path: "line-3.token-13", char: "前", pinyin: "qián", reason: "‘山前’的前读 qián。" },
        { path: "line-4.token-9", char: "路", pinyin: "lù", reason: "‘路转’的路读 lù。" },
        { path: "line-4.token-10", char: "转", pinyin: "zhuǎn", reason: "‘路转’意为道路转弯，转读 zhuǎn。" },
        { path: "line-4.token-11", char: "溪", pinyin: "xī", reason: "‘溪桥’的溪读 xī。" },
        { path: "line-4.token-12", char: "桥", pinyin: "qiáo", reason: "‘溪桥’的桥读 qiáo。" },
        { path: "line-4.token-13", char: "忽", pinyin: "hū", reason: "‘忽见’的忽读 hū。" },
        { path: "line-4.token-14", char: "见", pinyin: "xiàn", reason: "‘忽见’意为忽然显现，见读 xiàn。" },
      ],
      spatialLearning: {
        coreRelation: "summer-night-village-route",
        observation: "夜行路线由月下枝头和虫鸟声展开，经过稻田香、蛙声、星雨，最后在路转溪桥处看见社林边的旧茅店。",
        mapAction: "画‘夜路—稻田—山前—溪桥—社林茅店’的叙事关系，用声音、气味和转弯标注路径，不绑定作者的现代坐标。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "平常的乡村夜路可以被声音、气味和方向感写得完整而有生命。",
      },
      canonicalPlaceIds: [],
    }),
  },

  "child-deng-gao": {
    overrideReason: "本批内容复核：高台秋江的风、猿、落木、长江与漂泊多病情绪已人工确认；不尽中的不按词义读 bù，长江仅作直接河流参照。",
    ...catalogReview({
      reviewNotes: "诗中长江是直接出现的河流空间，登台位置和杜甫当日路线没有足够证据核定；地图只表达高台—秋江—远方的观察关系。",
      pinyinOverrides: [
        { path: "line-4.token-1", char: "不", pinyin: "bù", reason: "‘不尽长江’中的不表示没有、未尽，按词义读 bù。" },
      ],
      spatialLearning: {
        coreRelation: "autumn-height-and-yangtze-horizon",
        observation: "视线从高台秋风和猿声落到清洲白沙、飞鸟与落木，再沿长江滚滚流向远方，最后回到独自登台的人。",
        mapAction: "以长江作河流参照，用‘高台—秋江—落木—远方’复述观察层级，不绘杜甫的精确登高路线或站位。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6", "line-7", "line-8"],
        childTakeaway: "辽阔的山河能打开视野，也会让漂泊、孤独和时间的重量更加清楚。",
      },
      placeRelations: [
        { targetId: "yangtze", type: "river_imagery", confidence: "high", assertion: "‘不尽长江滚滚来’直接写长江，是诗中秋江远望的河流参照；不证明诗人的精确站位。", childMeaning: "长江把高台上的目光带到看不见的远方。", sourceKeys: ["chinesePoetry", "yangtzeNDRC"] },
      ],
      canonicalPlaceIds: ["yangtze"],
    }),
  },

  "child-shi-er": {
    overrideReason: "本批内容复核：临终、九州统一、中原收复与家祭告父的家国—家庭记忆关系已人工确认；不见中的不按词义读 bù，九州与中原保留历史区域边界。",
    ...catalogReview({
      reviewNotes: "九州、中原是诗中的历史区域参照，家祭是家庭记忆空间；不把陆游临终位置或王师路线绘成已证实的现代行程。",
      pinyinOverrides: [
        { path: "line-2.token-3", char: "不", pinyin: "bù", reason: "‘不见九州同’中的不表示没有看见，按词义读 bù。" },
      ],
      spatialLearning: {
        coreRelation: "family-memory-and-historical-region",
        observation: "诗从个人生命的终点转向九州和中原的历史区域，再回到未来家祭中把消息告诉父亲的家庭空间。",
        mapAction: "标出中原作为历史区域参照，用‘家—九州—中原—家祭’复述愿望的方向，不绘陆游或王师的精确路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "一封遗愿可以把个人、国家和家庭记忆连在一起；读历史时要同时理解愿望背后的生命和时代。",
      },
      placeRelations: [
        { targetId: "zhongyuan", type: "historical_region", confidence: "high", assertion: "‘中原’直接出现在诗句中，是北定与统一愿望的历史区域参照；不等于现代行政边界或已完成的路线。", childMeaning: "诗人的遗愿指向中原和九州的统一。", sourceKeys: ["chinesePoetry"] },
        { targetId: "chang-an", type: "historical_context", confidence: "medium", assertion: "长安可作为古代国家与家国记忆的城市参照，但诗句没有直接写长安，也不证明诗人的临终位置。", childMeaning: "用历史城市背景理解家国尺度，不把它当作诗中明确地点。", sourceKeys: ["chinesePoetry"] },
      ],
      canonicalPlaceIds: ["zhongyuan"],
    }),
  },

  "child-ti-lin-an-di": {
    overrideReason: "本批内容复核：临安山水、西湖歌舞、暖风沉醉与杭州—汴州错认的讽喻关系已人工确认；杭州是直接景观参照，汴州保留为历史都城背景。",
    ...catalogReview({
      reviewNotes: "西湖、杭州是诗句明确写出的景观与城市；汴州是历史都城的讽刺性对照，项目不将其误绘为作者当日行程，也不把金陵作为本诗直接地点。",
      spatialLearning: {
        coreRelation: "west-lake-prosperity-and-historical-warning",
        observation: "视线从临安层叠青山楼阁落到西湖歌舞，再由暖风与游人沉醉转向杭州被错认成汴州的历史批评。",
        mapAction: "先定位西湖与杭州，再用汴州作为历史都城对照解释‘直把’的讽刺，不绘林升的精确游览路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "美景和娱乐之外还要保持清醒，地图中的城市对照能帮助理解诗人的忧思。",
      },
      placeRelations: [
        { targetId: "west-lake", type: "depicts_place", confidence: "high", assertion: "‘西湖’直接出现在诗句中，是歌舞与城市景观的核心参照。", childMeaning: "湖光楼影是繁华画面，也是诗人提出警醒的现场。", sourceKeys: ["chinesePoetry", "westLakeHangzhou"] },
        { targetId: "hangzhou", type: "city_context", confidence: "high", assertion: "‘杭州’直接出现在末句，西湖也位于杭州；诗句没有提供作者精确站位。", childMeaning: "把西湖歌舞放回杭州的城市空间中理解。", sourceKeys: ["chinesePoetry", "westLakeHangzhou"] },
      ],
      canonicalPlaceIds: ["hangzhou"],
    }),
  },

  "child-guan-yi-mai": {
    overrideReason: "本批内容复核：农忙家庭、炎热收割、贫妇拾穗、税尽无粮与诗人自愧的劳动—同理心链已人工确认；曾不事农桑中的不按词义读 bù。",
    ...catalogReview({
      reviewNotes: "《观刈麦》写泛化的五月田野和农家生活，没有可核定的单一地点；地图只展示家—田—田垄—贫妇拾穗的关系，不虚构白居易的精确观察路线。",
      pinyinOverrides: [
        { path: "line-22.token-2", char: "不", pinyin: "bù", reason: "‘曾不事农桑’中的不表示没有，按词义读 bù。" },
      ],
      spatialLearning: {
        coreRelation: "summer-harvest-and-labor-empathy",
        observation: "空间从农家和五月日历进入金黄麦田，再经过送饭、南冈收割、贫妇拾穗和税尽无粮，最后回到诗人的自省。",
        mapAction: "画‘农家—田垄—南冈—收割后田地—贫妇破筐—诗人反思’的关系，不标注未经证实的作者具体站位。",
        evidenceLineIds: Array.from({ length: 26 }, (_, index) => "line-" + (index + 1)),
        childTakeaway: "一片麦田里同时有丰收、身体劳动、家庭照料和饥饿；理解食物，也要理解劳动者的处境。",
      },
      canonicalPlaceIds: [],
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
    ...catalogReview({
      status: "curated_content_v1",
      reviewNotes: "本批复核教材常见四句本正文、返景/闻义项与空山—声音—光线的阅读顺序；鹿柴不绑定为王维精确游踪，地图保持无地点关系边界。",
      pinyinOverrides: [
        { path: "line-1.token-3", char: "不", pinyin: "bù", reason: "‘不见人’中‘不’表示没有看见，按词义读 bù。" },
        { path: "line-3.token-2", char: "景", pinyin: "yǐng", reason: "‘返景’中的景通‘影’，指夕阳返照的光影，按教材语境读 yǐng，不沿用景物义的 jǐng。" },
      ],
      spatialLearning: {
        coreRelation: "empty-mountain-sound-and-returning-light",
        observation: "先看空山却不见人，再由声音确认有人在附近；随后视线进入深林，最后落到青苔上的返景。",
        mapAction: "用‘山口—声音来源—深林—青苔光斑’理解诗的微小空间变化，不虚构鹿柴的现代路线或诗人站位。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
        childTakeaway: "看不见不等于不存在，声音和光线也能帮助我们认识一处山林。",
      },
      placeRelations: [],
      canonicalPlaceIds: [],
    }),
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
    ...catalogReview({
      status: "curated_content_v1",
      reviewNotes: "本批复核香港教育局参考六句本的正文体裁、漉豉/萁/釜等词义和同根相煎寓意；故事地点保持泛化家庭灶间，不把传统故事地点当作曹植可验证行程。",
      spatialLearning: {
        coreRelation: "shared-root-and-kitchen-metaphor",
        observation: "画面从煮豆、滤豉的灶间动作，转到锅下燃烧的豆萁和锅中流泣的豆，最后由同根反问把食物寓言转成兄弟关系的思考。",
        mapAction: "以灶台、锅下、锅中三个近距离位置读清动作关系；本诗没有可核定的现代地点，不添加地图路线。",
        evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-5", "line-6"],
        childTakeaway: "同根相连的人更应该互相珍惜，不要把冲突变成互相伤害。",
      },
      placeRelations: [],
      canonicalPlaceIds: [],
    }),
  },
};

export default curatedOverrides;
