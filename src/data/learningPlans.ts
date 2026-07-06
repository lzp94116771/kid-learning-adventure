import { SubjectId } from "../types";

export const catalog: Record<SubjectId, Array<{ title: string; description: string; icon: string }>> = {
  chinese: [
    { title: "生字地图", description: "上册、下册、综合卷按关卡展开。", icon: "🗺️" },
    { title: "大字卡学习", description: "一个字一张卡，带拼音、组词和笔顺动画。", icon: "🖌️" },
    { title: "四类题型", description: "看拼音、看字、听音、选词轮流出现。", icon: "🎧" },
  ],
  math: [
    { title: "数感起步", description: "数一数、比多少、第几个。", icon: "🍎" },
    { title: "加减闯关", description: "0-10、11-20、凑十和拆分。", icon: "🧮" },
    { title: "生活数学", description: "图形、方位、钟表、人民币和统计。", icon: "🛒" },
  ],
  pinyin: [
    { title: "声音启蒙", description: "先听再选，减少认字压力。", icon: "🎵" },
    { title: "韵母声母", description: "单韵母、声母和四声滑梯。", icon: "🚂" },
    { title: "拼读实战", description: "把声音拼起来。", icon: "📣" },
  ],
  english: [
    { title: "启蒙词汇", description: "问候、数字、颜色、动物、水果、动作。", icon: "🌍" },
    { title: "看图选择", description: "用图像降低阅读负担。", icon: "🖼️" },
    { title: "听说优先", description: "每题都能听，选项也能读。", icon: "🎤" },
  ],
};
