"use client";

import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import KanbanBoard, { KanbanColumn, KanbanCard } from '@/components/ui/KanbanBoard';
import { DragEndEvent } from '@dnd-kit/core';

// --- THE DYNAMIC BOARD CONFIGURATION ---
// We can define any stages we want here. The board will build itself automatically!
const PIPELINE_STAGES = [
    { id: 'applied', title: 'Applied', themeClass: 'bg-base-200/30 border-base-content/5', badgeClass: 'bg-base-300 text-base-content/70' },
    { id: 'review', title: 'In Review', themeClass: 'bg-primary/5 border-primary/10', badgeClass: 'bg-primary/20 text-primary', accentColor: 'bg-primary' },
    { id: 'interview', title: 'Interview', themeClass: 'bg-warning/5 border-warning/10', badgeClass: 'bg-warning/20 text-warning', accentColor: 'bg-warning' },
    { id: 'offered', title: 'Offered', themeClass: 'bg-success/5 border-success/10', badgeClass: 'bg-success/20 text-success', accentColor: 'bg-success' },
    { id: 'rejected', title: 'Rejected', themeClass: 'bg-error/5 border-error/10', badgeClass: 'bg-error/20 text-error' },
];

// --- MOCK DATA ---
const MOCK_JOBS = [
    { id: 'job-1', title: 'Senior Product Designer', department: 'Design', status: 'Published' },
    { id: 'job-2', title: 'Fullstack Engineer', department: 'Engineering', status: 'Published' },
    { id: 'job-3', title: 'Marketing Director', department: 'Marketing', status: 'Closed' }, // Won't show in dropdown!
];

const INITIAL_CANDIDATES = [
    { id: 'c-1', jobId: 'job-1', status: 'applied', name: 'Felix Brown', match: '72%', time: '2 hours ago', skills: ['Figma', 'UX'], avatar: 'https://ui-avatars.com/api/?name=Felix+Brown&background=f3f4f6' },
    { id: 'c-2', jobId: 'job-1', status: 'review', name: 'Maya Jenkins', match: '89%', time: '1 day ago', skills: ['Design Systems', 'Leadership'], avatar: 'https://ui-avatars.com/api/?name=Maya+Jenkins&background=0D1117&color=fff' },
    { id: 'c-3', jobId: 'job-1', status: 'interview', name: 'Sam Wilson', match: '94%', time: 'Today @ 2:00 PM', skills: ['UI/UX', 'Prototyping'], avatar: 'https://ui-avatars.com/api/?name=Sam+Wilson&background=0284c7&color=fff' },
    { id: 'c-4', jobId: 'job-2', status: 'applied', name: 'Alex Rivera', match: '65%', time: '5 hours ago', skills: ['React', 'TypeScript'], avatar: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=f3f4f6' },
];

export default function PipelineKanban() {
    const [selectedJobId, setSelectedJobId] = useState<string>(MOCK_JOBS[0].id);
    const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);

    const activeCandidates = useMemo(() => {
        return candidates.filter(c => c.jobId === selectedJobId);
    }, [candidates, selectedJobId]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const cardId = active.id;
        const newStatus = over.id as string;

        setCandidates((prev) =>
            prev.map((c) => c.id === cardId ? { ...c, status: newStatus } : c)
        );
    };

    // --- DYNAMICALLY GENERATE COLUMNS ---
    // Instead of hardcoding 5 objects, we just map over our configuration
    const columns: KanbanColumn[] = PIPELINE_STAGES.map(stage => ({
        id: stage.id,
        title: stage.title,
        count: activeCandidates.filter(c => c.status === stage.id).length,
        themeClass: stage.themeClass,
        headerBadgeClass: stage.badgeClass,
    }));

    // --- DYNAMICALLY GENERATE CARDS ---
    const cards: KanbanCard[] = activeCandidates.map(c => {
        // Look up the stage configuration to find the correct accent color
        const stageConfig = PIPELINE_STAGES.find(s => s.id === c.status);

        return {
            id: c.id,
            columnId: c.status,
            title: c.name,
            subtitle: c.time,
            avatarUrl: c.avatar,
            badgeText: c.match,
            badgeClass: c.match && parseInt(c.match) > 85 ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content/70',
            tags: c.skills,
            accentColor: stageConfig?.accentColor,
            metaNode: c.status === 'interview' ? (
                <div className="bg-warning/10 text-warning-content text-[10px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 w-max">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" /></svg>
                    Zoom link attached
                </div>
            ) : undefined
        };
    });

    return (
        <div className="flex flex-col gap-6 flex-1 min-h-0 max-w-[1600px] mx-auto w-full animate-fade-in p-2">
            <PageHeader
                title="Kanban Pipeline"
                description="Select an active job requisition to manage its candidate pipeline."
                action={
                    <select
                        className="select select-bordered bg-base-100 border-base-content/10 font-medium w-full sm:w-64 rounded-xl shadow-sm focus:outline-primary/20"
                        value={selectedJobId}
                        onChange={(e) => setSelectedJobId(e.target.value)}
                    >
                        {MOCK_JOBS.filter(job => job.status === 'Published').map(job => (
                            <option key={job.id} value={job.id}>{job.title} ({job.department})</option>
                        ))}
                    </select>
                }
            />

            <KanbanBoard columns={columns} cards={cards} onDragEnd={handleDragEnd} />
        </div>
    );
}