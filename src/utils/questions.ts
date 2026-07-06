import { charById, chineseChars } from "../data/chineseChars";
import { pinyinLessonBank } from "../data/pinyin";
import { Lesson, QuizOption, QuizQuestion, SubjectId } from "../types";
import { normalizePinyinForSpeech } from "./speech";

const takeOptions = <T,>(pool: T[], answer: T, size = 4) => {
  const chosen = [answer];
  for (const item of pool) {
    if (chosen.length >= size) break;
    if (item !== answer) chosen.push(item);
  }
  return chosen
    .map((item) => ({ item, sort: Math.sin(String(item).length * 3 + String(item).charCodeAt(0)) }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
};

const option = (label: string, speakText = label, visual?: string): QuizOption => ({
  id: label,
  label,
  speakText,
  visual,
});

export function makeChineseQuestions(lesson: Lesson): QuizQuestion[] {
  const charIds = lesson.charIds?.length ? lesson.charIds : chineseChars.slice(0, 8).map((item) => item.id);
  const chars = charIds.map((id) => charById[id]).filter(Boolean);
  const pool = chineseChars;
  const questions: QuizQuestion[] = [];
  const target = lesson.questionCount;
  let round = 0;

  while (questions.length < target) {
    const char = chars[questions.length % chars.length];
    const typeIndex = (questions.length + round) % 4;
    const charOptions = takeOptions(pool.map((item) => item.char), char.char);
    const pinyinOptions = takeOptions(pool.map((item) => item.pinyin), char.pinyin);
    const wordOptions = takeOptions(pool.flatMap((item) => item.words.slice(0, 1)), char.words[0]);

    if (typeIndex === 0) {
      questions.push({
        id: `${lesson.id}-py-char-${questions.length}`,
        subject: "chinese",
        type: "看拼音选字",
        prompt: `哪个字读 ${char.pinyin}？`,
        speakText: `看拼音，选出生字。${normalizePinyinForSpeech(char.pinyin)}`,
        options: charOptions.map((item) => option(item, item)),
        answerId: char.char,
        charId: char.id,
        mistakeType: "拼音错误",
        visual: char.pinyin,
      });
    } else if (typeIndex === 1) {
      questions.push({
        id: `${lesson.id}-char-py-${questions.length}`,
        subject: "chinese",
        type: "看字选拼音",
        prompt: `“${char.char}” 的拼音是哪一个？`,
        speakText: `看字选拼音。${char.char}`,
        options: pinyinOptions.map((item) => option(item, normalizePinyinForSpeech(item))),
        answerId: char.pinyin,
        charId: char.id,
        mistakeType: "认字错误",
        visual: char.char,
      });
    } else if (typeIndex === 2) {
      questions.push({
        id: `${lesson.id}-listen-${questions.length}`,
        subject: "chinese",
        type: "听音选字",
        prompt: "听一听，选出生字",
        speakText: `请听，${char.char}，${normalizePinyinForSpeech(char.pinyin)}，${char.words[0]}的${char.char}`,
        options: charOptions.map((item) => option(item, item)),
        answerId: char.char,
        charId: char.id,
        mistakeType: "听音错误",
        visual: "听",
      });
    } else {
      questions.push({
        id: `${lesson.id}-word-${questions.length}`,
        subject: "chinese",
        type: "看字选词",
        prompt: `“${char.char}” 可以组成哪个词？`,
        speakText: `看字选词。${char.char} 可以组成哪个词？`,
        options: wordOptions.map((item) => option(item, item)),
        answerId: char.words[0],
        charId: char.id,
        mistakeType: "组词错误",
        visual: char.char,
      });
    }
    round += 1;
  }
  return questions.slice(0, target);
}

function mathQuestion(id: string, type: string, prompt: string, answer: string, choices: string[], visual: string, speakText?: string): QuizQuestion {
  return {
    id,
    subject: "math",
    type,
    prompt,
    speakText: speakText ?? prompt,
    options: choices.map((choice) => option(choice, choice)),
    answerId: answer,
    mistakeType: type.includes("算") ? "计算错误" : "理解错误",
    visual,
  };
}

export function makeMathQuestions(lesson: Lesson): QuizQuestion[] {
  const seed = lesson.order;
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < lesson.questionCount; i += 1) {
    const n = ((seed + i) % 9) + 1;
    const hard = i > lesson.questionCount * 0.65;
    const id = `${lesson.id}-${i}`;
    if (lesson.section === "数感") {
      questions.push(mathQuestion(id, "数一数", "有几个苹果？", String(n), [String(n), String(n + 1), String(Math.max(1, n - 1)), String(n + 2)], "🍎".repeat(n)));
    } else if (lesson.section === "比较") {
      const a = n + 1;
      const b = hard ? n + 3 : n - 1;
      questions.push(mathQuestion(id, "比多少", "哪边更多？", a > b ? "左边" : "右边", ["左边", "右边", "一样多", "不知道"], `左 ${"⭐".repeat(a)}  右 ${"⭐".repeat(Math.max(1, b))}`));
    } else if (lesson.section === "顺序") {
      const pos = ((i + 2) % 5) + 1;
      questions.push(mathQuestion(id, "第几个", "小兔排第几个？", `第${pos}个`, ["第1个", "第2个", "第3个", `第${pos}个`], ["🐶", "🐱", "🐰", "🐼", "🦊"].map((x, idx) => (idx + 1 === pos ? "🐰" : x)).join(" ")));
    } else if (lesson.section.includes("0-10")) {
      const a = n % 6;
      const b = hard ? (10 - a) % 6 : (i % 4) + 1;
      const result = lesson.title.includes("减") ? Math.max(a + b, b) - b : a + b;
      const expression = lesson.title.includes("减") ? `${Math.max(a + b, b)} - ${b}` : `${a} + ${b}`;
      questions.push(mathQuestion(id, "算一算", `${expression} = ?`, String(result), [String(result), String(result + 1), String(Math.max(0, result - 1)), String(result + 2)], expression));
    } else if (lesson.section === "11-20") {
      const value = 11 + ((i + seed) % 10);
      questions.push(mathQuestion(id, "十几认识", "几个十和几个一？", `${Math.floor(value / 10)}个十${value % 10}个一`, [`1个十${value % 10}个一`, `2个十${value % 10}个一`, `${value}个十`, `${value % 10}个一`], "🔟 " + "🟡".repeat(value % 10)));
    } else if (lesson.section === "凑十") {
      const a = (i % 8) + 1;
      questions.push(mathQuestion(id, "凑十", `${a} 和几可以凑成 10？`, String(10 - a), [String(10 - a), String(9 - a), String(11 - a), String(a)], `🧩 ${a} + ? = 10`));
    } else if (lesson.section === "拆分") {
      const total = 6 + (i % 5);
      const left = 1 + (i % (total - 1));
      questions.push(mathQuestion(id, "拆分", `${total} 可以分成 ${left} 和几？`, String(total - left), [String(total - left), String(total - left + 1), String(left), String(total)], `🧱 ${total} = ${left} + ?`));
    } else if (lesson.section === "图形") {
      const shapes = ["圆形", "正方形", "三角形", "长方形"];
      const visuals = ["⚪", "⬜", "🔺", "▭"];
      const idx = i % shapes.length;
      questions.push(mathQuestion(id, "认图形", "这个像什么图形？", shapes[idx], shapes, visuals[idx]));
    } else if (lesson.section === "方位") {
      questions.push(mathQuestion(id, "方位", i % 2 ? "小星星在房子的哪边？" : "小星星在花的哪边？", i % 2 ? "上面" : "右边", ["上面", "下面", "左边", "右边"], i % 2 ? "⭐\n🏠" : "🌸 ⭐"));
    } else if (lesson.section === "钟表") {
      const hour = ((i + 6) % 12) + 1;
      questions.push(mathQuestion(id, "认钟表", "现在是几时？", `${hour}时`, [`${hour}时`, `${hour + 1}时`, `${Math.max(1, hour - 1)}时`, "半时"], `🕒 ${hour}:00`));
    } else if (lesson.section === "20 以内加减") {
      const a = 9 + (i % 8);
      const b = 1 + (i % 4);
      const result = hard ? a - b : a + b;
      const expr = hard ? `${a} - ${b}` : `${a} + ${b}`;
      questions.push(mathQuestion(id, "20以内", `${expr} = ?`, String(result), [String(result), String(result + 2), String(result - 1), String(result + 1)], `🛤️ ${expr}`));
    } else if (lesson.section === "100 以内数") {
      const value = 20 + ((i * 7) % 70);
      questions.push(mathQuestion(id, "百以内", `${value} 后面一个数是？`, String(value + 1), [String(value + 1), String(value - 1), String(value + 10), String(value)], `☁️ ${value} → ?`));
    } else if (lesson.section === "人民币") {
      const price = 3 + (i % 6);
      const money = price + (hard ? -1 : 2);
      questions.push(mathQuestion(id, "买东西", `有 ${money} 元，买 ${price} 元铅笔够吗？`, money >= price ? "够" : "不够", ["够", "不够", "一样", "再想想"], `💰${money}元  ✏️${price}元`));
    } else if (lesson.section === "应用题") {
      const a = 4 + (i % 5);
      const b = 1 + (i % 4);
      questions.push(mathQuestion(id, "应用题", `盘子里有 ${a} 个橘子，又放来 ${b} 个，一共几个？`, String(a + b), [String(a + b), String(a - b), String(a + b + 1), String(b)], "🍊".repeat(a) + " + " + "🍊".repeat(b)));
    } else {
      const patterns = ["🔴 🟡 🔴 🟡 ?", "⭐ ⭐ 🌙 ⭐ ⭐ ?", "🍎 🍌 🍎 🍌 ?"];
      const answers = ["🔴", "🌙", "🍎"];
      const idx = i % patterns.length;
      questions.push(mathQuestion(id, "找规律", "下一个是什么？", answers[idx], ["🔴", "🟡", "🌙", "🍎"], patterns[idx]));
    }
  }
  return questions;
}

const englishSets = [
  [["hello", "你好", "👋"], ["bye", "再见", "👋"], ["good", "好", "👍"], ["morning", "早上", "🌞"]],
  [["one", "1", "1️⃣"], ["two", "2", "2️⃣"], ["three", "3", "3️⃣"], ["four", "4", "4️⃣"]],
  [["red", "红色", "🔴"], ["blue", "蓝色", "🔵"], ["yellow", "黄色", "🟡"], ["green", "绿色", "🟢"]],
  [["cat", "猫", "🐱"], ["dog", "狗", "🐶"], ["bird", "鸟", "🐦"], ["fish", "鱼", "🐟"]],
  [["apple", "苹果", "🍎"], ["banana", "香蕉", "🍌"], ["pear", "梨", "🍐"], ["grape", "葡萄", "🍇"]],
  [["run", "跑", "🏃"], ["jump", "跳", "🦘"], ["clap", "拍手", "👏"], ["sit", "坐下", "🪑"]],
];

function makePinyinQuestions(lesson: Lesson): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const bank = pinyinLessonBank[lesson.id] ?? pinyinLessonBank["py-01"];
  const labelPool = bank.map((item) => item.label);

  for (let i = 0; i < lesson.questionCount; i += 1) {
    const answer = bank[i % bank.length];
    const labels = takeOptions(labelPool, answer.label);
    const choices = labels
      .map((label) => bank.find((item) => item.label === label))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    questions.push({
      id: `${lesson.id}-${i}`,
      subject: "pinyin",
      type: lesson.section === "四声" ? "听声调" : lesson.section === "拼读" ? "听拼读" : "听拼音",
      prompt: lesson.section === "四声" ? "听一听，选正确声调" : "听一听，选正确拼音",
      speakText: answer.audioText,
      options: choices.map((choice) => option(choice.label, choice.optionText, choice.visual)),
      answerId: answer.label,
      mistakeType: "听音错误",
      visual: lesson.section === "声音启蒙" ? answer.visual : "🎧",
      hint: answer.hint,
    });
  }

  return questions;
}

function makeSimpleAudioQuestions(lesson: Lesson, subject: Exclude<SubjectId, "pinyin">): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const set = englishSets[(lesson.order - 1) % englishSets.length].map((item) => item[0]);
  for (let i = 0; i < lesson.questionCount; i += 1) {
    const answer = set[i % set.length];
    const choices = takeOptions(set, answer);
    const englishVisual = englishSets[(lesson.order - 1) % englishSets.length].find((item) => item[0] === answer)?.[2];
    questions.push({
      id: `${lesson.id}-${i}`,
      subject,
      type: "听英语",
      prompt: "Listen and choose",
      speakText: answer,
      options: choices.map((choice) => option(choice, choice)),
      answerId: answer,
      mistakeType: "听音错误",
      visual: englishVisual,
    });
  }
  return questions;
}

export function makeQuestions(lesson: Lesson): QuizQuestion[] {
  if (lesson.subject === "chinese") return makeChineseQuestions(lesson);
  if (lesson.subject === "math") return makeMathQuestions(lesson);
  if (lesson.subject === "pinyin") return makePinyinQuestions(lesson);
  return makeSimpleAudioQuestions(lesson, lesson.subject);
}
