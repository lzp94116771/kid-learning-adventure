import {
  Award,
  Baby,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Coins,
  GraduationCap,
  Home,
  Lock,
  Map,
  Medal,
  Mic2,
  Parentheses,
  Play,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
  Volume2,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { lessonById, lessonsBySubject } from "./data/adventureLessons";
import { catalog } from "./data/learningPlans";
import { charById } from "./data/chineseChars";
import { grades, subjects } from "./data/catalog";
import { useAppState } from "./state/AppContext";
import { Lesson, QuizQuestion, QuizSummary, SubjectId } from "./types";
import { makeQuestions } from "./utils/questions";
import { normalizePinyinForSpeech, playTone, speak } from "./utils/speech";
import { todayKey } from "./utils/storage";

const subjectLabel: Record<SubjectId, string> = {
  chinese: "语文",
  math: "数学",
  pinyin: "拼音",
  english: "英语",
};

function StatPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 shadow-sm backdrop-blur">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-amber-500">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}

function TopBar() {
  const { rewards } = useAppState();
  return (
    <header className="sticky top-0 z-30 border-b border-white/50 bg-white/65 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 to-rose-300 text-xl font-black text-white shadow-soft">
            乐
          </div>
          <div>
            <h1 className="text-lg font-black text-stone-800">幼小衔接学习大冒险</h1>
            <p className="text-xs font-semibold text-stone-500">看一看，听一听，闯一关</p>
          </div>
        </Link>
        <nav className="grid w-full grid-cols-4 gap-2 sm:w-auto sm:flex">
          <StatPill icon={<Star size={17} fill="currentColor" />} label={`${rewards.totalStars} 星`} />
          <StatPill icon={<Coins size={17} />} label={`${rewards.coins} 金币`} />
          <StatPill icon={<Sparkles size={17} />} label={`${rewards.streakDays} 天`} />
          <StatPill icon={<Baby size={17} />} label={`宠物 ${rewards.petLevel}`} />
        </nav>
      </div>
    </header>
  );
}

function Page({ children, narrow = false }: { children: React.ReactNode; narrow?: boolean }) {
  return (
    <main className="min-h-screen">
      <TopBar />
      <div className={`mx-auto px-4 py-6 ${narrow ? "max-w-4xl" : "max-w-6xl"}`}>{children}</div>
    </main>
  );
}

function BackLink({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-stone-700 shadow-sm">
      <ChevronLeft size={18} /> 返回
    </Link>
  );
}

