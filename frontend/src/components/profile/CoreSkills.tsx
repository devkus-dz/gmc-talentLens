import React from 'react';

interface CoreSkillsProps {
    skills: string[];
    onRemoveSkill?: (skill: string) => void;
    onAddSkill?: () => void;
}

export default function CoreSkills({ skills, onRemoveSkill, onAddSkill }: CoreSkillsProps) {
    return (
        <div>
            <h2 className="font-bold text-xl mb-4">Core Skills</h2>
            <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                    <span key={skill} className="badge badge-lg border-primary/20 text-primary bg-primary/5 rounded-xl py-4 px-4 font-medium">
                        {skill}
                        <button
                            onClick={() => onRemoveSkill && onRemoveSkill(skill)}
                            className="ml-2 hover:text-error"
                        >
                            ×
                        </button>
                    </span>
                ))}
                <button
                    onClick={onAddSkill}
                    className="badge badge-lg border-dashed border-base-content/30 text-base-content/60 bg-transparent rounded-xl py-4 px-4 hover:bg-base-200 transition-colors cursor-pointer"
                >
                    + Add Skill
                </button>
            </div>
        </div>
    );
}