export interface PinyinItem {
  id: string;
  label: string;
  visual: string;
  audioText: string;
  optionText: string;
  hint: string;
}

const item = (
  id: string,
  label: string,
  audioText: string,
  hint: string,
  visual = "🎧",
): PinyinItem => ({
  id,
  label,
  visual,
  audioText,
  optionText: audioText,
  hint,
});

export const pinyinLessonBank: Record<string, PinyinItem[]> = {
  "py-01": [
    item("sound-a", "a", "请听，张大嘴巴，啊。单韵母 a。", "口形打开，声音响亮。", "👄"),
    item("sound-o", "o", "请听，嘴唇拢圆，喔。单韵母 o。", "圆圆嘴，发喔的音。", "⭕"),
    item("sound-e", "e", "请听，嘴巴半开，鹅。单韵母 e。", "嘴角放松，发鹅的音。", "🦢"),
    item("sound-i", "i", "请听，牙齿对齐，衣。单韵母 i。", "嘴角向两边展开。", "😁"),
    item("sound-u", "u", "请听，嘴唇突出，乌。单韵母 u。", "小圆嘴，发乌的音。", "🐦"),
    item("sound-v", "ü", "请听，撮起小圆嘴，迂。单韵母 ü。", "先做 i 的口形，再把嘴唇撮圆。", "🐟"),
  ],
  "py-02": [
    item("final-a", "a", "单韵母 a，读啊。", "a 读啊，不读英文字母 A。", "a"),
    item("final-o", "o", "单韵母 o，读喔。", "o 读喔，不读英文字母 O。", "o"),
    item("final-e", "e", "单韵母 e，读鹅。", "e 读鹅，不读英文字母 E。", "e"),
    item("final-i", "i", "单韵母 i，读衣。", "i 读衣，不读英文字母 I。", "i"),
    item("final-u", "u", "单韵母 u，读乌。", "u 读乌，不读英文字母 U。", "u"),
    item("final-v", "ü", "单韵母 ü，读迂。", "ü 是撮口呼，读迂。", "ü"),
  ],
  "py-03": [
    item("initial-b", "b", "声母 b，读玻。双唇轻轻闭上再打开。", "b 是不送气双唇音，读玻。", "b"),
    item("initial-p", "p", "声母 p，读坡。双唇打开时有气流。", "p 是送气双唇音，读坡。", "p"),
    item("initial-m", "m", "声母 m，读摸。双唇闭合，声音从鼻子出来。", "m 是鼻音，读摸。", "m"),
    item("initial-f", "f", "声母 f，读佛。上牙轻碰下唇。", "f 是唇齿音，读佛。", "f"),
    item("initial-d", "d", "声母 d，读得。舌尖轻抵上齿龈。", "d 读得。", "d"),
    item("initial-t", "t", "声母 t，读特。舌尖放开时有气流。", "t 读特。", "t"),
    item("initial-n", "n", "声母 n，读讷。声音从鼻子出来。", "n 读讷。", "n"),
    item("initial-l", "l", "声母 l，读勒。舌尖轻轻弹开。", "l 读勒。", "l"),
    item("initial-g", "g", "声母 g，读哥。舌根抬起。", "g 读哥。", "g"),
    item("initial-k", "k", "声母 k，读科。舌根放开时有气流。", "k 读科。", "k"),
    item("initial-h", "h", "声母 h，读喝。气流从喉部出来。", "h 读喝。", "h"),
    item("initial-j", "j", "声母 j，读基。舌面前部抬起。", "j 读基。", "j"),
    item("initial-q", "q", "声母 q，读欺。舌面前部送气。", "q 读欺。", "q"),
    item("initial-x", "x", "声母 x，读希。舌面前部轻擦。", "x 读希。", "x"),
    item("initial-zh", "zh", "声母 zh，读知。舌尖翘起来。", "zh 读知。", "zh"),
    item("initial-ch", "ch", "声母 ch，读蚩。翘舌并送气。", "ch 读蚩。", "ch"),
    item("initial-sh", "sh", "sh 声母，读诗。舌尖翘起来轻轻擦。", "sh 读诗。", "sh"),
    item("initial-r", "r", "声母 r，读日。翘舌，声音柔一点。", "r 读日。", "r"),
    item("initial-z", "z", "声母 z，读资。舌尖平放。", "z 读资。", "z"),
    item("initial-c", "c", "声母 c，读雌。平舌并送气。", "c 读雌。", "c"),
    item("initial-s", "s", "声母 s，读思。平舌轻擦。", "s 读思。", "s"),
  ],
  "py-04": [
    item("tone-1", "mā", "第一声，阴平，高高平平。妈，mā。", "一声平，标号是横。", "ˉ"),
    item("tone-2", "má", "第二声，阳平，声音往上扬。麻，má。", "二声扬，标号往上。", "ˊ"),
    item("tone-3", "mǎ", "第三声，上声，先降再扬。马，mǎ。", "三声拐弯，标号像小钩。", "ˇ"),
    item("tone-4", "mà", "第四声，去声，声音往下降。骂，mà。", "四声降，标号往下。", "ˋ"),
    item("tone-light", "ma", "轻声，短而轻。吗，ma。", "轻声不标调。", "·"),
  ],
  "py-05": [
    item("spell-ba", "bā", "声母 b，韵母 a，拼成 bā，八。", "b 加 a，读八。", "b + a"),
    item("spell-pa", "pá", "声母 p，韵母 a，拼成 pá，爬。", "p 加 a，读爬。", "p + a"),
    item("spell-ma", "mā", "声母 m，韵母 a，拼成 mā，妈。", "m 加 a，读妈。", "m + a"),
    item("spell-fa", "fā", "声母 f，韵母 a，拼成 fā，发。", "f 加 a，读发。", "f + a"),
    item("spell-bo", "bō", "声母 b，韵母 o，拼成 bō，波。", "b 加 o，读波。", "b + o"),
    item("spell-po", "pō", "声母 p，韵母 o，拼成 pō，坡。", "p 加 o，读坡。", "p + o"),
    item("spell-mi", "mǐ", "声母 m，韵母 i，拼成 mǐ，米。", "m 加 i，读米。", "m + i"),
    item("spell-fu", "fú", "声母 f，韵母 u，拼成 fú，福。", "f 加 u，读福。", "f + u"),
  ],
  "py-06": [
    item("real-zhi", "zhī", "整体认读音节 zhī，知。", "zhī 直接读知。", "知"),
    item("real-chi", "chī", "整体认读音节 chī，吃。", "chī 直接读吃。", "吃"),
    item("real-shi", "shī", "整体认读音节 shī，诗。", "shī 直接读诗。", "诗"),
    item("real-ri", "rì", "整体认读音节 rì，日。", "rì 直接读日。", "日"),
    item("real-zi", "zǐ", "整体认读音节 zǐ，子。", "zǐ 直接读子。", "子"),
    item("real-ci", "cí", "整体认读音节 cí，词。", "cí 直接读词。", "词"),
    item("real-si", "sī", "整体认读音节 sī，思。", "思的 sī。", "思"),
    item("real-yi", "yī", "整体认读音节 yī，一。", "一的 yī。", "一"),
    item("real-wu", "wǔ", "整体认读音节 wǔ，五。", "五的 wǔ。", "五"),
    item("real-yu", "yú", "整体认读音节 yú，鱼。", "鱼的 yú，ü 上两点省写。", "鱼"),
  ],
};

export const pinyinSourceNote =
  "依据《汉语拼音方案》的声母表、韵母表、声调符号，并按小学启蒙常用顺序组织。";
