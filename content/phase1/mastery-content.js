/**
 * Learning-mastery content for the ten complete Phase 1 poems.
 *
 * This layer is deliberately separate from the spatial and pronunciation
 * records.  A child can therefore learn what a poem says, feels and means
 * without needing to finish the map exploration first.  `poems.js` merges
 * these records with its already-curated interpretation.lineMeanings.
 */

function lineMeaning(lineId, meaning, keywords, misunderstanding, picture, prompt) {
  return { lineId, meaning, keywords, misunderstanding, picture, prompt };
}

function mastery({ wholeMeaning, mainContent, emotion, centralIdea, lineMeanings, commonMisunderstandings, memoryKeywords, firstCharacterHints, extension }) {
  return {
    wholeMeaning,
    mainContent,
    emotion,
    centralIdea,
    lineMeanings,
    commonMisunderstandings,
    memoryKeywords,
    firstCharacterHints,
    ...(extension ? { extension } : {}),
  };
}

export const masteryContentByPoemId = {
  "lushan-wang-lushan-pubu": mastery({
    wholeMeaning: "李白远远看见庐山瀑布：阳光照着山峰，水汽像紫烟，瀑布从很高的地方冲下来，好像天上的银河落到了人间。",
    mainContent: "诗人先写山间的光和雾，再写远望瀑布的高度、速度和气势，最后用银河落九天的想象把壮观说得更大。",
    emotion: "惊叹、喜爱，也有被山水力量震住的兴奋。",
    centralIdea: "用明亮的画面、夸张的高度和银河的想象，写出庐山瀑布壮观有力、令人惊叹的样子。",
    lineMeanings: [
      lineMeaning("line-1", "阳光照着香炉峰，山间水汽升起来，在眼中像一缕紫色的烟。", ["日照", "香炉", "紫烟"], "‘烟’不是做饭冒出的烟，而是阳光中的山间水汽。", "金色阳光照在山峰上，薄雾泛出紫色。", "你能找到阳光和水汽分别在哪里吗？"),
      lineMeaning("line-2", "从远处看，瀑布像一条长长的白带挂在山前。", ["遥看", "瀑布", "挂"], "瀑布不是一块布真的挂在山上，‘挂’是远看时的形状感觉。", "站远一点，水流像白练贴在山壁前。", "为什么站远了，瀑布会像‘挂’着？"),
      lineMeaning("line-3", "瀑布从高处笔直冲下；‘三千尺’是夸张，表示看起来特别高。", ["飞流", "直下", "三千尺"], "‘三千尺’不是在给瀑布精确量高度。", "水流像一条白龙从山顶直冲下来。", "用手从高处向下比一比‘直下’的方向。"),
      lineMeaning("line-4", "诗人觉得瀑布像银河从天空落下来，这是想象和比喻。", ["银河", "落", "九天"], "天上的银河没有真的掉下来，诗人在用想象表达惊叹。", "夜空的银河化成银白水流，落入山间。", "瀑布的哪一个特点让你想到银河？"),
    ],
    commonMisunderstandings: [
      { phrase: "紫烟", correction: "是阳光照着山间水汽产生的朦胧色彩，不是山在冒烟。" },
      { phrase: "三千尺", correction: "是为了写出瀑布高和有力量的夸张说法，不是测量结果。" },
      { phrase: "银河落九天", correction: "是诗人的想象和比喻，用来表达瀑布的壮观。" },
    ],
    memoryKeywords: [
      { lineId: "line-1", keywords: ["阳光", "香炉峰", "紫烟"], cue: "先看光雾" },
      { lineId: "line-2", keywords: ["远看", "瀑布", "挂前川"], cue: "再看远处的白带" },
      { lineId: "line-3", keywords: ["飞流", "直下", "三千尺"], cue: "水从高处冲下" },
      { lineId: "line-4", keywords: ["银河", "九天"], cue: "最后放开想象" },
    ],
    firstCharacterHints: [
      { lineId: "line-1", character: "日", cue: "阳光与紫烟" },
      { lineId: "line-2", character: "遥", cue: "远处看瀑布" },
      { lineId: "line-3", character: "飞", cue: "瀑布直冲而下" },
      { lineId: "line-4", character: "疑", cue: "想成银河" },
    ],
  }),

  "lushan-ti-xi-lin-bi": mastery({
    wholeMeaning: "从横面、侧面、远处、近处、高处、低处看庐山，样子都会不同。因为人正在山里面，只看到局部，所以很难一次看清整座山。",
    mainContent: "诗先记录从不同位置看山的变化，再由‘身在此山中’说明视角会限制认识。",
    emotion: "观察后的清醒、思考和一点谦逊。",
    centralIdea: "看事情不能只停在一个局部位置，要主动换角度、补信息，才更接近完整认识。",
    lineMeanings: [
      lineMeaning("line-1", "横着看，庐山像连绵的山岭；从侧面看，又像一座座高峰。", ["横看", "成岭", "侧成峰"], "不是庐山在不停变形，而是观看位置不同。", "同一座山的两张视角图，一张横长，一张高耸。", "你能用身体换一个方向，看看物体的样子吗？"),
      lineMeaning("line-2", "站得远近不同、位置高低不同，看到的山形也各不相同。", ["远近", "高低", "不同"], "‘不同’主要说看到的样子不同，不是每座山都换了一座。", "从山脚、山腰和远处看同一座山。", "诗里哪些词在提醒我们改变观察位置？"),
      lineMeaning("line-3", "因为人在庐山里面，只看到了其中一部分，没有认清整座山的全貌。", ["不识", "真面目", "庐山"], "‘真面目’不是说山有人的脸，而是整座山真正完整的样子。", "人在山谷里抬头，只能看见被山壁挡住的一角。", "人在山里时，视线会被什么挡住？"),
      lineMeaning("line-4", "看不全面的原因，是自己正处在这座山中，位置限制了视野。", ["只缘", "身在", "山中"], "‘只缘’是‘只是因为’，不是说山中生活一定不好。", "退到山外，才能把更多山形放进眼里。", "换到山外，你会多看到哪些部分？"),
    ],
    commonMisunderstandings: [
      { phrase: "横看成岭侧成峰", correction: "山没有真的变成不同东西，是观察方向不同。" },
      { phrase: "真面目", correction: "指庐山完整的真实面貌，不是人的脸。" },
      { phrase: "只缘身在此山中", correction: "诗先说看山，后面才引出换角度认识事情的启发。" },
    ],
    memoryKeywords: [
      { lineId: "line-1", keywords: ["横", "岭", "侧", "峰"], cue: "横看和侧看" },
      { lineId: "line-2", keywords: ["远近", "高低", "不同"], cue: "位置一换，样子不同" },
      { lineId: "line-3", keywords: ["不识", "真面目"], cue: "还看不全" },
      { lineId: "line-4", keywords: ["身在", "山中"], cue: "因为自己在山里" },
    ],
    firstCharacterHints: [
      { lineId: "line-1", character: "横", cue: "横看与侧看" },
      { lineId: "line-2", character: "远", cue: "远近高低" },
      { lineId: "line-3", character: "不", cue: "没有认清全貌" },
      { lineId: "line-4", character: "只", cue: "原因在山中" },
    ],
  }),

  "yellow-crane-huang-he-lou": mastery({
    wholeMeaning: "诗人站在黄鹤楼一带，想到乘黄鹤离去的传说，又看到晴朗江面、汉阳树和鹦鹉洲。太阳将落时，烟波江景让他想起故乡，心里生出愁绪。",
    mainContent: "诗从黄鹤楼的传说和空落感写起，铺开眼前的江城远景，最后由日暮远望转入思乡。",
    emotion: "空茫、惆怅和日暮时分的思乡。",
    centralIdea: "眼前开阔的江城景色和远去的传说，触发了诗人对时间流逝与故乡的感慨。",
    lineMeanings: [
      lineMeaning("line-1", "传说中那位过去的人已经乘黄鹤离开，留下一个遥远的故事。", ["昔人", "乘", "黄鹤"], "这是诗里的传说，不必当作真实人物骑鸟的新闻。", "黄鹤载着古老传说飞向远方。", "你听过哪些地方留下的旧故事？"),
      lineMeaning("line-2", "这个地方如今只剩下黄鹤楼，‘空余’带出传说离去后的空落。", ["此地", "空余", "黄鹤楼"], "‘空余’不是说楼里面什么都没有，而是说人和鹤已去，只剩楼。", "高楼站在江边，周围有很大的空旷感。", "谁离开了，什么还留在原地？"),
      lineMeaning("line-3", "黄鹤飞走后不再回来，诗人借传说感叹有些往事一去难返。", ["一去", "不复返"], "不必理解成现实中每只黄鹤都永远不回头。", "飞鸟越过楼顶，消失在远天。", "‘不复返’让你想到什么样的时间感？"),
      lineMeaning("line-4", "白云飘过很久很久，天空显得悠长而空旷。", ["白云", "千载", "悠悠"], "‘千载’是很长时间的感觉，不是精确计算一千年。", "白云慢慢飘过高楼，天空没有尽头。", "画面里什么在动，什么显得很安静？"),
      lineMeaning("line-5", "天气晴朗，江面开阔，汉阳一带的树木看得清清楚楚。", ["晴川", "历历", "汉阳树"], "‘晴川’不是一条叫晴川的河，而是晴日下的江面景象。", "从楼上越过江面，远处树木一棵棵可辨。", "哪一个词让远处的树变得清楚？"),
      lineMeaning("line-6", "鹦鹉洲上芳草茂盛，春意铺在江洲的远望里。", ["芳草", "萋萋", "鹦鹉洲"], "‘鹦鹉洲’是地名，不是说洲上一定有鹦鹉在排队。", "绿色芳草连到江边的小洲。", "芳草让画面增加了什么颜色和气息？"),
      lineMeaning("line-7", "太阳快落山时，诗人望向远方，问自己的故乡到底在哪里。", ["日暮", "乡关", "何处"], "‘乡关’指故乡，不只是城门或一座关卡。", "暮色从江面升起，目光越过远方寻找家乡。", "为什么日落时更容易想家？"),
      lineMeaning("line-8", "江面烟雾水波相连，暮色中的景象让诗人感到忧愁。", ["烟波", "江上", "愁"], "不是江水本身会让人发愁，而是诗人的心情投向了景色。", "烟雾和水波把远处的路变得朦胧。", "你觉得愁是由哪个景物和哪个时间一起带来的？"),
    ],
    commonMisunderstandings: [
      { phrase: "昔人乘黄鹤", correction: "这是黄鹤楼传说，诗借传说写时间和空落，不是历史新闻。" },
      { phrase: "千载", correction: "用来写时间久远和空旷，不是要求孩子换算准确年数。" },
      { phrase: "乡关", correction: "指故乡、家乡的方向，不是眼前一座关口。" },
    ],
    memoryKeywords: [
      { lineId: "line-1", keywords: ["昔人", "黄鹤", "去"], cue: "传说中的人已离开" },
      { lineId: "line-2", keywords: ["此地", "空余", "楼"], cue: "只剩黄鹤楼" },
      { lineId: "line-3", keywords: ["一去", "不复返"], cue: "黄鹤不回" },
      { lineId: "line-4", keywords: ["白云", "千载", "悠悠"], cue: "长久空旷" },
      { lineId: "line-5", keywords: ["晴川", "汉阳树"], cue: "看清江对岸" },
      { lineId: "line-6", keywords: ["芳草", "鹦鹉洲"], cue: "看江洲芳草" },
      { lineId: "line-7", keywords: ["日暮", "乡关"], cue: "日落想家" },
      { lineId: "line-8", keywords: ["烟波", "愁"], cue: "江上暮色生愁" },
    ],
    firstCharacterHints: [
      { lineId: "line-1", character: "昔", cue: "旧日传说" },
      { lineId: "line-2", character: "此", cue: "此地只剩楼" },
      { lineId: "line-3", character: "黄", cue: "黄鹤远去" },
      { lineId: "line-4", character: "白", cue: "白云千载" },
      { lineId: "line-5", character: "晴", cue: "晴川树影" },
      { lineId: "line-6", character: "芳", cue: "芳草洲上" },
      { lineId: "line-7", character: "日", cue: "日暮问乡关" },
      { lineId: "line-8", character: "烟", cue: "烟波江上愁" },
    ],
  }),

  "yellow-crane-song-meng-hao-ran": mastery({
    wholeMeaning: "李白在黄鹤楼为老朋友孟浩然送行。朋友在春天乘船去扬州，船影越来越远，最后消失在天边，只剩长江向远方流去。",
    mainContent: "诗把送别写成目光不断拉远的过程：楼是起点，扬州是远方，孤帆变小，最后只见江流。",
    emotion: "依依不舍、安静而深长的离情。",
    centralIdea: "不直接说悲伤，而让目光跟着朋友的船走远，用江流写出送别后的不舍。",
    lineMeanings: [
      lineMeaning("line-1", "老朋友在黄鹤楼向西告别，乘船离开了送别的地方。", ["故人", "西辞", "黄鹤楼"], "‘故人’是老朋友，不是已经去世的人。", "朋友登船，回望江边的楼。", "谁是出发的人，谁留在楼边？"),
      lineMeaning("line-2", "春天三月，朋友顺江前往扬州；‘烟花’指春日烟霭和繁花般的景色。", ["烟花", "三月", "下扬州"], "‘烟花’不是放烟花，‘下扬州’是在江路上顺流前往。", "春雾和花色笼着江面，船顺流而下。", "春天的江面为什么像有一层轻雾？"),
      lineMeaning("line-3", "江面上只剩一叶孤帆的远影，渐渐消失在蓝天尽头。", ["孤帆", "远影", "碧空尽"], "‘孤帆’写诗人眼里只看见那一叶船，不是说江上永远只有一条船。", "小船从清楚变成一个小点，最后看不见。", "船是怎样一步步变远的？"),
      lineMeaning("line-4", "船影消失后，诗人还能看见的只有长江一直流向天边。", ["唯见", "长江", "天际流"], "不是长江流到了天空，而是远望时水天相接，像流向天边。", "船消失后，江水接着把视线带向远方。", "为什么最后留下的是江，而不是船？"),
    ],
    commonMisunderstandings: [
      { phrase: "烟花三月", correction: "这里写春天的烟霭和花意，不是节日燃放烟花。" },
      { phrase: "故人", correction: "指老朋友孟浩然，不是‘已经故去的人’。" },
      { phrase: "孤帆", correction: "是诗人送别时视线里的一叶船，突出远去和孤单的感觉。" },
    ],
    memoryKeywords: [
      { lineId: "line-1", keywords: ["故人", "黄鹤楼"], cue: "朋友从楼边告别" },
      { lineId: "line-2", keywords: ["烟花", "三月", "扬州"], cue: "春日顺流去扬州" },
      { lineId: "line-3", keywords: ["孤帆", "远影", "碧空"], cue: "船影渐远消失" },
      { lineId: "line-4", keywords: ["唯见", "长江", "天际"], cue: "只剩江流向天边" },
    ],
    firstCharacterHints: [
      { lineId: "line-1", character: "故", cue: "老朋友告别" },
      { lineId: "line-2", character: "烟", cue: "春日烟花去扬州" },
      { lineId: "line-3", character: "孤", cue: "一叶船远去" },
      { lineId: "line-4", character: "唯", cue: "最后只见长江" },
    ],
  }),

  "west-lake-yin-hu-shang": mastery({
    wholeMeaning: "苏轼在西湖边饮酒，先看晴天闪亮的水光，再看雨天朦胧的山色。他把西湖比作美人西施：淡妆或浓妆都好看。",
    mainContent: "诗并列晴天和雨天的西湖景色，再用西施化妆作比，说明不同面貌都各有美处。",
    emotion: "轻快、欣赏和从容的喜爱。",
    centralIdea: "美不只有一种样子，西湖在晴雨变化中都能呈现自己的好。",
    lineMeanings: [
      lineMeaning("line-1", "晴天时，西湖水面波光闪动，明亮而美好。", ["水光", "潋滟", "晴"], "‘潋滟’不是水灾或巨浪，而是水面光彩闪动。", "阳光落在湖面，细碎的光点一起闪。", "晴天的光落在哪里？"),
      lineMeaning("line-2", "雨天山色被雨雾笼住，朦胧，却也很奇妙。", ["山色", "空蒙", "雨"], "‘空蒙’不是山被清空，而是被雨雾遮得若隐若现。", "远山藏在薄雾后，只露出淡淡轮廓。", "雨把远山变清楚了，还是变朦胧了？"),
      lineMeaning("line-3", "诗人想把西湖比作古代美人西施，用人的美来形容湖的美。", ["西湖", "比", "西子"], "‘西子’是西施的美称，不是另一个湖名。", "湖面像一位美人，等待不同天气为它换妆。", "诗人为什么要找一个美人来作比？"),
      lineMeaning("line-4", "西施化淡妆或浓妆都合适，诗人借此说西湖晴天雨天都好看。", ["淡妆", "浓抹", "相宜"], "不是让湖真的化妆，而是用比喻说两种景色都合宜。", "晴天是淡妆，雨天是浓淡不同的另一种妆。", "你会把晴天和雨天分别想成什么妆容？"),
    ],
    commonMisunderstandings: [
      { phrase: "潋滟", correction: "写晴日水面波光闪动，不是指水面危险或很大。" },
      { phrase: "空蒙", correction: "写雨雾中的朦胧感，不是‘空空的山’。" },
      { phrase: "西子", correction: "是西施的美称，诗用她的美来比西湖。" },
    ],
    memoryKeywords: [
      { lineId: "line-1", keywords: ["水光", "潋滟", "晴"], cue: "晴天看闪光的水" },
      { lineId: "line-2", keywords: ["山色", "空蒙", "雨"], cue: "雨天看朦胧的山" },
      { lineId: "line-3", keywords: ["西湖", "西子"], cue: "把湖比美人" },
      { lineId: "line-4", keywords: ["淡妆", "浓抹", "相宜"], cue: "两种样子都好看" },
    ],
    firstCharacterHints: [
      { lineId: "line-1", character: "水", cue: "晴日水光" },
      { lineId: "line-2", character: "山", cue: "雨里山色" },
      { lineId: "line-3", character: "欲", cue: "想把西湖比西子" },
      { lineId: "line-4", character: "淡", cue: "淡妆浓抹皆相宜" },
    ],
  }),

  "west-lake-xiao-chu-jing-ci-si": mastery({
    wholeMeaning: "杨万里清晨从净慈寺出来送林子方，看见六月西湖和别的季节不同：莲叶碧绿无边，荷花映着太阳，红得格外鲜明。",
    mainContent: "诗从六月的季节判断开始，把视线推向接天莲叶，再用阳光下的红荷花收住画面。",
    emotion: "惊喜、赞叹和明亮热烈的喜爱。",
    centralIdea: "六月的西湖有独特而开阔的夏日美景，满湖绿叶和红花让人一眼难忘。",
    lineMeanings: [
      lineMeaning("line-1", "这里是六月里的西湖，诗人先点出观察的地方和季节。", ["毕竟", "西湖", "六月"], "‘毕竟’不是在和谁争论，而是把话落回六月西湖。", "清晨走出寺门，眼前是一片夏日湖面。", "题目告诉了你什么时候、从哪里出来吗？"),
      lineMeaning("line-2", "六月西湖的风光，和一年中其他时节看到的样子不相同。", ["风光", "四时", "不同"], "‘四时’指春夏秋冬四季，不是一天里的四个时辰。", "同一座湖换了季节，颜色和气息随之改变。", "诗人为什么特别说六月‘不同’？"),
      lineMeaning("line-3", "莲叶一片连着一片，碧绿得没有尽头，好像铺到了天边。", ["接天", "莲叶", "无穷碧"], "莲叶没有真的碰到天空，‘接天’是把开阔范围写得很大。", "绿色莲叶从近处一直铺向远天。", "你能用手臂画出莲叶铺开的范围吗？"),
      lineMeaning("line-4", "阳光照在荷花上，花显出特别鲜明的红色，和绿叶相互映衬。", ["映日", "荷花", "别样红"], "‘别样红’不是另一种红色名称，而是格外鲜艳、不同寻常。", "太阳像一盏灯，把红荷花照得跳出来。", "绿叶和红花放在一起，画面为什么更亮？"),
    ],
    commonMisunderstandings: [
      { phrase: "四时", correction: "这里是春夏秋冬四季，不是四个小时。" },
      { phrase: "接天莲叶", correction: "是莲叶铺展得很开阔的夸张写法，不是真的碰到天。" },
      { phrase: "送林子方", correction: "题目交代送友的场景，正文重点写六月西湖的景色。" },
    ],
    memoryKeywords: [
      { lineId: "line-1", keywords: ["西湖", "六月"], cue: "先定季节和地方" },
      { lineId: "line-2", keywords: ["风光", "四时", "同"], cue: "六月与四季不同" },
      { lineId: "line-3", keywords: ["接天", "莲叶", "碧"], cue: "绿叶铺到天边" },
      { lineId: "line-4", keywords: ["映日", "荷花", "红"], cue: "太阳照亮红花" },
    ],
    firstCharacterHints: [
      { lineId: "line-1", character: "毕", cue: "六月西湖" },
      { lineId: "line-2", character: "风", cue: "风光不同" },
      { lineId: "line-3", character: "接", cue: "莲叶接天" },
      { lineId: "line-4", character: "映", cue: "荷花映日红" },
    ],
  }),

  "chengdu-chun-ye-xi-yu": mastery({
    wholeMeaning: "春雨在合适的时节悄悄来到夜里，安静地滋润万物。诗人写田野的黑、江船的灯和清晨湿润的花，写出成都春雨带来的喜悦。",
    mainContent: "诗按夜到晓的时间推进，先写雨的轻和无声，再写黑夜与船火，最后写雨后花朵的变化。",
    emotion: "喜悦、温柔和对滋润万物的欣慰。",
    centralIdea: "真正有用的改变不一定喧闹；春雨悄悄滋润万物，直到清晨才让成果显现。",
    lineMeanings: [
      lineMeaning("line-1", "这场雨来得正好，正是春天需要雨水的时候；‘知时节’是诗人的拟人说法。", ["好雨", "知时节"], "雨不会真的思考，‘知’是诗人欢迎它来得及时。", "春天刚需要水，细雨正好落下。", "你从哪一个词听出诗人喜欢这场雨？"),
      lineMeaning("line-2", "雨在春天开始落下，给正在生长的草木带来滋润。", ["当春", "乃", "发生"], "‘发生’在这里是开始降落、发生作用，不是发生了一件新闻。", "嫩芽刚醒来，春雨落在田野上。", "春雨和草木生长有什么关系？"),
      lineMeaning("line-3", "雨跟着风，悄悄在夜里来到，不惊动人。", ["随风", "潜入", "夜"], "‘潜入’不是雨偷偷做坏事，而是写它轻轻、悄无声息地来。", "夜风带着细雨进入安静的街巷。", "如果不看天空，你怎样发现雨来了？"),
      lineMeaning("line-4", "细雨没有大声音，却安静地滋润万物。", ["润物", "细", "无声"], "‘无声’不是完全没有任何雨声，而是强调雨轻柔、不喧闹。", "花草没有喊叫，却一点点吸饱水分。", "哪些变化很小声，却很重要？"),
      lineMeaning("line-5", "田野小路被乌云笼住，四周显得黑沉沉的。", ["野径", "云", "黑"], "‘俱黑’写夜雨中的天色，不是草木都被烧黑了。", "乌云压低，田间小路只剩轮廓。", "这一句让你知道夜有多深吗？"),
      lineMeaning("line-6", "江面上的船被黑夜包围，只有船灯独自明亮。", ["江船", "火", "独明"], "‘火’指船上的灯火，不是江面着火。", "黑色江面上，一盏暖黄船灯摇着。", "为什么一盏灯会让黑夜更明显？"),
      lineMeaning("line-7", "天亮后再看，红花都被春雨打湿了。", ["晓看", "红", "湿"], "不是清晨才开始下雨，而是到早晨才看见雨留下的结果。", "晨光里，花瓣挂着水珠。", "诗人为什么把花放到最后才写？"),
      lineMeaning("line-8", "花朵沾了雨水，枝头仿佛变沉；成都在雨后显出湿润的春色。", ["花重", "锦官城"], "‘重’读 zhòng，指沾雨后沉重，不是花开得多次。", "湿花低垂，整座成都像披上春雨。", "你能用动作演一演‘花重’吗？"),
    ],
    commonMisunderstandings: [
      { phrase: "知时节", correction: "是诗人的拟人和赞美，不是雨真的会判断日历。" },
      { phrase: "潜入夜", correction: "写雨来得轻、静，不是偷偷做坏事。" },
      { phrase: "花重", correction: "读 zhòng，花沾雨后显得沉重，不是花重复开放。" },
    ],
    memoryKeywords: [
      { lineId: "line-1", keywords: ["好雨", "时节"], cue: "及时的好雨" },
      { lineId: "line-2", keywords: ["当春", "发生"], cue: "春天开始滋润" },
      { lineId: "line-3", keywords: ["随风", "潜入夜"], cue: "夜里悄悄来" },
      { lineId: "line-4", keywords: ["润物", "无声"], cue: "安静地有作用" },
      { lineId: "line-5", keywords: ["野径", "俱黑"], cue: "田野乌云黑" },
      { lineId: "line-6", keywords: ["江船", "独明"], cue: "黑夜一盏灯" },
      { lineId: "line-7", keywords: ["晓看", "红湿"], cue: "天亮看湿花" },
      { lineId: "line-8", keywords: ["花重", "锦官城"], cue: "成都春色更湿润" },
    ],
    firstCharacterHints: [
      { lineId: "line-1", character: "好", cue: "先赞雨来得及时" },
      { lineId: "line-2", character: "当", cue: "正逢春天发生" },
      { lineId: "line-3", character: "随", cue: "随风入夜" },
      { lineId: "line-4", character: "润", cue: "润物无声" },
      { lineId: "line-5", character: "野", cue: "野径云黑" },
      { lineId: "line-6", character: "江", cue: "江船灯明" },
      { lineId: "line-7", character: "晓", cue: "晓看湿花" },
      { lineId: "line-8", character: "花", cue: "花重锦官城" },
    ],
  }),

  "chengdu-jueju-two-orioles": mastery({
    wholeMeaning: "诗人先听见翠柳上的黄鹂，看见白鹭飞上青天；再从窗里看远山积雪，从门边看远行的船。近处的小院把很远的山河也带进了眼前。",
    mainContent: "诗从近处的鸟和柳写起，向高空、远山和水路展开，用窗和门把近景与远景放在一幅画里。",
    emotion: "明快、开阔、欣喜，也有对远方山河和远行的想象。",
    centralIdea: "日常居所也能拥有开阔的视野，一扇窗、一扇门把生活和远方连接起来。",
    lineMeanings: [
      lineMeaning("line-1", "两只黄鹂在翠绿的柳树间鸣叫，近处先传来清脆声音。", ["两个", "黄鹂", "翠柳"], "‘两个’就是两只；‘鸣’是鸣叫，不是树在发声。", "两只黄鹂藏在嫩绿柳枝间唱歌。", "你先听见声音，还是先看见颜色？"),
      lineMeaning("line-2", "一行白鹭排着队飞向青蓝的天空，视线从柳树抬到高处。", ["一行", "白鹭", "青天"], "‘一行’指一列、一个队形，不是一次出行。", "白鹭排成斜线，越飞越高。", "这一句把眼睛从哪里带到哪里？"),
      lineMeaning("line-3", "从窗里望去，远处西岭积雪像保存了很久；‘千秋’写久远感觉。", ["窗含", "西岭", "千秋雪"], "窗不会真的把雪装进去，是说窗框把远山景色收进视野。", "窗框像画框，框住远处白雪山岭。", "窗为什么像一幅画的边框？"),
      lineMeaning("line-4", "门外停着从东吴方向来的远行船，‘万里’写路途遥远和视野开阔。", ["门泊", "东吴", "万里船"], "诗句写远方船的想象，不等于已经核实诗人走过万里水路。", "门边的船把目光送向很远很远的江河。", "门和窗分别把哪一种远方带来？"),
    ],
    commonMisunderstandings: [
      { phrase: "一行白鹭", correction: "‘行’读 háng，指白鹭排成一列，不是说它们去办一件事。" },
      { phrase: "窗含西岭", correction: "窗像画框收进远山，不是窗里真的装着雪山。" },
      { phrase: "千秋雪、万里船", correction: "是诗歌扩大时间和距离的写法，不是要核算一千年和一万里。" },
    ],
    memoryKeywords: [
      { lineId: "line-1", keywords: ["两个", "黄鹂", "翠柳"], cue: "近处柳间鸟声" },
      { lineId: "line-2", keywords: ["一行", "白鹭", "青天"], cue: "白鹭飞向高空" },
      { lineId: "line-3", keywords: ["窗", "西岭", "千秋雪"], cue: "窗框远山积雪" },
      { lineId: "line-4", keywords: ["门", "东吴", "万里船"], cue: "门边远行船" },
    ],
    firstCharacterHints: [
      { lineId: "line-1", character: "两", cue: "柳间黄鹂" },
      { lineId: "line-2", character: "一", cue: "白鹭上青天" },
      { lineId: "line-3", character: "窗", cue: "窗含西岭雪" },
      { lineId: "line-4", character: "门", cue: "门泊万里船" },
    ],
  }),

  "chang-an-chun-wang": mastery({
    wholeMeaning: "战乱破坏了长安的城市生活，但山河还在，草木仍在春天生长。杜甫看到花鸟想到时局和离散的家人，烽火让家书格外珍贵，忧愁也写到自己的白发。",
    mainContent: "诗从国家和城市写到花鸟、烽火、家书，最后落到白发，把时代的动荡写进一个人的生活。",
    emotion: "忧国、伤时、思念亲人和对战乱的痛苦。",
    centralIdea: "战争不只发生在地图和史书里，也会进入普通人的等待、家书和身体感受。",
    lineMeanings: [
      lineMeaning("line-1", "国家和城市遭到战乱破坏，但山河大地依然存在。", ["国破", "山河", "在"], "‘国破’不是说所有土地消失，而是说国家和城市秩序受损。", "残破的城与仍然存在的山河并置。", "这一句里什么被破坏，什么还在？"),
      lineMeaning("line-2", "春天来到城里，草木长得又深又密，也让人感到城市少了人声和照料。", ["城春", "草木", "深"], "‘深’写草木茂盛、荒深，不是城市变得更深。", "城墙边草木疯长，春色带着空寂。", "同样是春天，为什么这里不只是开心？"),
      lineMeaning("line-3", "想到动荡时局，眼前的花也让诗人伤心得流泪。", ["感时", "花", "泪"], "花不会真的流泪，是人的感情投向了眼前的花。", "春花仍开着，诗人却因时局伤心。", "为什么花越美，诗人反而越难过？"),
      lineMeaning("line-4", "想到亲人离散，鸟的鸣叫反而让诗人的心受到惊动。", ["恨别", "鸟", "惊心"], "鸟不是故意吓人，是诗人忧伤时听见鸟声的感受。", "鸟声穿过空城，让心猛地一紧。", "声音怎样把‘离别’带到心里？"),
      lineMeaning("line-5", "战争的烽火和消息连续了好几个月，局势一直没有平静。", ["烽火", "连", "三月"], "‘三月’写战事连续很久的感觉，不是轻松的春游月份。", "远处烽火不断，时间一天天过去。", "一个‘连’字让你感到战争怎样持续？"),
      lineMeaning("line-6", "在长期分离中，一封家人的来信珍贵得像价值万金。", ["家书", "抵", "万金"], "‘万金’是夸张，表达家书难得和思念深，不是在标价。", "一封薄薄家书被小心捧在手里。", "为什么一封纸会比金子还珍贵？"),
      lineMeaning("line-7", "诗人忧愁得不停抓挠白发，头发看起来越来越稀短。", ["白头", "搔", "更短"], "不是诗人拿剪刀把头发剪短，而是忧愁和衰老让它变稀短。", "手抓白发，发丝落在衣襟上。", "哪个动作让你看见诗人的焦急？"),
      lineMeaning("line-8", "白发太少太短，几乎连簪子都插不住；‘胜’是承受得住，读 shēng。", ["浑欲", "不胜", "簪"], "‘胜’不是胜负的胜，这里是承受；不是一句发型说明。", "簪子在稀短的白发中将要滑落。", "诗为什么最后写到一个小小的簪子？"),
    ],
    commonMisunderstandings: [
      { phrase: "花溅泪、鸟惊心", correction: "是诗人的感情和听觉感受，不是花鸟真的有人的情绪。" },
      { phrase: "家书抵万金", correction: "‘万金’是夸张，写家书在分离中的珍贵。" },
      { phrase: "不胜簪", correction: "‘胜’读 shēng，表示承受不住簪子，写白发稀短。" },
    ],
    memoryKeywords: [
      { lineId: "line-1", keywords: ["国破", "山河在"], cue: "国家破坏山河仍在" },
      { lineId: "line-2", keywords: ["城春", "草木深"], cue: "城中草木荒深" },
      { lineId: "line-3", keywords: ["感时", "花溅泪"], cue: "花景触发伤时" },
      { lineId: "line-4", keywords: ["恨别", "鸟惊心"], cue: "鸟声牵动离愁" },
      { lineId: "line-5", keywords: ["烽火", "连三月"], cue: "战事持续" },
      { lineId: "line-6", keywords: ["家书", "万金"], cue: "来信最珍贵" },
      { lineId: "line-7", keywords: ["白头", "搔", "更短"], cue: "忧愁抓白发" },
      { lineId: "line-8", keywords: ["不胜", "簪"], cue: "发短难插簪" },
    ],
    firstCharacterHints: [
      { lineId: "line-1", character: "国", cue: "国破山河在" },
      { lineId: "line-2", character: "城", cue: "城春草木深" },
      { lineId: "line-3", character: "感", cue: "感时花溅泪" },
      { lineId: "line-4", character: "恨", cue: "恨别鸟惊心" },
      { lineId: "line-5", character: "烽", cue: "烽火连三月" },
      { lineId: "line-6", character: "家", cue: "家书抵万金" },
      { lineId: "line-7", character: "白", cue: "白头搔更短" },
      { lineId: "line-8", character: "浑", cue: "浑欲不胜簪" },
    ],
  }),

  "chang-an-zi-ye-wu-ge-qiu-ge": mastery({
    wholeMeaning: "秋夜的月光照着长安，家家户户传来捣衣声。人们为远方征人准备衣物，也盼望战争结束、亲人回家；秋风吹不散这份牵挂。",
    mainContent: "诗先写一座城共同的月色和声音，再把视线伸向玉关边地，最后落到许多家庭等待远征亲人归来。",
    emotion: "秋夜的思念、担忧和盼望和平。",
    centralIdea: "宏大的边关和战争最终会进入普通家庭的声音、衣物和等待，月光把城内外的心连在一起。",
    lineMeanings: [
      lineMeaning("line-1", "一轮秋月的光铺在长安城上，整座城都被同一片月色照着。", ["长安", "一片月"], "‘一片月’不是只有一小片月亮，而是写月光笼罩整座城。", "月光同时落在长安许多屋顶上。", "同一轮月光下可能有多少户人家？"),
      lineMeaning("line-2", "许多家户传来捶打、整理衣物的声音，常被理解为为远方亲人准备寒衣。", ["万户", "捣衣声"], "‘捣衣’不是洗衣服，也不是游戏，是古人捶打布料使它柔软平整。", "家家灯下传来有节奏的捣衣声。", "为什么诗人先让我们听见声音？"),
      lineMeaning("line-3", "秋风一阵阵吹来，却怎么也吹不尽人们心里的牵挂。", ["秋风", "吹不尽"], "不是风真的吹不动什么，而是思念一直没有结束。", "风吹过长安，声音和思念仍留在屋里。", "什么东西比秋风更难吹走？"),
      lineMeaning("line-4", "这些不断的思念都汇成了对玉门关一带边地和远征亲人的感情。", ["总是", "玉关", "情"], "‘玉关’是诗中的边关意象，不等于诗人在那里亲眼所见。", "月光从长安伸向很远的边关。", "长安的声音怎样连到很远的玉关？"),
      lineMeaning("line-5", "诗人问什么时候才能平定边患、结束长期征战，盼望安宁。", ["何日", "平", "胡虏"], "这是对战争和安宁的追问，不是鼓励战争。", "远方烽烟渐停，问题仍悬在月下。", "一个‘何日’说明人们在等待什么？"),
      lineMeaning("line-6", "什么时候远征在外的人才能停止征战，回到家人身边；‘良人’主要指远征在外的丈夫。", ["良人", "罢", "远征"], "‘良人’在这里是亲人、丈夫，不是简单说一个品德很好的人。", "家人收起寒衣，等门外出现归来的脚步。", "最后一句最盼望哪一个动作发生？"),
    ],
    commonMisunderstandings: [
      { phrase: "捣衣", correction: "古人捶打布料使它柔软平整，常与准备寒衣、思念远人有关，不是洗衣。" },
      { phrase: "秋风吹不尽", correction: "吹不尽的是思念和牵挂，不是风力不够。" },
      { phrase: "良人", correction: "这里指远征在外的亲人、丈夫，不是一个抽象的‘好人’。" },
    ],
    memoryKeywords: [
      { lineId: "line-1", keywords: ["长安", "月"], cue: "全城共看秋月" },
      { lineId: "line-2", keywords: ["万户", "捣衣声"], cue: "家家传来声音" },
      { lineId: "line-3", keywords: ["秋风", "吹不尽"], cue: "风吹不走牵挂" },
      { lineId: "line-4", keywords: ["玉关", "情"], cue: "思念伸向边关" },
      { lineId: "line-5", keywords: ["何日", "平胡虏"], cue: "盼战争结束" },
      { lineId: "line-6", keywords: ["良人", "罢远征"], cue: "盼亲人回家" },
    ],
    firstCharacterHints: [
      { lineId: "line-1", character: "长", cue: "长安月色" },
      { lineId: "line-2", character: "万", cue: "万户捣衣" },
      { lineId: "line-3", character: "秋", cue: "秋风不尽情" },
      { lineId: "line-4", character: "总", cue: "总是玉关情" },
      { lineId: "line-5", character: "何", cue: "何日平胡虏" },
      { lineId: "line-6", character: "良", cue: "良人罢远征" },
    ],
  }),
};