function HomePage() {
  const { reports } = useAppState();
  const today = reports[todayKey()] ?? { questions: 0, correct: 0, wrong: 0, stars: 0, coins: 0 };
  return (
    <Page>
      <section className="hero-band overflow-hidden rounded-[28px] border border-white/70 p-6 shadow-soft md:p-8">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-white/80 px-4 py-2 text-sm font-black text-rose-500">今日冒险开启</p>
            <h2 className="max-w-2xl text-4xl font-black leading-tight text-stone-800 md:text-6xl">孩子自己点着玩的闯关学习乐园</h2>
            <p className="mt-4 max-w-xl text-lg font-semibold leading-relaxed text-stone-600">一屏一个任务，大按钮、强反馈、自动朗读、通关奖励。先玩起来，再慢慢复习。</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="kid-button primary" to="/grades">
                <Map size={22} /> 进入总地图
              </Link>
              <Link className="kid-button" to="/rewards">
                <Trophy size={22} /> 奖励中心
              </Link>
            </div>
          </div>
          <div className="adventure-scene" aria-hidden="true">
            <div className="sun" />
            <div className="cloud cloud-a" />
            <div className="cloud cloud-b" />
            <div className="path-dot dot-1">1</div>
            <div className="path-dot dot-2">2</div>
            <div className="path-dot dot-3">3</div>
            <div className="pet">🐣</div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {grades.map((grade) => (
          <Link key={grade.id} to={grade.active ? (grade.id === "grade-1" ? "/grade/grade-1" : "/subject/pinyin") : "/grade/grade-5"} className={`big-card ${grade.active ? "" : "opacity-75"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-amber-600">{grade.active ? "可进入" : "先放在这里"}</p>
                <h3 className="mt-2 text-2xl font-black text-stone-800">{grade.title}</h3>
                <p className="mt-2 font-semibold text-stone-600">{grade.subtitle}</p>
              </div>
              <div className="grid h-14 w-14 place-items-center rounded-3xl bg-white text-amber-500 shadow-sm">
                {grade.id === "bridge" ? <Baby /> : <GraduationCap />}
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <InfoTile icon={<BookOpen />} title="今日学习" value={`${today.questions} 题`} tone="rose" />
        <InfoTile icon={<CheckCircle2 />} title="答对" value={`${today.correct} 题`} tone="green" />
        <InfoTile icon={<Award />} title="今日收获" value={`${today.stars} 星 ${today.coins} 币`} tone="amber" />
      </section>
    </Page>
  );
}

function InfoTile({ icon, title, value, tone }: { icon: React.ReactNode; title: string; value: string; tone: string }) {
  return (
    <div className={`info-tile tone-${tone}`}>
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/80">{icon}</span>
      <div>
        <p className="text-sm font-black text-stone-500">{title}</p>
        <p className="text-2xl font-black text-stone-800">{value}</p>
      </div>
    </div>
  );
}

function GradesPage() {
  return (
    <Page>
      <BackLink />
      <SectionTitle title="选择冒险地图" subtitle="先选阶段，再进入学科。" />
      <div className="grid gap-4 md:grid-cols-3">
        {grades.map((grade) => (
          <Link key={grade.id} to={grade.active ? (grade.id === "grade-1" ? "/grade/grade-1" : "/subject/pinyin") : "/grade/grade-5"} className="big-card min-h-56">
            <div className="text-5xl">{grade.id === "bridge" ? "🌈" : grade.id === "grade-1" ? "🎒" : "🚧"}</div>
            <h3 className="mt-5 text-3xl font-black text-stone-800">{grade.title}</h3>
            <p className="mt-2 font-semibold text-stone-600">{grade.subtitle}</p>
          </Link>
        ))}
      </div>
    </Page>
  );
}

function GradeHomePage() {
  return (
    <Page>
      <BackLink to="/grades" />
      <SectionTitle title="一年级学习岛" subtitle="语文和数学内容已经加厚，拼音与英语也能先玩。" />
      <SubjectGrid />
    </Page>
  );
}

function GradeFivePage() {
  return (
    <Page narrow>
      <BackLink to="/grades" />
      <div className="big-card text-center">
        <div className="text-6xl">🚧</div>
        <h2 className="mt-4 text-3xl font-black text-stone-800">五年级地图建设中</h2>
        <p className="mt-3 text-lg font-semibold text-stone-600">当前先把幼小衔接和一年级主线做扎实。</p>
      </div>
    </Page>
  );
}

function SubjectGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {subjects.map((subject) => (
        <Link key={subject.id} to={`/subject/${subject.id}`} className={`subject-card bg-gradient-to-br ${subject.color}`}>
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/80 text-3xl font-black text-stone-800 shadow-sm">{subject.icon}</div>
          <div>
            <h3 className="text-3xl font-black text-stone-800">{subject.title}</h3>
            <p className="mt-1 text-lg font-bold text-stone-600">{subject.subtitle}</p>
          </div>
          <Play className="ml-auto text-white drop-shadow" fill="currentColor" />
        </Link>
      ))}
    </div>
  );
}

function SubjectHomePage() {
  const { subject = "chinese" } = useParams();
  const id = subject as SubjectId;
  const subjectMeta = subjects.find((item) => item.id === id);
  if (!subjectMeta) return <Navigate to="/" />;
  const plans = catalog[id];
  return (
    <Page>
      <BackLink to="/grade/grade-1" />
      <section className={`rounded-[28px] bg-gradient-to-br ${subjectMeta.color} p-6 shadow-soft`}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-white/85 text-4xl font-black text-stone-800">{subjectMeta.icon}</div>
          <div>
            <h2 className="text-4xl font-black text-stone-800">{subjectMeta.title}</h2>
            <p className="mt-2 text-lg font-bold text-stone-600">{subjectMeta.subtitle}</p>
          </div>
          <Link className="kid-button primary ml-auto" to={`/map/${id}`}>
            <Map size={22} /> 开始闯关
          </Link>
        </div>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.title} className="big-card">
            <p className="text-4xl">{plan.icon}</p>
            <h3 className="mt-3 text-2xl font-black text-stone-800">{plan.title}</h3>
            <p className="mt-2 font-semibold text-stone-600">{plan.description}</p>
          </div>
        ))}
      </section>
    </Page>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-3xl font-black text-stone-800 md:text-4xl">{title}</h2>
      <p className="mt-2 text-lg font-bold text-stone-600">{subtitle}</p>
    </div>
  );
}

function SubjectMapPage() {
  const { subject = "chinese" } = useParams();
  const id = subject as SubjectId;
  const { lessonStatus } = useAppState();
  const list = lessonsBySubject(id);
  if (!list.length) return <Navigate to="/" />;
  return (
    <Page>
      <BackLink to={`/subject/${id}`} />
      <SectionTitle title={`${subjectLabel[id]}闯关地图`} subtitle="锁住的关卡会在前一关完成后亮起来。" />
      <div className="map-board">
        {list.map((lesson, index) => {
          const status = lessonStatus(lesson);
          return <MapNode key={lesson.id} lesson={lesson} index={index} status={status} />;
        })}
      </div>
    </Page>
  );
}

function MapNode({ lesson, index, status }: { lesson: Lesson; index: number; status: string }) {
  const timer = useRef<number | undefined>(undefined);
  const start = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => speak(`第 ${lesson.order} 关，${lesson.title}`), 1000);
  };
  const stop = () => window.clearTimeout(timer.current);
  const target = lesson.subject === "chinese" ? `/study/chinese/${lesson.id}` : `/quiz/${lesson.subject}/${lesson.id}`;
  const locked = status === "locked";
  return (
    <div className={`map-node-wrap ${index % 2 ? "md:translate-y-12" : ""}`}>
      <Link
        aria-disabled={locked}
        onMouseEnter={start}
        onMouseLeave={stop}
        onFocus={start}
        onBlur={stop}
        to={locked ? "#" : target}
        className={`map-node status-${status}`}
      >
        <span className="absolute right-3 top-3 rounded-full bg-white/80 px-2 py-1 text-xs font-black text-stone-600">第 {lesson.order} 关</span>
        <div className="text-4xl">{locked ? "🔒" : status === "completed" ? "🏆" : lesson.review ? "🌟" : "🚩"}</div>
        <h3 className="mt-3 text-xl font-black text-stone-800">{lesson.title}</h3>
        <p className="mt-1 text-sm font-bold text-stone-600">{lesson.subtitle}</p>
        <div className="mt-4 flex items-center justify-between text-sm font-black text-stone-500">
          <span>{lesson.questionCount} 题</span>
          <span>{lesson.minutes} 分钟</span>
        </div>
        {locked && (
          <div className="absolute inset-0 grid place-items-center rounded-[26px] bg-stone-900/35 text-white">
            <Lock size={38} />
          </div>
        )}
      </Link>
    </div>
  );
}

function ChineseStudyPage() {
  const { lessonId = "" } = useParams();
  const lesson = lessonById[lessonId];
  const { markLessonStudied } = useAppState();
  const chars = lesson?.charIds?.map((id) => charById[id]).filter(Boolean) ?? [];
  const [active, setActive] = useState(0);
  const [strokeNonce, setStrokeNonce] = useState(0);
  const current = chars[active];

  useEffect(() => {
    if (lesson) markLessonStudied(lesson);
  }, [lessonId]);

  if (!lesson || lesson.subject !== "chinese") return <Navigate to="/map/chinese" />;

  const readChar = () => {
    if (!current) return;
    speak(`${current.char}。${normalizePinyinForSpeech(current.pinyin)}。${current.words.join("，")}。${current.sentence}`);
  };

  return (
    <Page>
      <BackLink to="/map/chinese" />
      <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="big-card h-fit">
          <p className="text-sm font-black text-rose-500">{lesson.section}</p>
          <h2 className="mt-2 text-3xl font-black text-stone-800">{lesson.title}</h2>
          <p className="mt-2 font-semibold text-stone-600">{lesson.subtitle}</p>
          <div className="mt-5 grid grid-cols-4 gap-2">
            {chars.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  setActive(index);
                  setStrokeNonce((value) => value + 1);
                }}
                className={`char-tab ${active === index ? "active" : ""}`}
              >
                {item.char}
              </button>
            ))}
          </div>
          <Link className="kid-button primary mt-6 w-full justify-center" to={`/quiz/chinese/${lesson.id}`}>
            <Play size={22} /> 去闯关
          </Link>
        </aside>
        {current && (
          <section className="study-card">
            <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
              <div className="stroke-stage">
                <span className="char-outline">{current.char}</span>
                <span key={`${current.id}-${active}-${strokeNonce}`} className="char-fill">
                  {current.char}
                </span>
                <div className="stroke-dots">
                  {current.strokeOrder.slice(0, 8).map((stroke, index) => (
                    <span key={`${stroke}-${index}`} style={{ animationDelay: `${index * 0.42}s` }}>
                      {stroke}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-lg font-black text-rose-500">{current.pinyin}</p>
                  <h2 className="font-kid text-7xl font-black text-stone-900">{current.char}</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <MiniFact label="组词" value={current.words.join("、")} />
                  <MiniFact label="笔画" value={`${current.strokeCount} 画`} />
                  <MiniFact label="偏旁" value={current.radical} />
                  <MiniFact label="结构" value={current.structure} />
                </div>
                <div className="rounded-3xl bg-white/70 p-4 text-xl font-bold leading-relaxed text-stone-700">{current.sentence}</div>
                <div className="flex flex-wrap gap-3">
                  <button className="kid-button primary" onClick={readChar}>
                    <Volume2 size={22} /> 听一听
                  </button>
                  <button className="kid-button" onClick={() => setStrokeNonce((value) => value + 1)}>
                    <RefreshCw size={22} /> 看笔顺
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </Page>
  );
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white/70 p-4">
      <p className="text-sm font-black text-stone-500">{label}</p>
      <p className="mt-1 text-xl font-black text-stone-800">{value}</p>
    </div>
  );
}

function QuizPage() {
  const { subject = "chinese", lessonId = "" } = useParams();
  const navigate = useNavigate();
  const lesson = lessonById[lessonId];
  const { completeQuiz } = useAppState();
  const questions = useMemo(() => (lesson ? makeQuestions(lesson) : []), [lessonId]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<"right" | "try" | "wrong" | null>(null);
  const [wrongMap, setWrongMap] = useState<Record<string, QuizQuestion>>({});
  const [touchedWrong, setTouchedWrong] = useState<Record<string, boolean>>({});

  const current = questions[index];

  useEffect(() => {
    if (current) speak(current.speakText);
  }, [current?.id]);

  if (!lesson || lesson.subject !== subject) return <Navigate to="/" />;
  if (!current) return <Navigate to={`/map/${subject}`} />;

  const finish = (finalCorrect: number, finalWrongMap: Record<string, QuizQuestion>, finalTouched: Record<string, boolean>) => {
    const wrongQuestions = Object.values(finalWrongMap);
    const total = questions.length;
    const cleanCorrect = Math.min(total, finalCorrect);
    const ratio = cleanCorrect / total;
    const summary: QuizSummary = {
      lesson,
      total,
      correct: cleanCorrect,
      wrong: wrongQuestions.length,
      stars: ratio >= 0.9 ? 3 : ratio >= 0.65 ? 2 : 1,
      coins: 8 + cleanCorrect * 2,
      wrongQuestions,
      touchedWrongQuestionIds: Object.keys(finalTouched),
    };
    completeQuiz(summary);
    navigate(`/result/${lesson.subject}/${lesson.id}`, { state: summary });
  };

  const nextQuestion = (finalCorrect = correct, nextWrongMap = wrongMap, nextTouched = touchedWrong) => {
    window.setTimeout(() => {
      setFeedback(null);
      setAttempts(0);
      if (index + 1 >= questions.length) {
        finish(finalCorrect, nextWrongMap, nextTouched);
      } else {
        setIndex((value) => value + 1);
      }
    }, 850);
  };

  const answer = (optionId: string) => {
    if (feedback === "right" || feedback === "wrong") return;
    const isRight = optionId === current.answerId;
    if (isRight) {
      playTone("success");
      speak(touchedWrong[current.id] ? "改对了，也要再复习一下" : "真棒，答对了");
      const nextWrongMap = touchedWrong[current.id] ? { ...wrongMap, [current.id]: current } : wrongMap;
      const nextCorrect = correct + 1;
      setCorrect(nextCorrect);
      setWrongMap(nextWrongMap);
      setFeedback("right");
      nextQuestion(nextCorrect, nextWrongMap, touchedWrong);
      return;
    }

    playTone("error");
    const nextTouched = { ...touchedWrong, [current.id]: true };
    setTouchedWrong(nextTouched);
    if (attempts === 0) {
      speak("没关系，再试一次");
      setAttempts(1);
      setFeedback("try");
      window.setTimeout(() => setFeedback(null), 750);
      return;
    }
    speak("我们先记下来，下一题");
    const nextWrongMap = { ...wrongMap, [current.id]: current };
    setWrongMap(nextWrongMap);
    setFeedback("wrong");
    nextQuestion(correct, nextWrongMap, nextTouched);
  };

  return (
    <Page narrow>
      <BackLink to={`/map/${subject}`} />
      <div className="quiz-shell">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-rose-500">{lesson.title}</p>
            <h2 className="text-2xl font-black text-stone-800">{current.type}</h2>
          </div>
          <div className="rounded-full bg-white/80 px-4 py-2 text-lg font-black text-stone-700">
            {index + 1} / {questions.length}
          </div>
        </div>
        <div className="progress-rail">
          <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>
        <div className="quiz-visual">
          <button className="listen-button" onClick={() => speak(current.speakText)} aria-label="再听一遍">
            <Volume2 size={28} />
          </button>
          <div className={current.subject === "chinese" ? "font-kid text-8xl" : "whitespace-pre-line text-6xl"}>{current.visual}</div>
        </div>
        <h3 className="mb-2 mt-6 text-center text-3xl font-black text-stone-800">{current.prompt}</h3>
        {current.hint && <p className="mb-6 text-center text-lg font-bold text-stone-500">{current.hint}</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          {current.options.map((item) => (
            <div key={item.id} className="option-row">
              <button onClick={() => answer(item.id)} className="option-button">
                <span>{item.visual ?? item.label}</span>
              </button>
              <button className="speak-option" onClick={() => speak(item.speakText)} aria-label={`读选项 ${item.label}`}>
                <Mic2 size={20} />
              </button>
            </div>
          ))}
        </div>
        {feedback && (
          <div className={`feedback-bubble ${feedback}`}>
            {feedback === "right" ? <CheckCircle2 /> : feedback === "try" ? <RefreshCw /> : <XCircle />}
            {feedback === "right" ? "答对啦" : feedback === "try" ? "再试一次" : "先记下来"}
          </div>
        )}
      </div>
    </Page>
  );
}

function ResultPage() {
  const location = useLocation();
  const { subject = "chinese", lessonId = "" } = useParams();
  const lesson = lessonById[lessonId];
  const summary = location.state as QuizSummary | undefined;
  if (!lesson) return <Navigate to="/" />;
  return (
    <Page narrow>
      <div className="result-card">
        <div className="text-7xl">🎉</div>
        <h2 className="mt-4 text-4xl font-black text-stone-800">闯关完成</h2>
        <p className="mt-2 text-lg font-bold text-stone-600">{lesson.title}</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <InfoTile icon={<CheckCircle2 />} title="答对" value={`${summary?.correct ?? 0}`} tone="green" />
          <InfoTile icon={<XCircle />} title="需复习" value={`${summary?.wrong ?? 0}`} tone="rose" />
          <InfoTile icon={<Star />} title="星星" value={`${summary?.stars ?? 0}`} tone="amber" />
          <InfoTile icon={<Coins />} title="金币" value={`${summary?.coins ?? 0}`} tone="amber" />
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link className="kid-button primary" to={`/map/${subject}`}>
            <Map size={22} /> 回地图
          </Link>
          <Link className="kid-button" to={`/quiz/${subject}/${lesson.id}`}>
            <RotateCcw size={22} /> 再练一次
          </Link>
          <Link className="kid-button" to="/mistakes">
            <BookOpen size={22} /> 错字本
          </Link>
        </div>
      </div>
    </Page>
  );
}

function RewardsPage() {
  const { rewards } = useAppState();
  const badgeList = rewards.badges.length ? rewards.badges : ["第一次冒险"];
  return (
    <Page>
      <BackLink />
      <SectionTitle title="奖励中心" subtitle="星星、金币和宠物等级都会保存在本机。" />
      <div className="grid gap-4 md:grid-cols-4">
        <InfoTile icon={<Star />} title="总星星" value={`${rewards.totalStars}`} tone="amber" />
        <InfoTile icon={<Coins />} title="金币" value={`${rewards.coins}`} tone="amber" />
        <InfoTile icon={<Sparkles />} title="连续学习" value={`${rewards.streakDays} 天`} tone="rose" />
        <InfoTile icon={<Baby />} title="宠物等级" value={`${rewards.petLevel}`} tone="green" />
      </div>
      <section className="mt-6 grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
        <div className="big-card text-center">
          <div className="text-8xl">🐣</div>
          <h3 className="mt-3 text-2xl font-black text-stone-800">成长宠物</h3>
          <p className="mt-2 font-bold text-stone-600">掌握更多生字，它会慢慢升级。</p>
        </div>
        <div className="big-card">
          <h3 className="text-2xl font-black text-stone-800">徽章墙</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {badgeList.map((badge) => (
              <span key={badge} className="badge">
                <Medal size={18} /> {badge}
              </span>
            ))}
          </div>
        </div>
      </section>
    </Page>
  );
}

function MistakesPage() {
  const { mistakes, clearMistake } = useAppState();
  const list = Object.values(mistakes).sort((a, b) => b.lastMistakeAt.localeCompare(a.lastMistakeAt));
  return (
    <Page>
      <BackLink />
      <SectionTitle title="错字本" subtitle="只要题目里曾经选错过，就会被记下来。" />
      {list.length === 0 ? (
        <div className="big-card text-center">
          <div className="text-6xl">🌟</div>
          <h3 className="mt-3 text-2xl font-black text-stone-800">暂时没有错题</h3>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((item) => (
            <div key={item.id} className="big-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-rose-500">{subjectLabel[item.subject]}</p>
                  <h3 className="mt-1 text-3xl font-black text-stone-800">{item.char ?? item.title}</h3>
                  {item.pinyin && <p className="mt-1 text-xl font-black text-amber-600">{item.pinyin}</p>}
                </div>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-black text-rose-600">{item.wrongCount} 次</span>
              </div>
              {item.words && <p className="mt-3 text-lg font-bold text-stone-600">组词：{item.words.join("、")}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {item.mistakeTypes.map((type) => (
                  <span key={type} className="rounded-full bg-white/80 px-3 py-1 text-sm font-black text-stone-600">{type}</span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button className="kid-button primary" onClick={() => speak(`${item.char ?? item.title}。${item.pinyin ?? ""}。${item.words?.join("，") ?? ""}`)}>
                  <Volume2 size={20} /> 播放发音
                </button>
                <button className="kid-button" onClick={() => clearMistake(item.id)}>
                  <CheckCircle2 size={20} /> 已复习
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Page>
  );
}

function ParentPage() {
  const { reports, charRecords, rewards, resetDemo } = useAppState();
  const today = reports[todayKey()] ?? { questions: 0, correct: 0, wrong: 0, stars: 0, coins: 0 };
  const learned = Object.values(charRecords).filter((item) => item.learned).length;
  const mastered = Object.values(charRecords).filter((item) => item.masteryLevel >= 3).length;
  return (
    <Page>
      <BackLink />
      <SectionTitle title="家长中心" subtitle="本页只展示本机学习记录。" />
      <div className="grid gap-4 md:grid-cols-3">
        <InfoTile icon={<BookOpen />} title="今日题数" value={`${today.questions}`} tone="rose" />
        <InfoTile icon={<CheckCircle2 />} title="答对" value={`${today.correct}`} tone="green" />
        <InfoTile icon={<XCircle />} title="答错" value={`${today.wrong}`} tone="rose" />
        <InfoTile icon={<Star />} title="今日星星" value={`${today.stars}`} tone="amber" />
        <InfoTile icon={<Coins />} title="今日金币" value={`${today.coins}`} tone="amber" />
        <InfoTile icon={<Award />} title="掌握情况" value={`${mastered}/${learned}`} tone="green" />
      </div>
      <section className="mt-6 big-card">
        <h3 className="text-2xl font-black text-stone-800">成长概览</h3>
        <p className="mt-3 text-lg font-bold text-stone-600">累计 {rewards.totalStars} 颗星，{rewards.coins} 枚金币，宠物等级 {rewards.petLevel}。</p>
        <button className="kid-button mt-5" onClick={resetDemo}>
          <RefreshCw size={20} /> 清空演示记录
        </button>
      </section>
    </Page>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/grades" element={<GradesPage />} />
      <Route path="/grade/grade-1" element={<GradeHomePage />} />
      <Route path="/grade/grade-5" element={<GradeFivePage />} />
      <Route path="/subjects" element={<GradeHomePage />} />
      <Route path="/subject/:subject" element={<SubjectHomePage />} />
      <Route path="/map/:subject" element={<SubjectMapPage />} />
      <Route path="/study/chinese/:lessonId" element={<ChineseStudyPage />} />
      <Route path="/quiz/:subject/:lessonId" element={<QuizPage />} />
      <Route path="/result/:subject/:lessonId" element={<ResultPage />} />
      <Route path="/rewards" element={<RewardsPage />} />
      <Route path="/mistakes" element={<MistakesPage />} />
      <Route path="/parent" element={<ParentPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
