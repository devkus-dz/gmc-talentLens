import React from 'react';

interface PersonalInfoFormProps {
    firstName: string;
    lastName: string;
    email: string;
}

export default function PersonalInfoForm({ firstName, lastName, email }: PersonalInfoFormProps) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl">Personal Information</h2>
                <button className="btn btn-sm btn-ghost text-primary hover:bg-primary/10 rounded-xl">Edit</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                {/* First Name */}
                <label className="form-control w-full">
                    <div className="label pb-1">
                        <span className="label-text text-[10px] font-bold uppercase tracking-wider text-base-content/50">
                            First Name
                        </span>
                    </div>
                    <input
                        type="text"
                        defaultValue={firstName}
                        placeholder="e.g. Jane"
                        className="input input-bordered w-full bg-base-200/30 border-base-content/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm font-medium"
                    />
                </label>

                {/* Last Name */}
                <label className="form-control w-full">
                    <div className="label pb-1">
                        <span className="label-text text-[10px] font-bold uppercase tracking-wider text-base-content/50">
                            Last Name
                        </span>
                    </div>
                    <input
                        type="text"
                        defaultValue={lastName}
                        placeholder="e.g. Doe"
                        className="input input-bordered w-full bg-base-200/30 border-base-content/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm font-medium"
                    />
                </label>

                {/* Email Address - Spans both columns on desktop */}
                <label className="form-control w-full sm:col-span-2">
                    <div className="label pb-1">
                        <span className="label-text text-[10px] font-bold uppercase tracking-wider text-base-content/50">
                            Email Address
                        </span>
                    </div>
                    <input
                        type="email"
                        defaultValue={email}
                        placeholder="jane.doe@example.com"
                        className="input input-bordered w-full bg-base-200/30 border-base-content/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm font-medium"
                    />
                </label>

            </div>
        </div>
    );
}