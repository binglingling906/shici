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

function mastery({ wholeMeaning, mainContent, emotion, centralIdea, lineMeanings, commonMisunderstandings, memoryKeywords, firstCharacterHints }) {
  return {
    wholeMeaning,
    mainContent,
    emotion,
    centralIdea,
    lineMeanings,
    commonMisunderstandings,
    memoryKeywords,
    firstCharacterHints,
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

export const phase1MasteryPoemIds = Object.keys(masteryContentByPoemId);

export default masteryContentByPoemId;
