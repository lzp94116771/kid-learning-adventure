import { Lesson } from "../types";
import { chineseChars } from "./chineseChars";

const sliceIds = (start: number, count: number) =>
  chineseChars.slice(start, start + count).map((item) => item.id);

const chineseNormal: Lesson[] = [
  ["ch-01", "彩虹起步站", "天地人，你我他", "上册", sliceIds(0, 6)],
  ["ch-02", "感官探险林", "口耳目手足", "上册", sliceIds(6, 5)],
  ["ch-03", "自然小火车", "日月水火", "上册", sliceIds(11, 4)],
  ["ch-04", "田野观察队", "山石田禾", "上册", sliceIds(15, 4)],
  ["ch-05", "数字小路", "一二三四五", "上册", sliceIds(19, 5)],
  ["ch-06", "方位游乐场", "上下大小", "上册", sliceIds(24, 4)],
  ["ch-07", "春风花园", "春风花飞", "下册", sliceIds(28, 6)],
  ["ch-08", "青蛙池塘", "青清请情晴", "下册", sliceIds(34, 5)],
  ["ch-09", "天气观测站", "晴雪和颜色", "下册", sliceIds(38, 5)],
  ["ch-10", "生活小书包", "早书子复习", "下册", sliceIds(43, 3).concat(sliceIds(0, 3))],
].map(([id, title, subtitle, section, charIds], index) => ({
  id: id as string,
  subject: "chinese",
  title: title as string,
  subtitle: subtitle as string,
  section: section as string,
  order: index + 1,
  theme: index % 2 ? "forest" : "sunny",
  minutes: 8,
  charIds: charIds as string[],
  questionCount: 12,
}));

const allCharIds = chineseChars.map((item) => item.id);

const chineseReviews: Lesson[] = Array.from({ length: 5 }, (_, index) => ({
  id: `ch-review-${index + 1}`,
  subject: "chinese",
  title: `综合卷 ${index + 1}`,
  subtitle: ["看拼音找朋友", "听音摘星星", "词语碰碰车", "下册挑战", "总复习闯关"][index],
  section: "综合总复习",
  order: chineseNormal.length + index + 1,
  theme: "review",
  minutes: 12,
  charIds: allCharIds.slice(index * 8, index * 8 + 18).concat(allCharIds.slice(0, 6)),
  questionCount: 18,
  review: true,
}));

const mathTopics = [
  ["ma-01", "数感气球屋", "数一数 1-5", "数感"],
  ["ma-02", "更多更少桥", "比多少", "比较"],
  ["ma-03", "排队小火车", "第几个", "顺序"],
  ["ma-04", "加法糖果铺", "0-10 加法", "0-10 加减"],
  ["ma-05", "减法小滑梯", "0-10 减法", "0-10 加减"],
  ["ma-06", "十几探险洞", "11-20 认识", "11-20"],
  ["ma-07", "凑十能量站", "凑十法", "凑十"],
  ["ma-08", "拆分积木城", "数的拆分", "拆分"],
  ["ma-09", "图形碰碰乐", "圆、方、三角", "图形"],
  ["ma-10", "上下左右湖", "方位判断", "方位"],
  ["ma-11", "钟表小镇", "整点半点", "钟表"],
  ["ma-12", "跳跳数轴", "20 以内加减", "20 以内加减"],
  ["ma-13", "百数云梯", "100 以内数", "100 以内数"],
  ["ma-14", "钱币商店", "人民币启蒙", "人民币"],
  ["ma-15", "生活小侦探", "一步应用题", "应用题"],
  ["ma-16", "规律彩带路", "找规律和统计", "规律统计"],
];

const mathLessons: Lesson[] = mathTopics.map(([id, title, subtitle, section], index) => ({
  id,
  subject: "math",
  title,
  subtitle,
  section,
  order: index + 1,
  theme: index % 3 === 0 ? "sunny" : index % 3 === 1 ? "ocean" : "forest",
  minutes: 7,
  questionCount: index > 9 ? 15 : 12,
}));

const pinyinLessons: Lesson[] = [
  ["py-01", "声音启蒙屋", "听一听，找声音", "声音启蒙"],
  ["py-02", "单韵母花园", "a o e i u ü", "单韵母"],
  ["py-03", "声母小队", "b p m f d t n l...", "声母"],
  ["py-04", "四声滑梯", "阴平 阳平 上声 去声", "四声"],
  ["py-05", "拼读小火车", "声母加韵母", "拼读"],
  ["py-06", "拼音实战营", "整体认读音节", "拼音实战"],
].map(([id, title, subtitle, section], index) => ({
  id,
  subject: "pinyin",
  title,
  subtitle,
  section,
  order: index + 1,
  theme: "music",
  minutes: 6,
  questionCount: 10,
}));

const englishLessons: Lesson[] = [
  ["en-01", "Hello 小镇", "问候", "问候"],
  ["en-02", "Number 乐园", "one to ten", "数字"],
  ["en-03", "Color 彩虹", "red blue yellow", "颜色"],
  ["en-04", "Animal 森林", "cat dog bird", "动物"],
  ["en-05", "Fruit 商店", "apple banana pear", "水果"],
  ["en-06", "Action 操场", "run jump clap", "动作"],
].map(([id, title, subtitle, section], index) => ({
  id,
  subject: "english",
  title,
  subtitle,
  section,
  order: index + 1,
  theme: "town",
  minutes: 6,
  questionCount: 10,
}));

export const lessons: Lesson[] = [
  ...chineseNormal,
  ...chineseReviews,
  ...mathLessons,
  ...pinyinLessons,
  ...englishLessons,
];

export const lessonsBySubject = (subject: Lesson["subject"]) =>
  lessons.filter((lesson) => lesson.subject === subject).sort((a, b) => a.order - b.order);

export const lessonById = Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson])) as Record<string, Lesson>;
