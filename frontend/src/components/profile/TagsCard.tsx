"use client";

import React from 'react';

interface TagsCardProps {
    tags: string[];
    onRemoveTag?: (tag: string) => void;
    onAddTag?: () => void;
}

/**
 * Renders an interactive list of high-level professional tags.
 * @param {TagsCardProps} props - The component properties.
 * @returns {React.JSX.Element} The tags UI.
 */
export default function TagsCard({ tags, onRemoveTag, onAddTag }: TagsCardProps) {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl">Professional Tags</h2>
            </div>
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <span key={tag} className="badge badge-lg border-secondary/20 text-secondary bg-secondary/5 rounded-xl py-4 px-4 font-medium">
                        {tag}
                        {onRemoveTag && (
                            <button
                                onClick={() => onRemoveTag(tag)}
                                className="ml-2 hover:text-error"
                                type="button"
                            >
                                ×
                            </button>
                        )}
                    </span>
                ))}

                {onAddTag && (
                    <button
                        onClick={onAddTag}
                        type="button"
                        className="badge badge-lg border-dashed border-base-content/30 text-base-content/60 bg-transparent rounded-xl py-4 px-4 hover:bg-base-200 transition-colors cursor-pointer"
                    >
                        + Add Tag
                    </button>
                )}
            </div>
        </div>
    );
}