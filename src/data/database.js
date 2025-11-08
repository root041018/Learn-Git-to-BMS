/**
 * 模拟数据库模块
 * 包含用户、图书、分类等基础数据
 */

export const database = {
  // 用户数据列表（保持不变）
  users: [
    {
      id: 1,
      username: 'admin',
      password: '123456',
      role: 'admin',
      email: 'admin@example.com',
      createTime: '2024-01-01'
    },
    {
      id: 2,
      username: 'librarian',
      password: '123456',
      role: 'admin',
      email: 'librarian@example.com',
      createTime: '2024-01-15'
    },
    { id: 3, username: 'user1', password: '123456', role: 'user', email: 'user1@example.com', createTime: '2024-02-01' },
    { id: 4, username: 'user2', password: '123456', role: 'user', email: 'user2@example.com', createTime: '2024-02-15' },
    { id: 5, username: 'user3', password: '123456', role: 'user', email: 'user3@example.com', createTime: '2024-03-01' },
    { id: 6, username: 'user4', password: '123456', role: 'user', email: 'user4@example.com', createTime: '2024-03-15' },
    { id: 7, username: 'user5', password: '123456', role: 'user', email: 'user5@example.com', createTime: '2024-04-01' },
    { id: 8, username: 'user6', password: '123456', role: 'user', email: 'user6@example.com', createTime: '2024-04-15' },
    { id: 9, username: 'user7', password: '123456', role: 'user', email: 'user7@example.com', createTime: '2024-05-01' },
    { id: 10, username: 'user8', password: '123456', role: 'user', email: 'user8@example.com', createTime: '2024-05-15' }
  ],

  // 扩展后的图书信息列表（共50本）
  books: [
    // 原有图书
    {
      id: 1,
      name: 'JavaScript高级程序设计',
      author: 'Nicholas C. Zakas',
      category: '计算机科学',
      description: '详细讲解JavaScript语言核心与实践的经典著作',
      isbn: '9787115545381',
      price: 119.00,
      stock: 10,
      borrowCount: 25,
      createTime: '2024-01-01'
    },
    {
      id: 2,
      name: '百年孤独',
      author: '加西亚·马尔克斯',
      category: '文学艺术',
      description: '魔幻现实主义文学代表作',
      isbn: '9787544253994',
      price: 59.90,
      stock: 5,
      borrowCount: 18,
      createTime: '2024-01-02'
    },
    {
      id: 3,
      name: '时间简史',
      author: '史蒂芬·霍金',
      category: '自然科学',
      description: '探索宇宙奥秘的科普经典',
      isbn: '9787535732309',
      price: 45.00,
      stock: 8,
      borrowCount: 30,
      createTime: '2024-01-03'
    },
    {
      id: 4,
      name: '经济学原理',
      author: '曼昆',
      category: '经济管理',
      description: '经济学入门经典教材',
      isbn: '9787301145448',
      price: 88.00,
      stock: 12,
      borrowCount: 15,
      createTime: '2024-01-04'
    },
    {
      id: 5,
      name: 'Vue.js设计与实现',
      author: '霍春阳',
      category: '计算机科学',
      description: '深入解析Vue.js原理的技术书籍',
      isbn: '9787115583864',
      price: 89.00,
      stock: 15,
      borrowCount: 20,
      createTime: '2024-01-05'
    },

    // 新增计算机科学类图书（6-12）
    {
      id: 6,
      name: 'Python编程：从入门到实践',
      author: '埃里克·马瑟斯',
      category: '计算机科学',
      description: '适合初学者的Python入门教程，包含实际项目练习',
      isbn: '9787115428028',
      price: 89.00,
      stock: 18,
      borrowCount: 42,
      createTime: '2024-01-06'
    },
    {
      id: 7,
      name: '数据结构与算法分析',
      author: '马克·艾伦·维斯',
      category: '计算机科学',
      description: '系统讲解数据结构与算法的经典教材',
      isbn: '9787115546081',
      price: 108.00,
      stock: 7,
      borrowCount: 28,
      createTime: '2024-01-07'
    },
    {
      id: 8,
      name: 'Java编程思想',
      author: '布鲁斯·埃克尔',
      category: '计算机科学',
      description: 'Java程序员必看的经典著作',
      isbn: '9787111213826',
      price: 108.00,
      stock: 9,
      borrowCount: 35,
      createTime: '2024-01-08'
    },
    {
      id: 9,
      name: '深入理解计算机系统',
      author: '兰德尔·布莱恩特',
      category: '计算机科学',
      description: '从硬件到软件全面解析计算机系统的著作',
      isbn: '9787111544937',
      price: 128.00,
      stock: 6,
      borrowCount: 22,
      createTime: '2024-01-09'
    },
    {
      id: 10,
      name: 'React实战',
      author: '亚历克斯·班克斯',
      category: '计算机科学',
      description: 'React框架开发实战指南',
      isbn: '9787115547521',
      price: 89.00,
      stock: 12,
      borrowCount: 18,
      createTime: '2024-01-10'
    },
    {
      id: 11,
      name: '数据库系统概念',
      author: '亚伯拉罕·西尔伯沙茨',
      category: '计算机科学',
      description: '数据库领域的经典教材',
      isbn: '9787111544616',
      price: 128.00,
      stock: 8,
      borrowCount: 24,
      createTime: '2024-01-11'
    },
    {
      id: 12,
      name: '机器学习',
      author: '周志华',
      category: '计算机科学',
      description: '被称为"西瓜书"的机器学习入门经典',
      isbn: '9787115407010',
      price: 89.00,
      stock: 15,
      borrowCount: 38,
      createTime: '2024-01-12'
    },

    // 新增文学艺术类图书（13-18）
    {
      id: 13,
      name: '活着',
      author: '余华',
      category: '文学艺术',
      description: '讲述普通人在历史洪流中顽强生存的故事',
      isbn: '9787506365437',
      price: 29.50,
      stock: 12,
      borrowCount: 56,
      createTime: '2024-01-13'
    },
    {
      id: 14,
      name: '追风筝的人',
      author: '卡勒德·胡赛尼',
      category: '文学艺术',
      description: '关于友情、背叛与救赎的感人故事',
      isbn: '9787530208378',
      price: 36.00,
      stock: 10,
      borrowCount: 42,
      createTime: '2024-01-14'
    },
    {
      id: 15,
      name: '围城',
      author: '钱钟书',
      category: '文学艺术',
      description: '中国现代文学经典，探讨人生困境',
      isbn: '9787020095588',
      price: 39.50,
      stock: 8,
      borrowCount: 32,
      createTime: '2024-01-15'
    },
    {
      id: 16,
      name: '解忧杂货店',
      author: '东野圭吾',
      category: '文学艺术',
      description: '穿越时空的温情治愈故事',
      isbn: '9787544270878',
      price: 39.50,
      stock: 15,
      borrowCount: 48,
      createTime: '2024-01-16'
    },
    {
      id: 17,
      name: '平凡的世界',
      author: '路遥',
      category: '文学艺术',
      description: '全景式展现中国70-80年代城乡社会生活',
      isbn: '9787020090988',
      price: 108.00,
      stock: 6,
      borrowCount: 35,
      createTime: '2024-01-17'
    },
    {
      id: 18,
      name: '月亮与六便士',
      author: '毛姆',
      category: '文学艺术',
      description: '探讨理想与现实冲突的经典小说',
      isbn: '9787532773552',
      price: 33.00,
      stock: 9,
      borrowCount: 28,
      createTime: '2024-01-18'
    },

    // 新增自然科学类图书（19-23）
    {
      id: 19,
      name: '万物理论',
      author: '史蒂芬·霍金',
      category: '自然科学',
      description: '探索宇宙终极规律的科普著作',
      isbn: '9787535795137',
      price: 42.00,
      stock: 7,
      borrowCount: 21,
      createTime: '2024-01-19'
    },
    {
      id: 20,
      name: '物种起源',
      author: '查尔斯·达尔文',
      category: '自然科学',
      description: '进化论的奠基之作',
      isbn: '9787100110742',
      price: 58.00,
      stock: 5,
      borrowCount: 18,
      createTime: '2024-01-20'
    },
    {
      id: 21,
      name: '昆虫记',
      author: '法布尔',
      category: '自然科学',
      description: '昆虫世界的史诗般著作',
      isbn: '9787539767737',
      price: 49.80,
      stock: 10,
      borrowCount: 25,
      createTime: '2024-01-21'
    },
    {
      id: 22,
      name: '自私的基因',
      author: '理查德·道金斯',
      category: '自然科学',
      description: '从基因角度解释生物进化的经典',
      isbn: '9787532789667',
      price: 59.00,
      stock: 8,
      borrowCount: 23,
      createTime: '2024-01-22'
    },
    {
      id: 23,
      name: '海底两万里',
      author: '儒勒·凡尔纳',
      category: '自然科学',
      description: '科幻与科普结合的经典著作',
      isbn: '9787020133306',
      price: 32.00,
      stock: 12,
      borrowCount: 30,
      createTime: '2024-01-23'
    },

    // 新增经济管理类图书（24-28）
    {
      id: 24,
      name: '国富论',
      author: '亚当·斯密',
      category: '经济管理',
      description: '现代经济学的奠基之作',
      isbn: '9787100095570',
      price: 88.00,
      stock: 6,
      borrowCount: 15,
      createTime: '2024-01-24'
    },
    {
      id: 25,
      name: '穷查理宝典',
      author: '彼得·考夫曼',
      category: '经济管理',
      description: '查理·芒格的智慧箴言录',
      isbn: '9787508680911',
      price: 108.00,
      stock: 9,
      borrowCount: 32,
      createTime: '2024-01-25'
    },
    {
      id: 26,
      name: '原则',
      author: '瑞·达利欧',
      category: '经济管理',
      description: '桥水基金创始人的生活与工作原则',
      isbn: '9787508684031',
      price: 98.00,
      stock: 11,
      borrowCount: 28,
      createTime: '2024-01-26'
    },
    {
      id: 27,
      name: '牛奶可乐经济学',
      author: '罗伯特·弗兰克',
      category: '经济管理',
      description: '用经济学解释日常生活现象',
      isbn: '9787508682556',
      price: 49.00,
      stock: 14,
      borrowCount: 35,
      createTime: '2024-01-27'
    },
    {
      id: 28,
      name: '创新者的窘境',
      author: '克莱顿·克里斯坦森',
      category: '经济管理',
      description: '探讨企业创新与发展的经典著作',
      isbn: '9787508698310',
      price: 69.00,
      stock: 7,
      borrowCount: 19,
      createTime: '2024-01-28'
    },

    // 新增历史类图书（29-33）
    {
      id: 29,
      name: '明朝那些事儿',
      author: '当年明月',
      category: '历史',
      description: '通俗有趣的明朝历史解读',
      isbn: '9787505724181',
      price: 208.00,
      stock: 8,
      borrowCount: 45,
      createTime: '2024-01-29'
    },
    {
      id: 30,
      name: '史记',
      author: '司马迁',
      category: '历史',
      description: '中国第一部纪传体通史',
      isbn: '9787101119199',
      price: 198.00,
      stock: 5,
      borrowCount: 22,
      createTime: '2024-01-30'
    },
    {
      id: 31,
      name: '全球通史',
      author: '斯塔夫里阿诺斯',
      category: '历史',
      description: '全景式展现世界历史发展脉络',
      isbn: '9787500087043',
      price: 128.00,
      stock: 7,
      borrowCount: 28,
      createTime: '2024-01-31'
    },
    {
      id: 32,
      name: '万历十五年',
      author: '黄仁宇',
      category: '历史',
      description: '从细节看明朝衰落的历史著作',
      isbn: '9787108063981',
      price: 39.50,
      stock: 10,
      borrowCount: 35,
      createTime: '2024-02-01'
    },
    {
      id: 33,
      name: '二战全史',
      author: '丘吉尔',
      category: '历史',
      description: '全面记录第二次世界大战的历史',
      isbn: '9787512667823',
      price: 78.00,
      stock: 6,
      borrowCount: 24,
      createTime: '2024-02-02'
    },

    // 新增哲学类图书（34-36）
    {
      id: 34,
      name: '苏菲的世界',
      author: '乔斯坦·贾德',
      category: '哲学',
      description: '以小说形式讲述哲学史的入门读物',
      isbn: '9787544291873',
      price: 45.00,
      stock: 9,
      borrowCount: 32,
      createTime: '2024-02-03'
    },
    {
      id: 35,
      name: '理想国',
      author: '柏拉图',
      category: '哲学',
      description: '西方哲学的奠基之作',
      isbn: '9787500153137',
      price: 48.00,
      stock: 5,
      borrowCount: 18,
      createTime: '2024-02-04'
    },
    {
      id: 36,
      name: '论语',
      author: '孔子及其弟子',
      category: '哲学',
      description: '儒家思想的经典著作',
      isbn: '9787101119205',
      price: 28.00,
      stock: 12,
      borrowCount: 26,
      createTime: '2024-02-05'
    },

    // 新增心理学类图书（37-39）
    {
      id: 37,
      name: '自卑与超越',
      author: '阿尔弗雷德·阿德勒',
      category: '心理学',
      description: '探讨自卑情绪与人生意义的心理学经典',
      isbn: '9787514221051',
      price: 36.00,
      stock: 10,
      borrowCount: 38,
      createTime: '2024-02-06'
    },
    {
      id: 38,
      name: '被讨厌的勇气',
      author: '岸见一郎',
      category: '心理学',
      description: '基于阿德勒心理学的自我启发读物',
      isbn: '9787111545354',
      price: 39.80,
      stock: 15,
      borrowCount: 45,
      createTime: '2024-02-07'
    },
    {
      id: 39,
      name: '乌合之众',
      author: '古斯塔夫·勒庞',
      category: '心理学',
      description: '解析群体心理的经典著作',
      isbn: '9787510866441',
      price: 36.00,
      stock: 8,
      borrowCount: 30,
      createTime: '2024-02-08'
    },

    // 新增其他分类图书（40-50）
    {
      id: 40,
      name: '本草纲目',
      author: '李时珍',
      category: '医学',
      description: '中国古代医学经典著作',
      isbn: '9787513235909',
      price: 128.00,
      stock: 4,
      borrowCount: 12,
      createTime: '2024-02-09'
    },
    {
      id: 41,
      name: '土木工程施工',
      author: '应惠清',
      category: '工程技术',
      description: '土木工程施工技术与管理教材',
      isbn: '9787112234567',
      price: 69.00,
      stock: 7,
      borrowCount: 15,
      createTime: '2024-02-10'
    },
    {
      id: 42,
      name: '中华人民共和国刑法',
      author: '法律出版社',
      category: '法律',
      description: '最新版刑法条文及解读',
      isbn: '9787519745678',
      price: 58.00,
      stock: 9,
      borrowCount: 18,
      createTime: '2024-02-11'
    },
    {
      id: 43,
      name: '爱弥儿',
      author: '卢梭',
      category: '教育',
      description: '探讨教育本质的经典著作',
      isbn: '9787100171871',
      price: 68.00,
      stock: 6,
      borrowCount: 14,
      createTime: '2024-02-12'
    },
    {
      id: 44,
      name: '孙子兵法',
      author: '孙武',
      category: '军事',
      description: '中国古代军事战略经典',
      isbn: '9787506576920',
      price: 29.80,
      stock: 11,
      borrowCount: 28,
      createTime: '2024-02-13'
    },
    {
      id: 45,
      name: '设计中的设计',
      author: '原研哉',
      category: '艺术设计',
      description: '日本著名设计师的设计理念',
      isbn: '9787508680121',
      price: 88.00,
      stock: 8,
      borrowCount: 22,
      createTime: '2024-02-14'
    },
    {
      id: 46,
      name: '人间至味是清欢',
      author: '汪曾祺',
      category: '生活休闲',
      description: '品味生活之美的散文精选',
      isbn: '9787539995874',
      price: 42.00,
      stock: 13,
      borrowCount: 32,
      createTime: '2024-02-15'
    },
    {
      id: 47,
      name: '哈利·波特与魔法石',
      author: 'J.K.罗琳',
      category: '儿童文学',
      description: '奇幻儿童文学经典之作',
      isbn: '9787020144180',
      price: 59.00,
      stock: 18,
      borrowCount: 65,
      createTime: '2024-02-16'
    },
    {
      id: 48,
      name: '社会契约论',
      author: '卢梭',
      category: '社会科学',
      description: '探讨国家与公民关系的政治哲学著作',
      isbn: '9787100127991',
      price: 36.00,
      stock: 5,
      borrowCount: 16,
      createTime: '2024-02-17'
    },
    {
      id: 49,
      name: '三体',
      author: '刘慈欣',
      category: '科幻',
      description: '中国科幻文学的里程碑之作',
      isbn: '9787536692930',
      price: 58.00,
      stock: 14,
      borrowCount: 52,
      createTime: '2024-02-18'
    },
    {
      id: 50,
      name: '史蒂夫·乔布斯传',
      author: '沃尔特·艾萨克森',
      category: '传记',
      description: '苹果公司创始人的生平传记',
      isbn: '9787508630788',
      price: 89.00,
      stock: 10,
      borrowCount: 38,
      createTime: '2024-02-19'
    }
  ],

  // 扩展后的图书分类列表
  categories: [
    { id: 1, name: '计算机科学' },
    { id: 2, name: '文学艺术' },
    { id: 3, name: '自然科学' },
    { id: 4, name: '经济管理' },
    { id: 5, name: '历史' },
    { id: 6, name: '哲学' },
    { id: 7, name: '心理学' },
    { id: 8, name: '医学' },
    { id: 9, name: '工程技术' },
    { id: 10, name: '法律' },
    { id: 11, name: '教育' },
    { id: 12, name: '军事' },
    { id: 13, name: '艺术设计' },
    { id: 14, name: '生活休闲' },
    { id: 15, name: '儿童文学' },
    { id: 16, name: '社会科学' },
    { id: 17, name: '科幻' },
    { id: 18, name: '传记' }
  ]
}

/**
 * 生成新的ID
 */
export function generateId(collection) {
  const ids = collection.map(item => item.id)
  return Math.max(...ids) + 1
}