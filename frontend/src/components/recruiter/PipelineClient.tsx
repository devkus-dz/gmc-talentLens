"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import KanbanBoard, { KanbanColumn, KanbanCard } from '@/components/ui/KanbanBoard';
import { DragEndEvent } from '@dnd-kit/core';
import api from '@/lib/api';
import { Sparkles } from 'lucide-react';
import PipelineCardMeta from './PipelineCardMeta';
import SearchableDropdown from '@/components/ui/SearchableDropdown';

const PIPELINE_STAGES = [
    { id: 'Applied', title: 'Applied', themeClass: 'bg-base-200/30 border-base-content/5', badgeClass: 'bg-base-300 text-base-content/70' },
    { id: 'In Review', title: 'In Review', themeClass: 'bg-primary/5 border-primary/10', badgeClass: 'bg-primary/20 text-primary', accentColor: 'bg-primary' },
    { id: 'Interview', title: 'Interview', themeClass: 'bg-warning/5 border-warning/10', badgeClass: 'bg-warning/20 text-warning', accentColor: 'bg-warning' },
    { id: 'Offered', title: 'Offered', themeClass: 'bg-success/5 border-success/10', badgeClass: 'bg-success/20 text-success', accentColor: 'bg-success' },
    { id: 'Rejected', title: 'Rejected', themeClass: 'bg-error/5 border-error/10', badgeClass: 'bg-error/20 text-error' },
];

interface PipelineClientProps {
    jobs: any[];
    initialJobId?: string;
}

