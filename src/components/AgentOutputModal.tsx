import React from 'react';
import { X, AlertCircle, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface AgentOutputModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: {
        task: string;
        agentOutput?: string;
        confidenceScore?: number;
        nextSteps?: string[];
        failureReason?: string;
        status: string;
    } | null;
}

export const AgentOutputModal: React.FC<AgentOutputModalProps> = ({ isOpen, onClose, task }) => {
    if (!isOpen || !task) return null;

    const isSuccess = task.status === 'done';
    const isFailed = task.status === 'failed';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm">
            <div
                className="w-full max-w-xl glass-heavy rounded-2xl shadow-xl overflow-hidden relative animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-8 border-b border-slate-200/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSuccess ? 'bg-green-100/50 text-green-600' : isFailed ? 'bg-red-100/50 text-red-600' : 'bg-blue-100/50 text-blue-600'} backdrop-blur-sm`}>
                            {isSuccess ? <CheckCircle2 size={24} /> : isFailed ? <AlertCircle size={24} /> : <Zap size={24} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {isSuccess ? 'Task Completed' : isFailed ? 'Task Failed' : 'Processing'}
                            </h2>
                            <p className="text-slate-500 text-sm font-medium">Automated Agent Status</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50/50 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                    {/* Objective Info */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-slate-400">Task</label>
                        <p className="text-lg font-semibold text-slate-900 leading-snug">"{task.task}"</p>
                    </div>

                    {/* Confidence Score */}
                    {isSuccess && task.confidenceScore !== undefined && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <label className="text-xs font-bold uppercase tracking-wide text-slate-400">Confidence</label>
                                <span className="text-lg font-bold text-blue-600">{task.confidenceScore}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100/50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 rounded-full"
                                    style={{ width: `${task.confidenceScore}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Resolution / Failure */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            {isSuccess ? 'Result' : 'Error'}
                        </label>
                        <div className={`p-6 rounded-xl border ${isSuccess ? 'bg-slate-50/50 border-slate-100/50' : 'bg-red-50/50 border-red-100/50'}`}>
                            <p className={`text-base font-medium leading-relaxed ${isSuccess ? 'text-slate-700' : 'text-red-600'}`}>
                                {isSuccess ? task.agentOutput : task.failureReason || 'An error occurred during processing.'}
                            </p>
                        </div>
                    </div>

                    {/* Next Steps */}
                    {isSuccess && task.nextSteps && task.nextSteps.length > 0 && (
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-wide text-slate-400">Next Steps</label>
                            <div className="grid grid-cols-1 gap-2">
                                {task.nextSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white/40 border border-slate-200/50 rounded-xl">
                                        <div className="w-6 h-6 rounded-full bg-blue-50/50 flex items-center justify-center text-blue-600 shrink-0">
                                            <ArrowRight size={12} strokeWidth={3} />
                                        </div>
                                        <span className="text-slate-600 font-medium text-sm">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200/50 bg-slate-50/30 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-sm active:scale-[0.98]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
