"use client";
import React from 'react';
export interface Certification { name: string; issuer: string; date?: string; }
interface Props { certifications: Certification[]; onAdd?: () => void; onRemove?: (index: number) => void; }

export default function CertificationsCard({ certifications, onAdd, onRemove }: Props) {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Certifications</h2>
                {onAdd && <button type="button" onClick={onAdd} className="btn btn-xs btn-ghost text-primary">+ Add</button>}
            </div>
            <div className="flex flex-col gap-3">
                {certifications.length > 0 ? certifications.map((cert, index) => (
                    <div key={index} className="bg-base-200/50 p-4 rounded-2xl border border-base-content/5 flex gap-3 items-center group relative">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 11.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm leading-tight" dir="auto">{cert.name}</h4>
                            <p className="text-xs text-base-content/50 mt-0.5" dir="auto">{cert.issuer} {cert.date && `• ${cert.date}`}</p>
                        </div>
                        {onRemove && <button type="button" onClick={() => onRemove(index)} className="absolute right-4 opacity-0 group-hover:opacity-100 text-error hover:text-error/70 transition-opacity">✕</button>}
                    </div>
                )) : <div className="text-center p-4 border border-dashed border-base-content/20 rounded-2xl text-base-content/50 text-sm">No certifications added.</div>}
            </div>
        </div>
    );
}