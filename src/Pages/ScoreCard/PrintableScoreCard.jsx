import React, { useMemo, forwardRef, memo } from "react";
import { scorecardData } from "./scorecardData";
import ScorecardBarChart from "./ScorecardBarChart";
import ScorecardAnalytics from "./ScorecardAnalytics";

/**
 * PrintableScoreCard
 * - Works with both "simple" (number-only) and "complex" (object with score/answers/skipped) inputs.
 * - Accessible (adds roles/labels), resilient (guards for missing data), and print-friendly.
 */

const DEFAULT_BENCHMARK = { cognitive: 7.5, physical: 6.8, emotional: 7.2, spiritual: 6.5 };
const CATEGORY_ORDER = ["cognitive", "physical", "emotional", "spiritual"];

const clamp01 = (n) => (Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0);
const to1dp = (n) => (Number.isFinite(n) ? n.toFixed(1) : "0.0");

const PrintableScoreCard = forwardRef(
  (
    {
      scores,
      benchmarkScores = DEFAULT_BENCHMARK,
      title = "Your Leadership Score",
      showCharts = true,
      className = "",
    },
    ref
  ) => {
    // Determine input shape once
    const isComplex = useMemo(() => {
      const vals = Object.values(scores ?? {});
      return vals.length > 0 && vals.every((v) => v && typeof v === "object" && "score" in v);
    }, [scores]);

    // Normalise category keys and order them predictably
    const categories = useMemo(() => {
      const keys = Object.keys(scores ?? {});
      // Keep known order first, then any extras in alpha order
      const known = CATEGORY_ORDER.filter((k) => keys.includes(k));
      const extras = keys.filter((k) => !CATEGORY_ORDER.includes(k)).sort();
      return [...known, ...extras];
    }, [scores]);

    // Compute average robustly
    const averageScore = useMemo(() => {
      const vals = categories.map((cat) => {
        const v = scores?.[cat];
        const s = isComplex ? Number.parseFloat(v?.score) : Number.parseFloat(v);
        return Number.isFinite(s) ? s : 0;
      });
      if (vals.length === 0) return "0.0";
      const sum = vals.reduce((a, b) => a + b, 0);
      return to1dp(sum / vals.length);
    }, [scores, categories, isComplex]);

    // Precompute per-category derived data
    const perCategory = useMemo(() => {
      return categories.map((category) => {
        const raw = scores?.[category];
        const score = isComplex ? Number.parseFloat(raw?.score) : Number.parseFloat(raw);
        const safeScore = Number.isFinite(score) ? score : 0;

        const meta = scorecardData?.[category] ?? { questions: [], feedback: { low: "", high: "" } };
        const totalQuestions = meta.questions?.length ?? 0;

        let answeredCount = totalQuestions;
        if (isComplex) {
          const answers = raw?.answers ?? {};
          const skipped = raw?.skipped ?? {};
          const answeredKeys = Object.keys(answers);
          const skippedCount = Object.values(skipped).filter(Boolean).length;
          answeredCount = Math.max(0, answeredKeys.length - skippedCount);
        }

        const benchmark = Number.parseFloat(benchmarkScores?.[category]);
        const hasBenchmark = Number.isFinite(benchmark);
        const delta = hasBenchmark ? safeScore - benchmark : null;

        const feedback =
          safeScore < 5
            ? meta?.feedback?.low ?? ""
            : meta?.feedback?.high ?? "";

        return {
          category,
          score: safeScore,
          totalQuestions,
          answeredCount,
          benchmark: hasBenchmark ? benchmark : null,
          delta,
          feedback,
        };
      });
    }, [scores, benchmarkScores, categories, isComplex]);

    return (
      <div
        ref={ref}
        id="printable-scorecard-root"
        className={`max-w-[794px] mx-auto bg-white text-gray-900 p-8 print:p-6 ${className}`}
        style={{ lineHeight: 1.45 }}
      >
        {/* Header */}
        <h2 className="text-4xl font-extrabold mb-3 text-center">{title}</h2>
        <p className="text-lg mb-8 text-center">
          Average Score:{" "}
          <span
            className={parseFloat(averageScore) < 5 ? "text-red-600" : "text-green-600"}
            aria-live="polite"
          >
            {averageScore} / 10
          </span>
        </p>

        {/* Category list */}
        <ul className="mb-8 space-y-6">
          {perCategory.map(
            ({ category, score, totalQuestions, answeredCount, benchmark, delta, feedback }) => (
              <li
                key={category}
                className="pb-4 border-b border-gray-200"
                style={{ breakInside: "avoid" }}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <strong className="capitalize text-xl font-semibold text-gray-800">
                    {category} Intelligence: {to1dp(score)} / 10{" "}
                    {answeredCount < totalQuestions && totalQuestions > 0 && (
                      <span className="text-sm text-gray-500 ml-1">
                        ({answeredCount}/{totalQuestions} answered)
                      </span>
                    )}
                  </strong>

                  {benchmark !== null && (
                    <span className="text-sm text-gray-600">
                      {delta >= 0 ? "+" : ""}
                      {to1dp(delta)} vs {to1dp(benchmark)}
                    </span>
                  )}
                </div>

                {/* Accessible progress bar */}
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2" aria-hidden>
                  <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={10}
                    aria-valuenow={Number.isFinite(score) ? score : 0}
                    aria-label={`${category} score`}
                    className={`h-2 rounded-full ${score < 5 ? "bg-red-500" : "bg-green-600"}`}
                    style={{ width: `${clamp01(score / 10) * 100}%` }}
                  />
                </div>

                {feedback && (
                  <div className="mt-3 text-base text-gray-700">{feedback}</div>
                )}
              </li>
            )
          )}
        </ul>

        {/* Charts */}
        {showCharts && isComplex && perCategory.length > 0 && (
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"
            style={{ breakInside: "avoid" }}
          > <p className="text-2xl mb-6 w-full font-medium text-gray-800">
                  Leadership Dimensions Balance
                </p>
            <div className="flex justify-center items-center">
               
              <ScorecardBarChart scores={scores} isDark={false} />
            </div>

            <div className="flex justify-center items-center">
                
                 
              <ScorecardAnalytics
                scores={scores}
                isDark={false}
                benchmarkScores={benchmarkScores}
              />
            </div>
          </div>
        )}

        {/* Questions & answers */}
        {isComplex && categories.length > 0 && (
          <div className="mt-8" style={{ breakInside: "avoid" }}>
            <h3 className="text-xl font-semibold mb-4">All Questions &amp; Answers</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {categories.map((category) => {
                const meta = scorecardData?.[category];
                if (!meta) return null;

                const questions = meta?.questions ?? [];
                const answers = scores?.[category]?.answers ?? {};
                const skipped = scores?.[category]?.skipped ?? {};

                return (
                  <div
                    key={category}
                    className="bg-white border border-gray-200 rounded-xl p-4"
                    style={{ breakInside: "avoid" }}
                  >
                    <h4 className="text-lg font-medium capitalize mb-2 text-gray-800">
                      {category} Intelligence
                    </h4>

                    <ul className="space-y-2">
                      {questions.map((q, i) => {
                        const key = `${category}${i + 1}`;
                        const answer = answers[key];
                        const isSkipped = !!skipped[key];
                        return (
                          <li key={i} className="text-sm text-gray-700">
                            <span className="font-medium">{q}</span>
                            <span className="ml-2">
                              {isSkipped
                                ? "Skipped"
                                : Number.isFinite(Number(answer))
                                ? `Score: ${answer}/10`
                                : "Not answered"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);

const Card = memo(function Card({ title, children }) {
  return (
    <div className="p-4 rounded-xl bg-white border border-gray-200">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
});

export default memo(PrintableScoreCard);
