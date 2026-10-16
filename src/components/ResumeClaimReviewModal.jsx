import React, { useState } from 'react';
import {
  UploadCloud,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  X,
  FileText,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { ResumeIntelligenceService } from '../services/resumeClaims';

export default function ResumeClaimReviewModal({ isOpen, onClose, studentEvidence = [] }) {
  const [inputText, setInputText] = useState(
    `• Engineered high-performance React UI components with reusable design tokens.\n• Architected production microservice with Node.js and Express REST endpoints.\n• Deployed enterprise Kubernetes cluster with AWS autoscaling and Helm charts.\n• Designed relational database schemas in PostgreSQL with index query optimization.`
  );
  const [auditedClaims, setAuditedClaims] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);

  if (!isOpen) return null;

  const handleAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const lines = inputText
        .split('\n')
        .map((l) => l.replace(/^[•\-\*]\s*/, '').trim())
        .filter((l) => l.length > 5);

      const results = ResumeIntelligenceService.auditResumeClaims(lines, studentEvidence);
      setAuditedClaims(results);
      setIsAuditing(false);
    }, 400);
  };

  const handleReset = () => {
    setAuditedClaims(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-600 text-white shadow-md">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded border border-violet-500/30">
                  ProofHire Truthful Engine
                </span>
                <span className="text-xs text-slate-300">Resume Claim Cross-Auditor</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">Uploaded Resume Claim Verification</h3>
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
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Important PS6 Fairness Policy Alert */}
          <div className="p-3.5 rounded-xl bg-violet-50 border border-violet-200 text-slate-700 leading-relaxed">
            <strong className="text-violet-950 font-bold block mb-0.5">PS6 Fairness & Truthfulness Policy:</strong>
            Claims are audited strictly against registered evidence artifacts. A status of <span className="font-bold text-amber-700 bg-amber-100 px-1 py-0.2 rounded">NEEDS_REVIEW</span> means no corroborating evidence is recorded yet—it does <strong>NOT</strong> accuse the student of deception.
          </div>

          {!auditedClaims ? (
            <div className="space-y-3">
              <label className="font-bold text-slate-800 block">
                Paste or Edit Candidate Resume Claims (One Bullet Per Line):
              </label>
              <textarea
                rows={6}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none leading-relaxed"
                placeholder="Enter resume bullets..."
              />
              <p className="text-[11px] text-slate-500">
                The engine will tokenize each bullet, detect claimed competencies, and cross-reference them against verified project commits and proctored test IDs.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-800">
                  Audit Summary: {auditedClaims.filter((c) => c.status === 'SUPPORTED').length} Supported,{' '}
                  {auditedClaims.filter((c) => c.status === 'NEEDS_REVIEW').length} Need Review
                </span>
                <button
                  onClick={handleReset}
                  className="text-violet-600 hover:text-violet-800 font-bold"
                >
                  Edit Claims
                </button>
              </div>

              {auditedClaims.map((claim, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    claim.status === 'SUPPORTED'
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-amber-50/70 border-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-slate-900 leading-snug">"{claim.claimText}"</p>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                        claim.status === 'SUPPORTED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {claim.status === 'SUPPORTED' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                      )}
                      {claim.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-bold text-slate-700">Skill Detected:</span>
                    <span className="bg-white/80 px-1.5 py-0.2 rounded border border-slate-200 font-medium text-slate-800">
                      {claim.associatedSkill}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">{claim.auditReason}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Close
          </button>
          {!auditedClaims ? (
            <button
              onClick={handleAudit}
              disabled={isAuditing}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl shadow-md"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>{isAuditing ? 'Auditing Claims...' : 'Audit Resume Claims'}</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl"
            >
              Accept & Return
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