export default function PipelineClient({ jobs, initialJobId }: PipelineClientProps) {
    const initialJob = jobs.find(j => (j._id || j.id) === initialJobId) || null;

    const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId || '');
    const [selectedJob, setSelectedJob] = useState<any>(initialJob);

    const [jobSearch, setJobSearch] = useState<string>(initialJob?.title || '');
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [jobOptions, setJobOptions] = useState<any[]>([]);
    const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(false);
    const [showClosedOnly, setShowClosedOnly] = useState<boolean>(true);

    const [applicants, setApplicants] = useState<any[]>([]);
    const [isLoadingPipeline, setIsLoadingPipeline] = useState(false);
    const [isScoring, setIsScoring] = useState(false);

    const isClosedJob = selectedJob?.status === 'CLOSED';

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(jobSearch), 300);
        return () => clearTimeout(timer);
    }, [jobSearch]);

    useEffect(() => {
        const fetchJobsForDropdown = async () => {
            setIsLoadingJobs(true);
            try {
                const statusQuery = showClosedOnly ? '&status=CLOSED' : '&status=PUBLISHED';
                const isSearchingNewTerm = debouncedSearch !== selectedJob?.title;
                const searchQuery = (debouncedSearch && isSearchingNewTerm) ? `&search=${encodeURIComponent(debouncedSearch)}` : '';

                const res = await api.get(`/jobs?limit=20${statusQuery}${searchQuery}`);
                setJobOptions(res.data.data || []);
            } catch (error) {
                console.error("Failed to fetch jobs for dropdown", error);
            } finally {
                setIsLoadingJobs(false);
            }
        };
        fetchJobsForDropdown();
    }, [debouncedSearch, showClosedOnly, selectedJob?.title]);

    const fetchApplicants = async () => {
        if (!selectedJobId) return;
        setIsLoadingPipeline(true);
        try {
            const res = await api.get(`/jobs/${selectedJobId}/applicants`);
            setApplicants(res.data.applicants || []);
        } catch (error) {
            console.error("Failed to fetch applicants:", error);
            setApplicants([]);
        } finally {
            setIsLoadingPipeline(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, [selectedJobId]);

    const handleRunAIScoring = async () => {
        if (!selectedJobId) return;
        setIsScoring(true);
        try {
            await api.get(`/jobs/${selectedJobId}/matches`);
            await fetchApplicants();
        } catch (error) {
            console.error("AI Scoring failed:", error);
            alert("Failed to run AI Candidate Scoring. Check backend logs.");
        } finally {
            setIsScoring(false);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const applicantId = active.id as string;
        const newStatus = over.id as string;

        const applicant = applicants.find(a => (a.candidate._id || a.candidate.id) === applicantId);
        if (!applicant || applicant.status === newStatus) return;

        const previousApplicants = [...applicants];
        setApplicants((prev) => prev.map((c) => (c.candidate._id || c.candidate.id) === applicantId ? { ...c, status: newStatus } : c));

        try {
            await api.patch(`/jobs/${selectedJobId}/applicants/${applicantId}/status`, { status: newStatus });
        } catch (error) {
            setApplicants(previousApplicants);
            alert("Failed to save status change. Reverting.");
        }
    };

    const columns: KanbanColumn[] = PIPELINE_STAGES.map(stage => ({
        id: stage.id,
        title: stage.title,
        count: applicants.filter(c => c.status === stage.id).length,
        themeClass: stage.themeClass,
        headerBadgeClass: stage.badgeClass,
    }));

    const cards: KanbanCard[] = applicants.map(app => {
        const stageConfig = PIPELINE_STAGES.find(s => s.id === app.status);
        return {
            id: app.candidate._id || app.candidate.id,
            columnId: app.status,
            title: `${app.candidate.firstName} ${app.candidate.lastName}`,
            subtitle: `Applied ${new Date(app.appliedAt).toLocaleDateString()}`,
            avatarUrl: app.candidate.profilePictureUrl || `https://ui-avatars.com/api/?name=${app.candidate.firstName}+${app.candidate.lastName}&background=f3f4f6`,
            metaNode: <PipelineCardMeta app={app} isClosedJob={isClosedJob} />,
            accentColor: stageConfig?.accentColor,
        };
    });

    return (
        <div className="flex flex-col gap-6 flex-1 min-h-0 max-w-[1600px] mx-auto w-full animate-fade-in p-2">
            <PageHeader
                title="Kanban Pipeline"
                description="Manage your candidate pipeline and run AI scoring on closed jobs."
                action={
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto relative">
                        {isClosedJob && (
                            <button
                                onClick={handleRunAIScoring}
                                disabled={isScoring || applicants.length === 0}
                                className="btn bg-linear-to-r from-indigo-500 to-purple-500 text-white border-none shadow-md hover:shadow-lg h-12 rounded-xl w-full sm:w-auto px-6"
                            >
                                {isScoring ? (
                                    <><span className="loading loading-spinner loading-sm"></span> Analyzing...</>
                                ) : (
                                    <><Sparkles className="w-5 h-5 mr-2" /> Score Candidates</>
                                )}
                            </button>
                        )}

                        {/* --- WIDER DROPDOWN COMPONENT --- */}
                        <SearchableDropdown
                            className="w-full sm:w-96 lg:w-[450px]"
                            value={selectedJob}
                            onChange={(job) => {
                                setSelectedJobId(job._id || job.id);
                                setSelectedJob(job);
                            }}
                            searchTerm={jobSearch}
                            onSearchChange={setJobSearch}
                            options={jobOptions}
                            isLoading={isLoadingJobs}
                            placeholder="Search job offers..."
                            getDisplayValue={(job) => job.title}
                            noOptionsText="No jobs found matching this criteria."
                            filterNode={
                                <>
                                    <span className="text-xs font-bold text-base-content/50 uppercase tracking-widest">Filter Search</span>
                                    <label className="cursor-pointer label p-0 flex gap-2">
                                        <span className="label-text text-sm font-semibold text-base-content/70">Closed Only</span>
                                        <input
                                            type="checkbox"
                                            className="toggle toggle-sm toggle-primary"
                                            checked={showClosedOnly}
                                            onChange={(e) => setShowClosedOnly(e.target.checked)}
                                        />
                                    </label>
                                </>
                            }
                            renderOption={(job) => (
                                <>
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="font-bold text-base text-base-content line-clamp-1">{job.title}</div>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${job.status === 'CLOSED' ? 'bg-base-300 text-base-content/60' : 'bg-success/15 text-success'}`}>
                                            {job.status}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium text-base-content/50 mt-1.5 line-clamp-1">{job.department} • {job.location}</div>
                                </>
                            )}
                        />
                    </div>
                }
            />

            {isLoadingPipeline ? (
                <div className="flex items-center justify-center flex-1 text-base-content/50">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : selectedJobId ? (
                <KanbanBoard columns={columns} cards={cards} onDragEnd={handleDragEnd} />
            ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-base-content/50 font-medium bg-base-200/20 rounded-4xl border border-dashed border-base-content/10 p-10 text-center gap-4">
                    <Sparkles className="w-12 h-12 opacity-20" />
                    <span>Search and select a job offer from the dropdown to view its pipeline.</span>
                </div>
            )}
        </div>
    );
}