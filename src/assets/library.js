/**
 * 图书管理系统数据模块
 * 包含管理员、图书、分类、借阅、读者等相关数据
 */

// 管理员信息数组
// 包含管理员ID、密码和用户名
const admin = [
  { admin_id: 123456, password: '123', username: 'admin' }
];

// 图书信息数组
// 包含图书的详细信息：ID、书名、作者、出版社等
const bookInfo = [
  { 
    book_id: 1,          // 图书ID
    name: '呼啸山庄',     // 书名
    author: '艾米莉勃朗特', // 作者
    publish: '煤炭工业出版社', // 出版社
    ISBN: '9787530216835', // ISBN号
    introduction: '完整版中文版经典文学小说书籍 原著原版无删节图书学生课外知 呼啸山庄', // 简介
    language: '中文',      // 语言
    price: 35.00,         // 价格
    pub_date: '2017-06-01', // 出版日期
    class_id: 9,          // 分类ID
    number: 1             // 库存数量
  },

];

// 图书分类信息数组
// 包含分类ID和分类名称
const classInfo = [
  { class_id: 1, class_name: '马克思主义' },
  { class_id: 2, class_name: '哲学' },

];

// 借阅记录数组
// 记录图书借阅的详细信息
const lendList = [
  { 
    ser_num: 1,           // 借阅序号
    book_id: 1,           // 图书ID
    reader_id: 10000,     // 读者ID
    lend_date: '2019-03-15', // 借出日期
    back_date: '2019-06-16'  // 归还日期
  },
  // ... 其他借阅信息
];

// 读者证信息数组
// 包含读者的登录凭证信息
const readerCard = [
  { reader_id: 10001, username: '张圆', password: '123456' },
  // ... 其他读者卡片信息
];

// 读者详细信息数组
// 包含读者的个人信息
const readerInfo = [
  { 
    reader_id: 10002,     // 读者ID
    name: '王栏',         // 姓名
    sex: '女',           // 性别
    birth: '1995-04-15', // 出生日期
    address: '浙江省杭州市', // 地址
    phone: '12345678908'  // 电话
  },

];

// 商品信息数组
// 包含商品的详细信息
const shopInfo = [
  { 
    shop_id: 3,           // 商品ID
    name: '智能手表',      // 商品名称
    author: '华为',       // 制造商
    publish: '华为技术有限公司', // 生产公司
    ISBN: '9787505414710', // 商品编号
    introduction: '华为智能手表集成了健康监测和通讯功能，支持多种运动模式和长效电池续航。', // 商品介绍
    language: '中文',      // 界面语言
    price: 499.00,        // 价格
    pub_date: '2019-08-20', // 上市日期
    class_id: 8,          // 分类ID
    number: 1             // 库存数量
  },

];

// 导出所有数据集合
export const list = {
  admin,      // 管理员信息
  bookInfo,   // 图书信息
  classInfo,  // 分类信息
  lendList,   // 借阅记录
  readerCard, // 读者证信息
  readerInfo, // 读者详细信息
  shopInfo    // 商品信息
};