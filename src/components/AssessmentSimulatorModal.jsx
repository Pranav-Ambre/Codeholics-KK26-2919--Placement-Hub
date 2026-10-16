import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Award,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { MCQ_ASSESSMENT_BANK, AssessmentEngine } from '../services/assessmentEngine';

export default function AssessmentSimulatorModal({ isOpen, onClose, onAssessmentCompleted, onShowToast }) {
  const [selectedSkillId, setSelectedSkillId] = useState('skill-react');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [attemptResult, setAttemptResult] = useState(null);

  if (!isOpen) return null;

  const questions = MCQ_ASSESSMENT_BANK[selectedSkillId] || [];
  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (idx) => {
    if (attemptResult) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: idx
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const submissions = questions.map((q) => ({
      questionId: q.id,
      selectedIndex: userAnswers[q.id] !== undefined ? userAnswers[q.id] : -1
    }));

    const result = AssessmentEngine.gradeAttempt('student-alex-001', selectedSkillId, submissions);
    setAttemptResult(result);

    if (onAssessmentCompleted) {
      onAssessmentCompleted(result);
    }

    if (onShowToast) {
      onShowToast({
        type: result.passed ? 'success' : 'warning',
        title: result.passed ? 'Proctored Assessment Passed!' : 'Assessment Attempt Recorded',
        message: `Scored ${result.score}%. Verification hash: ${result.proctoredId}`
      });
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setAttemptResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-600 text-white shadow-md">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded border border-violet-500/30">
                  Proctored Benchmarking
                </span>
                <span className="text-xs text-slate-300">Automated MCQ Engine</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">Skill Verification Assessment</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Skill Selector if not started */}
          {!attemptResult && (
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <label className="font-bold text-slate-700">Select Skill Domain:</label>
              <select
                value={selectedSkillId}
                onChange={(e) => {
                  setSelectedSkillId(e.target.value);
                  handleReset();
                }}
                className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-800"
              >
                <option value="skill-react">React (Component Architecture)</option>
                <option value="skill-typescript">TypeScript (Type Narrowing & Interfaces)</option>
                <option value="skill-postgres">PostgreSQL (RLS & Indexing)</option>
              </select>
            </div>
          )}

          {!attemptResult ? (
            <div>
              {/* Progress Bar */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 font-medium">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>Proctored Session Active</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4">
                <div
                  className="bg-violet-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4">
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {currentQ?.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {currentQ?.options.map((option, idx) => {
                  const isSelected = userAnswers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-violet-50 border-violet-500 text-violet-900 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isSelected ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl border text-center ${
                attemptResult.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="inline-flex p-3 rounded-full bg-white shadow-sm mb-2">
                  {attemptResult.passed ? (
                    <Award className="w-8 h-8 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-amber-600" />
                  )}
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {attemptResult.passed ? 'Assessment Passed & Verified' : 'Assessment Completed (Retake Suggested)'}
                </h3>
                <div className="mt-1 text-2xl font-black text-slate-900">
                  {attemptResult.score}% Score
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Proctored Certificate Hash: <code className="font-mono font-bold">{attemptResult.proctoredId}</code>
                </p>
              </div>

              {/* Question breakdown */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 uppercase text-[10.5px]">Evaluation Breakdown</h5>
                {questions.map((q, i) => {
                  const ans = attemptResult.answers.find((a) => a.questionId === q.id);
                  const isCorrect = ans?.correct;
                  return (
                    <div key={q.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold text-slate-900">{i + 1}. {q.question}</p>
                          <p className="text-[10.5px] text-slate-600 mt-1">{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {!attemptResult ? (
            <>
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Submit & Benchmark</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl"
              >
                Done & Record Evidence
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
