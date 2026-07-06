const pinyinSpeechMap: Record<string, string> = {
  tiān: "天的一声，tiān",
  dì: "地的四声，dì",
  rén: "人的二声，rén",
  nǐ: "你的三声，nǐ",
  wǒ: "我的三声，wǒ",
  tā: "他的一声，tā",
  kǒu: "口的三声，kǒu",
  ěr: "耳的三声，ěr",
  mù: "目的四声，mù",
  shǒu: "手的三声，shǒu",
  zú: "足的二声，zú",
  rì: "日的四声，rì",
  yuè: "月的四声，yuè",
  shuǐ: "水的三声，shuǐ",
  huǒ: "火的三声，huǒ",
  shān: "山的一声，shān",
  shí: "石的二声，shí",
  tián: "田的二声，tián",
  hé: "禾的二声，hé",
  yī: "一的一声，yī",
  èr: "二的四声，èr",
  sān: "三的一声，sān",
  sì: "四的四声，sì",
  wǔ: "五的三声，wǔ",
  shàng: "上的四声，shàng",
  xià: "下的四声，xià",
  dà: "大的四声，dà",
  xiǎo: "小的三声，xiǎo",
};

export function normalizePinyinForSpeech(text: string) {
  return pinyinSpeechMap[text] ?? text;
}

export function speak(text: string, rate = 0.92) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = /[a-zA-Z]/.test(text) && !/[\u4e00-\u9fa5]/.test(text) ? "en-US" : "zh-CN";
  utterance.rate = rate;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

export function playTone(kind: "success" | "error") {
  const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.type = kind === "success" ? "sine" : "triangle";
  oscillator.frequency.setValueAtTime(kind === "success" ? 660 : 220, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(kind === "success" ? 990 : 150, ctx.currentTime + 0.18);
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.26);
}
