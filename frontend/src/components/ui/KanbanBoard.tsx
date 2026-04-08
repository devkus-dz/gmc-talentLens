"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import {
    DndContext,
    useDroppable,
    useDraggable,
    DragEndEvent,
    DragStartEvent,
    closestCorners,
    DragOverlay
} from '@dnd-kit/core';

export type KanbanColumn = {
    id: string;
    title: string;
    count?: number;
    themeClass: string;
    headerBadgeClass: string;
};

export type KanbanCard = {
    id: string;
    columnId: string;
    title: string;
    subtitle: string;
    avatarUrl?: string;
    badgeText?: string;
    badgeClass?: string;
    tags?: string[];
    metaNode?: ReactNode;
    accentColor?: string;
};

interface KanbanBoardProps {
    columns: KanbanColumn[];
    cards: KanbanCard[];
    onDragEnd: (event: DragEndEvent) => void;
}

export default function KanbanBoard({ columns, cards, onDragEnd }: KanbanBoardProps) {
    // HYDRATION: Only render the board after the component has mounted on the client
    const [isMounted, setIsMounted] = useState(false);

    // OVERLAY: Track which card is currently being dragged
    const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const card = cards.find(c => c.id === active.id);
        if (card) setActiveCard(card);
    };

    const handleDragEndInternal = (event: DragEndEvent) => {
        setActiveCard(null); // Clear the overlay card
        onDragEnd(event);    // Trigger the parent's save logic
    };

    // Show nothing (or a skeleton) during SSR to prevent Hydration Mismatch
    if (!isMounted) return <div className="min-h-[600px] flex items-center justify-center text-base-content/30 font-medium">Loading Pipeline...</div>;

    return (
        <DndContext
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEndInternal}
        >
            <div className="flex-1 flex overflow-x-auto gap-4 sm:gap-6 pb-6 w-full thin-scrollbar snap-x snap-mandatory">
                {columns.map((column) => (
                    <DroppableColumn key={column.id} column={column} cards={cards.filter(c => c.columnId === column.id)} />
                ))}
            </div>

            {/* This renders the floating card outside the column's CSS restrictions */}
            <DragOverlay>
                {activeCard ? <CardDisplay card={activeCard} isOverlay /> : null}
            </DragOverlay>
        </DndContext>
    );
}

// --- INTERNAL DROPPABLE COLUMN ---
function DroppableColumn({ column, cards }: { column: KanbanColumn, cards: KanbanCard[] }) {
    const { isOver, setNodeRef } = useDroppable({ id: column.id });

    return (
        <div
            ref={setNodeRef}
            className={`min-w-[85vw] sm:min-w-[320px] w-[85vw] sm:w-[320px] rounded-4xl p-4 flex flex-col border snap-center shrink-0 h-full transition-colors ${column.themeClass} ${isOver ? 'brightness-95 ring-2 ring-primary/20' : ''}`}
        >
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="font-bold uppercase tracking-widest text-xs flex items-center">
                    {column.title}
                    {column.count !== undefined && (
                        <span className={`ml-2 badge badge-sm border-none font-bold ${column.headerBadgeClass}`}>
                            {column.count}
                        </span>
                    )}
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto thin-scrollbar flex flex-col gap-3 pb-20">
                {cards.length > 0 ? (
                    cards.map((card) => <DraggableCard key={card.id} card={card} />)
                ) : (
                    <div className="h-32 border-2 border-dashed border-base-content/10 rounded-2xl flex items-center justify-center text-base-content/30 text-sm font-medium">
                        Drop candidate here
                    </div>
                )}
            </div>
        </div>
    );
}

// --- INTERNAL DRAGGABLE WRAPPER ---
function DraggableCard({ card }: { card: KanbanCard }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: card.id,
        data: card
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="touch-none cursor-grab active:cursor-grabbing"
        >
            {/* Renders the card, but makes it faint (opacity-30) if it is currently being dragged */}
            <CardDisplay card={card} isDragging={isDragging} />
        </div>
    );
}

// --- EXTRACTED VISUAL CARD COMPONENT ---
// We extracted this so both the regular column AND the DragOverlay can share the exact same UI
function CardDisplay({ card, isDragging, isOverlay }: { card: KanbanCard, isDragging?: boolean, isOverlay?: boolean }) {
    return (
        <div className={`bg-base-100 rounded-2xl p-4 border border-base-content/5 shadow-sm relative overflow-hidden transition-all
      ${isDragging && !isOverlay ? 'opacity-30' : ''} 
      ${isOverlay ? 'rotate-3 scale-105 shadow-2xl ring-2 ring-primary/30 cursor-grabbing' : 'hover:shadow-md'}
    `}>
            {card.accentColor && <div className={`absolute left-0 top-0 bottom-0 w-1 ${card.accentColor}`}></div>}

            <div className="flex justify-between items-start mb-2 pl-2">
                <div className="flex items-center gap-3">
                    {card.avatarUrl && (
                        <div className="avatar"><div className="w-8 h-8 rounded-full"><img src={card.avatarUrl} alt={card.title} /></div></div>
                    )}
                    <h4 className="font-bold text-sm line-clamp-1">{card.title}</h4>
                </div>
                {card.badgeText && (
                    <span className={`badge badge-sm border-none font-bold shrink-0 ${card.badgeClass || 'bg-base-200 text-base-content/70'}`}>
                        {card.badgeText}
                    </span>
                )}
            </div>

            <p className="text-xs text-base-content/50 mb-3 pl-2 truncate">{card.subtitle}</p>

            {card.tags && card.tags.length > 0 && (
                <div className="flex gap-2 pl-2 mb-2 flex-wrap">
                    {card.tags.map(tag => (
                        <span key={tag} className="badge bg-base-200/50 border-none text-[10px] px-2 py-2">{tag}</span>
                    ))}
                </div>
            )}

            {card.metaNode && <div className="mt-3 pl-2">{card.metaNode}</div>}
        </div>
    );
}