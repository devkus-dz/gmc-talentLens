"use client";
import React from 'react';
export interface Language { name: string; level: string; }
interface Props { languages: Language[]; onAdd?: () => void; onRemove?: (index: number) => void; }

export default function LanguagesCard({ languages, onAdd, onRemove }: Props) {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Languages</h2>
                {onAdd && <button type="button" onClick={onAdd} className="btn btn-xs btn-ghost text-primary">+ Add</button>}
            </div>
            <div className="flex flex-col gap-3">
                {languages.length > 0 ? languages.map((lang, index) => (
                    <div key={index} className="bg-base-200/50 p-4 rounded-2xl border border-base-content/5 flex justify-between items-center group">
                        <span className="font-bold text-sm" dir="auto">{lang.name}</span>
                        <div className="flex items-center gap-2">
                            <span className="badge badge-sm border-none bg-base-300 text-base-content/70" dir="auto">{lang.level}</span>
                            {onRemove && <button type="button" onClick={() => onRemove(index)} className="opacity-0 group-hover:opacity-100 text-error hover:text-error/70 transition-opacity">✕</button>}
                        </div>
                    </div>
                )) : <div className="text-center p-4 border border-dashed border-base-content/20 rounded-2xl text-base-content/50 text-sm">No languages added.</div>}
            </div>
        </div>
    );
}