/**
 * The first catalog review batch.  These records are deliberately kept in
 * the same small, line-oriented shape as the ten immersive units above, so a
 * reviewed catalog item can be promoted without inventing a second meaning
 * schema.  They are content-reviewed candidates, not additional immersive
 * places: the build layer adds the explicit `curated_content_v1` status.
 */
export const curatedMasteryContentByPoemId = {
  "yellow-crane-song-meng-hao-ran": {
    ...masteryContentByPoemId["yellow-crane-song-meng-hao-ran"],
    extension: {
      title: "目光送到江天尽头",
      text: "诗没有写‘我很难过’，而是让我们跟着一叶孤帆越看越远：船影消失以后，江水还在流。送别的情绪因此留在远方和空旷里。",
      prompt: "如果朋友要远行，你会用一个正在变远的景物，还是一个声音，来写你的不舍？",
    },
  },

  "west-lake-yin-hu-shang": {
    ...masteryContentByPoemId["west-lake-yin-hu-shang"],
    extension: {
      title: "晴雨都是西湖的表情",
      text: "诗人没有把晴天和雨天排成高下，而是先写水光、山色，再借西施的淡妆浓抹说明不同天气都有自己的好。读懂‘相宜’，可以从比较两幅画面开始。",
      prompt: "如果今天的天气是一种妆容或颜色，你会怎样形容它？请用诗里的一个景物作证。",
    },
  },

  "child-deng-guan-que-lou": mastery({
    wholeMeaning: "诗人登上鹳雀楼，看到夕阳沿山落下，黄河向大海流去；想把千里之外的景物看得更远，就要再登一层楼。",
    mainContent: "诗先写从高楼看到的日落和黄河，再由‘欲穷’与‘更上’把视线和行动推向更高、更远。",
    emotion: "开阔、向上和愿意继续探索的心情。",
    centralIdea: "站得更高，可能看见更大的世界；‘更上一层楼’既是诗中的登楼动作，也可以成为继续观察、学习的启发，不是任何问题都只有一个口号答案。",
    lineMeanings: [
      lineMeaning("line-1", "夕阳仿佛沿着远山慢慢落下，天边的光线在山后收拢。", ["白日", "依山", "尽"], "‘尽’写太阳落到山后、视线中的光线收尽，不是太阳被山吃掉。", "金色夕阳贴着远山下沉，山脊变成剪影。", "太阳落下时，你还能看见它的哪一部分？"),
      lineMeaning("line-2", "黄河水向着大海不停流去，视线从眼前的河流伸向远方。", ["黄河", "入海", "流"], "‘入海’写河流最终奔向大海，不表示鹳雀楼就在河流入海口。", "宽阔的河水越流越远，像一条路伸向海边。", "哪个词把眼前的河水带到了更远的地方？"),
      lineMeaning("line-3", "诗人想把千里之外的景色看得尽可能远。", ["欲穷", "千里目"], "‘穷’在这里是尽、看完，不是贫穷；‘千里’也有扩大视野的意味。", "诗人眯起眼睛，努力把远方收进视线。", "你想看得更远时，会先改变什么？"),
      lineMeaning("line-4", "再登高一层，眼前的视野会变得更开阔；它既是实景动作，也给继续探索留下了空间。", ["更上", "一层楼"], "这句不是保证登一层就能解决所有事情，而是用登楼写主动向上、继续看。", "脚步再向上，楼外的山河展开得更大。", "如果你再往高处走一步，会多看到什么？"),
    ],
    commonMisunderstandings: [
      { phrase: "白日依山尽", correction: "‘尽’写夕阳落到山后、视线中的光收尽，不是太阳消失在山里。" },
      { phrase: "欲穷千里目", correction: "‘穷’是尽、看完；不是贫穷，也不是必须真的看清一千里。" },
      { phrase: "更上一层楼", correction: "先是登楼的具体动作，再可以延伸为继续观察和学习，不强行解释成唯一成功公式。" },
    ],
    memoryKeywords: [
      { lineId: "line-1", keywords: ["白日", "依山尽"], cue: "夕阳沿山落" },
      { lineId: "line-2", keywords: ["黄河", "入海流"], cue: "河流向远方" },
      { lineId: "line-3", keywords: ["欲穷", "千里目"], cue: "想看得更远" },
      { lineId: "line-4", keywords: ["更上", "一层楼"], cue: "再登高一层" },
    ],
    firstCharacterHints: [
      { lineId: "line-1", character: "白", cue: "夕阳落山" },
      { lineId: "line-2", character: "黄", cue: "黄河远流" },
      { lineId: "line-3", character: "欲", cue: "想看千里" },
      { lineId: "line-4", character: "更", cue: "再上高楼" },
    ],
    extension: {
      title: "从一层楼看见更大的世界",
      text: "诗里的‘更上一层楼’首先是一个向上走的画面。它也能提醒我们：遇到看不清的事，可以换一个位置、补一点信息、再观察一次；孩子可以提出自己的启发，不必背一个固定答案。",
      prompt: "你最近有没有通过换位置、换方法或再试一次，看见原来没看见的东西？",
    },
  }),

  "child-zao-fa-bai-di-cheng": mastery({
    wholeMeaning: "清晨，诗人从云霞间的白帝城出发，顺江回到江陵；船行很快，猿声还在耳边，轻舟已经穿过层层山峡。",
    mainContent: "诗按顺江行舟推进：从高处的白帝城出发，经过猿声回响的峡江，最后用‘已过万重山’写出轻快速度和心情。",
    emotion: "获释归途中的轻快、惊喜和对自由行舟的畅快。",
    centralIdea: "空间距离、声音和速度一起写出归途的轻快；‘千里一日’是诗歌中的夸张和体验，不等于可直接复原的交通时刻表。",
    lineMeanings: [
      lineMeaning("line-1", "清晨，诗人告别高高的白帝城；彩云环绕城郭，仿佛城在云霞之间。", ["朝辞", "白帝", "彩云间"], "‘朝’读 zhāo，指早晨；‘彩云间’写白帝城高和云霞环绕，不是城漂在云里。", "晨光和云霞托着山城，船从高处向江面出发。", "你从哪两个词看出出发的时间和地点？"),
      lineMeaning("line-2", "从白帝城到江陵路途很远，诗人感觉顺流的船一天就能抵达。", ["千里", "江陵", "一日还"], "‘还’读 huán，是返回；‘千里一日’夸张地写船行极快和心情轻快，不是精确里程表。", "江水推着小舟向下游飞快前进。", "如果旅途很顺，你会用哪个动作词写速度？"),
      lineMeaning("line-3", "两岸山间猿猴的叫声连续不断，回声随着船行一路传来。", ["两岸", "猿声", "啼不住"], "‘啼不住’写叫声不断，不是说猿猴永远不会停下来。", "狭长峡谷把猿声从左岸、右岸一阵阵送到船上。", "声音为什么能让你感觉两岸很近？"),
      lineMeaning("line-4", "猿声还没停，轻快的小船已经穿过层层山峰，行程显得非常迅疾。", ["轻舟", "已过", "万重山"], "‘重’读 chóng，表示层层叠叠；‘万重山’是夸张的山势感，不是实际数山。", "小船划过一道峡口，身后的重山迅速退到远处。", "哪一个词最能让你感觉船快？"),
    ],
    commonMisunderstandings: [
      { phrase: "朝辞", correction: "‘朝’读 zhāo，表示清晨；不是朝代的 cháo。" },
      { phrase: "一日还", correction: "‘还’读 huán，指返回；‘千里一日’是顺流快行的诗意夸张。" },
      { phrase: "万重山", correction: "‘重’读 chóng，表示层层；‘万’写山多、山势连续，不是逐座清点。" },
    ],
    memoryKeywords: [
      { lineId: "line-1", keywords: ["朝辞", "白帝", "彩云"], cue: "清晨云中出发" },
      { lineId: "line-2", keywords: ["千里", "江陵", "一日还"], cue: "顺流快速返回" },
      { lineId: "line-3", keywords: ["两岸", "猿声"], cue: "峡谷回响猿声" },
      { lineId: "line-4", keywords: ["轻舟", "已过", "万重山"], cue: "小舟飞过群山" },
    ],
    firstCharacterHints: [
      { lineId: "line-1", character: "朝", cue: "清晨离开白帝城" },
      { lineId: "line-2", character: "千", cue: "千里一日归" },
      { lineId: "line-3", character: "两", cue: "两岸猿声" },
      { lineId: "line-4", character: "轻", cue: "轻舟过山" },
    ],
    extension: {
      title: "让声音追不上小船",
      text: "诗把猿声和船速放在一起：耳朵还听着两岸回声，眼前的船已经越过许多山。空间、声音和心情同时加速，才有‘归来如飞’的感觉。",
      prompt: "如果用三个镜头表现‘船很快’，你会先拍哪里，再让什么声音留在身后？",
    },
  }),

  "child-liang-zhou-ci": mastery({
    wholeMeaning: "诗人把黄河、白云、孤城和万仞山写成苍茫的边地画面，又听见羌笛吹《杨柳》曲，想到玉门关外春风难至、戍边人的乡愁和无奈。",
    mainContent: "前两句从大河和高山铺开边地尺度，后两句由笛声和杨柳曲转入人的情绪；‘春风不度’既是自然感受，也带有边关隔绝的象征意味。",
    emotion: "苍凉、孤寂和对远方春意与家乡的牵挂。",
    centralIdea: "宏阔的山河并不遮住人的心事；一支笛曲让边关的距离、季节和思念同时被听见。",
    lineMeanings: [
      lineMeaning("line-1", "黄河像从远方白云之间伸展而来，视线沿着河流拉向高处和远处。", ["黄河", "远上", "白云间"], "‘远上’是诗人的远望构图，不是说黄河真的向天空上游。", "黄河在苍茫天际延伸，像从白云深处来。", "你觉得视线是沿河向远处，还是向天空抬起？"),
      lineMeaning("line-2", "一座孤零零的城池被高高的山群围在其中，边地显得空旷而险峻。", ["一片孤城", "万仞山"], "‘万仞’写山高的夸张感，‘孤城’突出环境中的孤单，不是说城里没有一个人。", "小城被一圈高山包住，天地显得很大。", "把城和山放在一起，谁更大、谁更孤单？"),
      lineMeaning("line-3", "羌笛吹起《杨柳》曲，诗人劝它不必为离情哀怨；曲名中的杨柳不只是眼前一棵树。", ["羌笛", "何须", "怨杨柳"], "‘杨柳’常与古曲《折杨柳》及送别、思乡情绪相连，不等于笛子在责怪柳树。", "夜色里的笛声穿过城墙和山口，带来熟悉又遥远的曲调。", "一支曲子怎样让你想到远方的人？"),
      lineMeaning("line-4", "诗人说春风似乎吹不到玉门关外，边地的春意和家乡相隔很远。", ["春风", "不度", "玉门关"], "‘不度’不是天气报告，‘春风’也不一定只指风；它把边地的寒凉、隔绝和盼春写在一起。", "关外山地仍显冷峻，春意停在关内外的距离上。", "如果春风能带来消息，它会从哪里吹到哪里？"),
    ],
    commonMisunderstandings: [
      { phrase: "黄河远上", correction: "是从远处望黄河、让河流伸向天际的构图，不是河水倒着向高处流。" },
      { phrase: "羌笛怨杨柳", correction: "‘杨柳’还关联古曲《折杨柳》和送别情绪，不是笛声真的在责怪柳树。" },
      { phrase: "春风不度", correction: "是边关隔绝与思乡的诗意表达，不要当作玉门关永远没有风的气象事实。" },
    ],
    memoryKeywords: [
      { lineId: "line-1", keywords: ["黄河", "白云间"], cue: "河流伸向远天" },
      { lineId: "line-2", keywords: ["孤城", "万仞山"], cue: "小城被高山围住" },
      { lineId: "line-3", keywords: ["羌笛", "杨柳"], cue: "笛声牵出离情" },
      { lineId: "line-4", keywords: ["春风", "玉门关"], cue: "春意隔在关外" },
    ],
    firstCharacterHints: [
      { lineId: "line-1", character: "黄", cue: "黄河远望" },
      { lineId: "line-2", character: "一", cue: "孤城高山" },
      { lineId: "line-3", character: "羌", cue: "边地笛声" },
      { lineId: "line-4", character: "春", cue: "春风不到关外" },
    ],
    extension: {
      title: "一支笛子里的边地距离",
      text: "这首诗不是一张气象地图，而是一幅把山河尺度和人的感受叠在一起的边塞画。孩子可以先听笛声、看孤城，再思考为什么‘春风’会变成想家的语言。",
      prompt: "什么声音会让你想起一个不在身边的人或地方？它带来了什么画面？",
    },
  }),

  "child-song-yuan-er-an-xi": mastery({
    wholeMeaning: "清晨的细雨洗过渭城，客舍旁的柳色显得清新。王维为即将出使安西的朋友元二饯行，请他再喝一杯，因为出了阳关，可能很久遇不到老朋友。",
    mainContent: "诗从雨后渭城的清新景色写起，镜头转到酒席和朋友，再由阳关把眼前的送别推向遥远边地。",
    emotion: "温柔、克制而深长的惜别与牵挂。",
    centralIdea: "一杯酒不是简单劝饮，而是朋友在出发前用短暂相聚面对漫长旅途；‘无故人’写的是远行后的孤单可能，不是说安西绝对没有任何人。",
    lineMeanings: [
      lineMeaning("line-1", "清晨的雨落在渭城，洗去道路上的尘土，只留下轻轻的湿润。", ["渭城", "朝雨", "浥轻尘"], "‘朝’读 zhāo，指早晨；‘浥’读 yì，是沾湿、润湿，不是大雨冲刷。", "雨后青石路干净湿亮，尘土被轻轻压下。", "你从哪个词听出这场雨很轻？"),
      lineMeaning("line-2", "客舍旁的柳树在雨后更青，柳色显出新鲜的春意。", ["客舍", "青青", "柳色新"], "‘客舍’是旅店，不是客人家的房子；柳色也在送别语境里牵出离情。", "旅店外的柳枝带着水珠，颜色清新。", "为什么送别诗常让柳树出现在路边？"),
      lineMeaning("line-3", "请朋友再把这一杯酒喝完，把眼前相聚的时间再延长一点。", ["劝君", "更尽", "一杯酒"], "‘更尽’是再饮尽一杯，不是催朋友喝很多；‘一’读 yì。", "朋友停下话头，再举一次酒杯。", "‘再’这个动作让告别变长了多久？"),
      lineMeaning("line-4", "出了阳关向西远行，老朋友可能很难再相逢。", ["西出", "阳关", "无故人"], "‘故人’是老朋友；‘无故人’写远行后的孤独和难遇知交，不是说关外绝对没有人。", "马车或行舟越过关口，回头的人影渐远。", "哪一个方向把送别从眼前带到远方？"),
    ],
    commonMisunderstandings: [
      { phrase: "朝雨浥轻尘", correction: "‘朝’读 zhāo，‘浥’读 yì；写清晨细雨润湿尘土，不是暴雨。" },
      { phrase: "更尽一杯酒", correction: "‘更’是再、又，‘尽’是喝完；是在告别前珍惜最后的相聚。" },
      { phrase: "无故人", correction: "指很难遇到老朋友、知心人，不是安西没有任何人居住。" },
    ],
    memoryKeywords: [
      { lineId: "line-1", keywords: ["渭城", "朝雨", "浥"], cue: "清晨细雨洗尘" },
      { lineId: "line-2", keywords: ["客舍", "柳色新"], cue: "旅店外的青柳" },
      { lineId: "line-3", keywords: ["劝君", "一杯酒"], cue: "再留一会儿" },
      { lineId: "line-4", keywords: ["西出", "阳关", "故人"], cue: "出关后路远人稀" },
    ],
    firstCharacterHints: [
      { lineId: "line-1", character: "渭", cue: "渭城清晨雨" },
      { lineId: "line-2", character: "客", cue: "客舍柳色新" },
      { lineId: "line-3", character: "劝", cue: "再饮一杯" },
      { lineId: "line-4", character: "西", cue: "西出阳关" },
    ],
    extension: {
      title: "一杯酒的长度",
      text: "送别不一定要大声哭喊，雨、柳色、酒杯和一个方向就足以让人感觉到离开。诗把‘再坐一会儿’写成一杯酒的长度，把短暂相聚和漫长远行放在一起。",
      prompt: "你会选什么小动作，来表达‘我还想和你多待一会儿’？",
    },
  }),

  "child-jiu-yue-jiu-ri": mastery({
    wholeMeaning: "王维独自在长安等地做客，每到重阳这样的节日就更加想念亲人。他想象远方的兄弟们登高、佩戴茱萸，却因为少了自己而不完整。",
    mainContent: "诗先写诗人身在异乡的孤单，再把视线越过距离，想象家乡兄弟重阳登高的画面，最后用‘少一人’收束思念。",
    emotion: "节日里的孤独、思亲和想象中的温暖。",
    centralIdea: "距离让节日习俗既热闹又显出缺席；诗人没有只说自己想家，而是想象亲人如何过节，把思念写成两地相望。",
    lineMeanings: [
      lineMeaning("line-1", "诗人独自待在别人的地方，作为异乡客人，身份和心情都显得孤单。", ["独在", "异乡", "异客"], "‘异乡’是离开家乡的地方，不限定为今天某一个省；‘异客’不是奇怪的客人。", "一个人站在陌生城市的街道上，周围很热闹，身边却没有家人。", "‘独’字让画面少了谁？"),
      lineMeaning("line-2", "每逢重阳这样的节日，平常的思念会比平日更强烈。", ["每逢", "佳节", "倍思亲"], "‘倍’是更加、加倍，不是思念被量成一个固定数字。", "节日人家都在团聚，诗人更清楚地感到自己的远离。", "为什么节日会把想家放大？"),
      lineMeaning("line-3", "诗人在远方想象兄弟们一起登上高处过重阳。", ["遥知", "兄弟", "登高处"], "‘遥知’说明这是远方的想象和牵挂，不是诗人眼前亲眼看见。", "想象中的兄弟们沿山路登高，衣角被秋风吹起。", "你能在脑中把家乡的画面放到远方吗？"),
      lineMeaning("line-4", "兄弟们遍身佩戴茱萸，只有诗人没有在其中，所以少了一个人。", ["遍插", "茱萸", "少一人"], "‘少一人’指少了诗人自己；茱萸是重阳习俗中的植物，不是普通装饰。", "山顶的人群里留着一个空位，大家都知道那是远方亲人的位置。", "最后一句写的是谁不在场？"),
    ],
    commonMisunderstandings: [
      { phrase: "异客", correction: "指身在异乡的客人，不是性格奇怪的人。" },
      { phrase: "山东", correction: "题目中的‘山东’通常解释为华山以东的家乡方向，不直接等同于今天的山东省。" },
      { phrase: "少一人", correction: "少的是远在异乡的诗人自己；它把思念落在一个具体的缺席位置上。" },
    ],
    memoryKeywords: [
      { lineId: "line-1", keywords: ["独在", "异乡", "异客"], cue: "一个人在异乡" },
      { lineId: "line-2", keywords: ["佳节", "倍思亲"], cue: "节日更想家" },
      { lineId: "line-3", keywords: ["遥知", "兄弟登高"], cue: "想象远方兄弟" },
      { lineId: "line-4", keywords: ["茱萸", "少一人"], cue: "习俗里留下空位" },
    ],
    firstCharacterHints: [
      { lineId: "line-1", character: "独", cue: "异乡独处" },
      { lineId: "line-2", character: "每", cue: "佳节思亲" },
      { lineId: "line-3", character: "遥", cue: "想象远方" },
      { lineId: "line-4", character: "遍", cue: "茱萸少一人" },
    ],
    extension: {
      title: "节日地图上的一个空位",
      text: "这首诗让我们同时看见两个地点：诗人在异乡，兄弟在家乡。重阳的登高和茱萸把两地连起来，而‘少一人’让远方的思念变成一个看得见的空位。",
      prompt: "如果给远方的家人画一张节日地图，你会在地图上标出什么联系两地的东西？",
    },
  }),

  "child-bo-chuan-gua-zhou": mastery({
    wholeMeaning: "王安石把船停在瓜洲，望见京口和钟山都在江南一带；春风吹绿江南岸，他却问明月什么时候照着自己回去，写出旅途中的归乡愿望。",
    mainContent: "诗从瓜洲、京口、钟山的近远关系写起，再用‘绿’让春风变成有动作的颜色，最后回到等待归期的心情。",
    emotion: "江南春色中的乡愁、牵挂和想回家的愿望。",
    centralIdea: "一江、几重山和一轮明月把地理距离写成心里的距离；美丽的春色并没有消除归乡愿望，反而让‘还’更清楚。",
    lineMeanings: [
      lineMeaning("line-1", "京口和瓜洲隔着一条水道，水面看似不宽，却把两处地点分开。", ["京口", "瓜洲", "一水间"], "‘间’读 jiān，是中间、相隔；不是时间的 jiàn，也不是说两地没有水路联系。", "船停在瓜洲，隔着江水望向对岸的京口。", "哪一个词告诉你两地之间隔着什么？"),
      lineMeaning("line-2", "钟山仿佛只隔着几重山，距离在诗人眼中并不遥远，却仍未能立刻回去。", ["钟山", "只隔", "数重山"], "‘数’读 shù，表示几、几重；‘重’读 chóng，表示层层山岭。", "山一层叠着一层，挡住了回家的视线。", "‘只隔’听起来近，为什么还不能马上到？"),
      lineMeaning("line-3", "春风又一次吹绿江南两岸；‘绿’把风带来的季节变化写成了有力的动作。", ["春风", "又绿", "江南岸"], "‘绿’在这里是使……变绿的动词，不只是颜色名称；不必说风真的染色。", "春风掠过江岸，草木从灰褐变成一片新绿。", "如果把‘绿’换成‘吹’，画面会少掉什么？"),
      lineMeaning("line-4", "明月什么时候才能照着我回到故乡？诗人把归期交给月亮来追问。", ["明月", "何时", "还"], "‘还’读 huán，是回去；‘何时’表达等待，不是已经安排好日期。", "月光照在船头，诗人望着回家的方向。", "月亮为什么像一个陪你等消息的人？"),
    ],
    commonMisunderstandings: [
      { phrase: "一水间", correction: "‘间’读 jiān，表示中间、相隔；不要读成时间的 jiàn。" },
      { phrase: "又绿江南岸", correction: "‘绿’是使动用法，写春风带来草木变绿的过程，不只是静态颜色。" },
      { phrase: "照我还", correction: "‘还’读 huán，表示返回；诗人是在问归期，不是说月亮会替他走路。" },
    ],
    memoryKeywords: [
      { lineId: "line-1", keywords: ["京口", "瓜洲", "一水间"], cue: "江水隔着两处" },
      { lineId: "line-2", keywords: ["钟山", "数重山"], cue: "山层挡住归路" },
      { lineId: "line-3", keywords: ["春风", "又绿"], cue: "春风染绿江岸" },
      { lineId: "line-4", keywords: ["明月", "何时还"], cue: "月下问归期" },
    ],
    firstCharacterHints: [
      { lineId: "line-1", character: "京", cue: "京口瓜洲" },
      { lineId: "line-2", character: "钟", cue: "钟山隔重山" },
      { lineId: "line-3", character: "春", cue: "春风又绿" },
      { lineId: "line-4", character: "明", cue: "明月照归人" },
    ],
    extension: {
      title: "‘绿’是春风留下的动作",
      text: "诗人没有只说江南很绿，而是说春风‘又绿’江南岸，让季节变化像一个正在发生的动作。可是眼前越美，等待回家的心也越清楚。",
      prompt: "你能用一个动词写出季节改变身边景物的过程吗？",
    },
  }),

  "child-ci-bei-gu-shan-xia": mastery({
    wholeMeaning: "王湾行舟经过北固山下，看到潮水上涨让两岸显得开阔，风正好把船帆悬起；夜还没有结束，海上太阳已经升起，江南春意进入旧年，诗人借归雁把家书送向洛阳。",
    mainContent: "诗沿水路从行舟、潮汐和船帆写到日出、江春，再由归雁转入对洛阳故乡的思念；空间和时间一起向前。",
    emotion: "旅途中的开阔、对新年的感受和淡淡乡愁。",
    centralIdea: "自然的潮、风、日和春把旅程推向前方，人的家书和思念却仍指向故乡；开阔景象与乡愁可以同时存在。",
    lineMeanings: [
      lineMeaning("line-1", "旅人的道路伸向青山之外。", ["客路", "青山外"], "‘客路’是旅途，不是客人的一条专用道路。", "小船外的青山一层层展开，路还在远方。", "你从哪个词看出诗人正在路上？"),
      lineMeaning("line-2", "行船在碧绿的水面前进，诗人的视线贴着水路向前。", ["行舟", "绿水前"], "‘行舟’是行进中的船，先写位置和动作，不是停船看水。", "船头划开绿水，水路在青山前延伸。", "船正在怎样移动？"),
      lineMeaning("line-3", "潮水上涨后，水面似乎与两岸齐平，江面显得更加宽阔。", ["潮平", "两岸阔"], "不是两岸真的移动变远，而是水位和视线共同造成开阔感。", "潮水漫上来，左右两岸被拉成更远的两条线。", "水面变宽会让船看起来更自由吗？"),
      lineMeaning("line-4", "风向端正，船帆高高悬起，船行得平稳而有力。", ["风正", "一帆悬"], "‘正’写风向合适，不是正午的‘正’；‘悬’写帆张起的样子。", "一面白帆被风托住，船身稳稳向前。", "哪一个词让你感觉风正在帮船？"),
      lineMeaning("line-5", "海上的太阳在残夜将尽时升起，新的光线从黑暗边缘出现。", ["海日", "生", "残夜"], "‘海日’是海上升起的太阳，‘生’写出生、升起，不是太阳被制造出来。", "夜色尚未全退，海面先亮出一轮日光。", "光和黑夜在这句里怎样交接？"),
      lineMeaning("line-6", "江南的春意闯入还没有过去的旧年，时间像在船行中交替。", ["江春", "入", "旧年"], "‘入’是进入、来到；不是说春天真的走进一间屋子。", "旧年最后一夜的水面上，嫩绿的春色已经到来。", "这句为什么让新旧年份像碰面一样？"),
      lineMeaning("line-7", "写给家乡的书信要托谁送到？诗人把疑问留在旅途上。", ["乡书", "何处达"], "‘达’是送到、抵达；这句没有给出现代邮寄路线。", "诗人望着远方，想着一封信怎样回家。", "你会把信交给谁？"),
      lineMeaning("line-8", "诗人想到归雁飞向洛阳，把家乡的方向托付给雁影。", ["归雁", "洛阳边"], "这是借归雁寄托家书和思念的诗意想象，不等于古人真的把信绑在雁脚上。", "大雁向北飞，船上的人目光追着它去洛阳。", "你会让什么沿哪条路回家？"),
    ],
    commonMisunderstandings: [
      { phrase: "次北固山下", correction: "题目里的‘次’是停留、驻扎，不是第二次；诗人停舟在北固山附近。" },
      { phrase: "海日生残夜", correction: "‘生’写太阳从将尽的夜里升起，是明暗交替的画面，不是太阳被制造。" },
      { phrase: "归雁洛阳边", correction: "是借归雁寄托家书和思念的想象，不等于古人真的把信绑在雁脚上。" },
    ],
    memoryKeywords: [
      { lineId: "line-1", keywords: ["客路", "青山外"], cue: "旅路伸向青山" },
      { lineId: "line-2", keywords: ["行舟", "绿水"], cue: "船行绿水前" },
      { lineId: "line-3", keywords: ["潮平", "两岸阔"], cue: "潮涨水面开阔" },
      { lineId: "line-4", keywords: ["风正", "一帆悬"], cue: "顺风帆起" },
      { lineId: "line-5", keywords: ["海日", "残夜"], cue: "日出夜将尽" },
      { lineId: "line-6", keywords: ["江春", "入旧年"], cue: "春意进入旧年" },
      { lineId: "line-7", keywords: ["乡书", "何处达"], cue: "家书问归路" },
      { lineId: "line-8", keywords: ["归雁", "洛阳"], cue: "借雁寄家书" },
    ],
    firstCharacterHints: [
      { lineId: "line-1", character: "客", cue: "客路青山外" },
      { lineId: "line-2", character: "行", cue: "行舟绿水前" },
      { lineId: "line-3", character: "潮", cue: "潮平岸阔" },
      { lineId: "line-4", character: "风", cue: "风正帆悬" },
      { lineId: "line-5", character: "海", cue: "海日破夜" },
      { lineId: "line-6", character: "江", cue: "江春入年" },
      { lineId: "line-7", character: "乡", cue: "乡书问达" },
      { lineId: "line-8", character: "归", cue: "归雁洛阳" },
    ],
    extension: {
      title: "一条水路，两种方向",
      text: "船在向前，春天也在向前，可诗人的心仍朝向洛阳。诗用潮、风、日出写旅途的开阔，再用一封想寄出的家书把视线拉回故乡。",
      prompt: "你有没有一边去往新地方，一边想念原来的家？用一个景物说说这种感觉。",
    },
  }),

  "child-le-you-yuan": mastery({
    wholeMeaning: "傍晚时诗人心情不太舒畅，驾车登上长安城南的乐游原。夕阳景色无限美好，可它已经接近黄昏，也提醒人们美好时刻正在走向结束。",
    mainContent: "前两句交代心情和登原的行动，后两句把视线放到夕阳，从赞叹美景转为对时间将尽的感受。",
    emotion: "欣赏夕阳时的惆怅、珍惜和对时间流逝的敏感。",
    centralIdea: "美和结束可以同时出现；‘只是近黄昏’不是把美好否定掉，而是让赞叹里多了一层时间感。",
    lineMeanings: [
      lineMeaning("line-1", "傍晚时分，诗人的心情有些不舒畅、郁闷。", ["向晚", "意", "不适"], "‘不适’读 bù shì，指心情不舒畅，不是身体受伤或不适合做事。", "暮色将近，诗人一个人感到心事沉沉。", "‘向晚’和‘不适’分别写时间和心情，你先注意到哪一个？"),
      lineMeaning("line-2", "诗人驾车登上长安城南的乐游原，想借较高的地方舒展心情、看一看远景。", ["驱车", "登", "古原"], "‘古原’不是随便一块旧土地，诗中指乐游原这一处历史游览地。", "车沿坡道向上，城市和远方在脚下展开。", "为什么心情不好时，登高看远会有帮助？"),
      lineMeaning("line-3", "夕阳的景色非常美好，让诗人忍不住赞叹。", ["夕阳", "无限好"], "‘无限好’写当下的美，不是在说夕阳永远不会落下。", "红金色的光铺满远山和城郭，天空亮得温柔。", "你会用哪种颜色形容这时的夕阳？"),
      lineMeaning("line-4", "只是此刻已经接近黄昏，美景也带着将要结束的时间感。", ["只是", "近", "黄昏"], "‘只是’不是否定夕阳美，而是补上一层临近结束的感受。", "太阳越往下，光越美，也越让人舍不得。", "美好的东西快结束时，你的感受会怎样变化？"),
    ],
    commonMisunderstandings: [
      { phrase: "意不适", correction: "‘不适’读 bù shì，这里主要写心情不舒畅，不是身体不舒服。" },
      { phrase: "古原", correction: "它与题目‘乐游原’相连，是长安城南的历史游览地，不是普通荒原。" },
      { phrase: "只是近黄昏", correction: "‘只是’补充时间将尽，并没有抹掉夕阳的美；美好与惆怅可以并存。" },
    ],
    memoryKeywords: [
      { lineId: "line-1", keywords: ["向晚", "意不适"], cue: "傍晚心情郁闷" },
      { lineId: "line-2", keywords: ["驱车", "登古原"], cue: "登高看远" },
      { lineId: "line-3", keywords: ["夕阳", "无限好"], cue: "眼前美景" },
      { lineId: "line-4", keywords: ["只是", "近黄昏"], cue: "美景将近结束" },
    ],
    firstCharacterHints: [
      { lineId: "line-1", character: "向", cue: "向晚心不适" },
      { lineId: "line-2", character: "驱", cue: "驱车登原" },
      { lineId: "line-3", character: "夕", cue: "夕阳无限好" },
      { lineId: "line-4", character: "只", cue: "只是近黄昏" },
    ],
    extension: {
      title: "美好为什么让人舍不得",
      text: "这首诗常被只截取‘夕阳无限好’，但后一句提醒我们：美景正因为有时间边界，才让人更愿意认真观看。孩子可以从自己的经验说出珍惜，不必把诗压成悲观结论。",
      prompt: "有没有一个‘快要结束、所以更想认真看’的时刻？你会怎样描述它？",
    },
  }),
};

export const phase1MasteryPoemIds = Object.keys(masteryContentByPoemId);

export default masteryContentByPoemId;
