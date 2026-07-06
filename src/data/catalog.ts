import { SubjectId } from "../types";

export const subjects: Array<{
  id: SubjectId;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
}> = [
  { id: "chinese", title: "语文识字岛", subtitle: "生字、拼音、组词", color: "from-rose-300 to-orange-200", icon: "文" },
  { id: "math", title: "数学星球", subtitle: "数一数，算一算", color: "from-sky-300 to-emerald-200", icon: "数" },
  { id: "pinyin", title: "拼音乐园", subtitle: "听声母，拼韵母", color: "from-violet-300 to-pink-200", icon: "拼" },
  { id: "english", title: "英语小镇", subtitle: "听一听，选一选", color: "from-amber-200 to-lime-200", icon: "A" },
];

export const grades = [
  { id: "bridge", title: "幼小衔接", subtitle: "拼音启蒙和学习习惯", active: true },
  { id: "grade-1", title: "一年级", subtitle: "语文、数学、英语主线", active: true },
  { id: "grade-5", title: "五年级", subtitle: "后续扩展入口", active: false },
];
