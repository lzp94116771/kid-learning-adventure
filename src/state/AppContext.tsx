import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { charById } from "../data/chineseChars";
import { lessonsBySubject } from "../data/adventureLessons";
import {
  CharLearningRecord,
  DailyReport,
  Lesson,
  LessonProgress,
  LessonStatus,
  MistakeRecord,
  QuizSummary,
  RewardState,
  SubjectId,
} from "../types";
import { loadJson, saveJson, todayKey } from "../utils/storage";

interface AppState {
  progress: Record<string, LessonProgress>;
  charRecords: Record<string, CharLearningRecord>;
  mistakes: Record<string, MistakeRecord>;
  rewards: RewardState;
  reports: Record<string, DailyReport>;
  lessonStatus: (lesson: Lesson) => LessonStatus;
  completeQuiz: (summary: QuizSummary) => void;
  markLessonStudied: (lesson: Lesson) => void;
  clearMistake: (id: string) => void;
  resetDemo: () => void;
}

const defaultRewards: RewardState = {
  totalStars: 0,
  coins: 0,
  streakDays: 0,
  petLevel: 1,
  badges: [],
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(() => loadJson<Record<string, LessonProgress>>("kid-progress", {}));
  const [charRecords, setCharRecords] = useState(() => loadJson<Record<string, CharLearningRecord>>("kid-char-records", {}));
  const [mistakes, setMistakes] = useState(() => loadJson<Record<string, MistakeRecord>>("kid-mistakes", {}));
  const [rewards, setRewards] = useState(() => loadJson<RewardState>("kid-rewards", defaultRewards));
  const [reports, setReports] = useState(() => loadJson<Record<string, DailyReport>>("kid-reports", {}));

  useEffect(() => saveJson("kid-progress", progress), [progress]);
  useEffect(() => saveJson("kid-char-records", charRecords), [charRecords]);
  useEffect(() => saveJson("kid-mistakes", mistakes), [mistakes]);
  useEffect(() => saveJson("kid-rewards", rewards), [rewards]);
  useEffect(() => saveJson("kid-reports", reports), [reports]);

  const lessonStatus = (lesson: Lesson): LessonStatus => {
    if (progress[lesson.id]?.status === "completed") return "completed";
    const subjectLessons = lessonsBySubject(lesson.subject);
    if (lesson.order === 1) return "unlocked";
    const previous = subjectLessons.find((item) => item.order === lesson.order - 1);
    return previous && progress[previous.id]?.status === "completed" ? "unlocked" : "locked";
  };

  const markLessonStudied = (lesson: Lesson) => {
    if (lesson.subject !== "chinese") return;
    setCharRecords((prev) => {
      const next = { ...prev };
      lesson.charIds?.forEach((id) => {
        next[id] = {
          learned: true,
          correctCount: next[id]?.correctCount ?? 0,
          wrongCount: next[id]?.wrongCount ?? 0,
          masteryLevel: Math.max(next[id]?.masteryLevel ?? 0, 1),
          lastPracticedAt: new Date().toISOString(),
          nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          mistakeTypes: next[id]?.mistakeTypes ?? [],
        };
      });
      return next;
    });
  };

  const completeQuiz = (summary: QuizSummary) => {
    const now = new Date().toISOString();
    setProgress((prev) => ({
      ...prev,
      [summary.lesson.id]: {
        status: "completed",
        bestScore: Math.max(prev[summary.lesson.id]?.bestScore ?? 0, summary.correct),
        stars: Math.max(prev[summary.lesson.id]?.stars ?? 0, summary.stars),
        attempts: (prev[summary.lesson.id]?.attempts ?? 0) + 1,
        lastCompletedAt: now,
      },
    }));

    setCharRecords((prev) => {
      const next = { ...prev };
      summary.lesson.charIds?.forEach((id) => {
        const correctHits = summary.total - summary.wrongQuestions.filter((q) => q.charId === id).length;
        const wrongHits = summary.wrongQuestions.filter((q) => q.charId === id).length;
        const old = next[id];
        const types = Array.from(new Set([...(old?.mistakeTypes ?? []), ...summary.wrongQuestions.filter((q) => q.charId === id).map((q) => q.mistakeType)]));
        next[id] = {
          learned: true,
          correctCount: (old?.correctCount ?? 0) + Math.max(0, correctHits),
          wrongCount: (old?.wrongCount ?? 0) + wrongHits,
          masteryLevel: Math.min(5, Math.max(old?.masteryLevel ?? 1, wrongHits ? 1 : 2) + (wrongHits ? 0 : 1)),
          lastPracticedAt: now,
          nextReviewAt: new Date(Date.now() + (wrongHits ? 12 : 48) * 60 * 60 * 1000).toISOString(),
          mistakeTypes: types,
        };
      });
      return next;
    });

    if (summary.wrongQuestions.length) {
      setMistakes((prev) => {
        const next = { ...prev };
        summary.wrongQuestions.forEach((question) => {
          const char = question.charId ? charById[question.charId] : undefined;
          const id = question.charId ?? question.id;
          const old = next[id];
          next[id] = {
            id,
            char: char?.char,
            pinyin: char?.pinyin,
            words: char?.words,
            subject: question.subject,
            title: char ? `${char.char} 的小练习` : question.prompt,
            mistakeTypes: Array.from(new Set([...(old?.mistakeTypes ?? []), question.mistakeType])),
            wrongCount: (old?.wrongCount ?? 0) + 1,
            lastMistakeAt: now,
          };
        });
        return next;
      });
    }

    const today = todayKey();
    setReports((prev) => {
      const current = prev[today] ?? { date: today, questions: 0, correct: 0, wrong: 0, stars: 0, coins: 0 };
      return {
        ...prev,
        [today]: {
          ...current,
          questions: current.questions + summary.total,
          correct: current.correct + summary.correct,
          wrong: current.wrong + summary.wrong,
          stars: current.stars + summary.stars,
          coins: current.coins + summary.coins,
        },
      };
    });

    setRewards((prev) => {
      const last = prev.lastStudyDate;
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      const streakDays = last === today ? prev.streakDays : last === yesterday ? prev.streakDays + 1 : 1;
      const masteredCount = Object.values(charRecords).filter((record) => record.masteryLevel >= 3).length;
      const petLevel = Math.max(prev.petLevel, Math.min(9, 1 + Math.floor((masteredCount + summary.correct) / 10)));
      const badges = new Set(prev.badges);
      if (summary.stars >= 3) badges.add("三星闯关家");
      if (summary.lesson.subject === "chinese") badges.add("识字小勇士");
      if (streakDays >= 3) badges.add("连续学习星");
      return {
        totalStars: prev.totalStars + summary.stars,
        coins: prev.coins + summary.coins,
        streakDays,
        petLevel,
        badges: Array.from(badges),
        lastStudyDate: today,
      };
    });
  };

  const clearMistake = (id: string) => {
    setMistakes((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const resetDemo = () => {
    setProgress({});
    setCharRecords({});
    setMistakes({});
    setRewards(defaultRewards);
    setReports({});
  };

  const value = useMemo(
    () => ({ progress, charRecords, mistakes, rewards, reports, lessonStatus, completeQuiz, markLessonStudied, clearMistake, resetDemo }),
    [progress, charRecords, mistakes, rewards, reports],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const state = useContext(AppContext);
  if (!state) throw new Error("useAppState must be used inside AppProvider");
  return state;
}
