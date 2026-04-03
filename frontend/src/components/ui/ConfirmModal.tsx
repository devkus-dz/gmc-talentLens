import React from 'react';

interface ConfirmModalProps {
    id: string; // Unique ID to open/close the modal
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    isLoading?: boolean;
    isDestructive?: boolean; // If true, makes the button Red (Error). If false, Primary.
}

export default function ConfirmModal({
    id,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    isLoading = false,
    isDestructive = true
}: ConfirmModalProps) {

    // Function to safely close the modal
    const closeModal = () => {
        const modal = document.getElementById(id) as HTMLDialogElement;
        if (modal) modal.close();
    };

    return (
        <dialog id={id} className="modal modal-bottom sm:modal-middle">
            <div className="modal-box p-6 sm:p-8 rounded-4xl bg-base-100 shadow-xl">

                {/* Icon based on destructive action */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                    {isDestructive ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                    )}
                </div>

                <h3 className="font-bold text-xl text-base-content mb-2">{title}</h3>
                <p className="text-base-content/70 leading-relaxed text-sm">
                    {message}
                </p>

                <div className="modal-action mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="btn btn-ghost hover:bg-base-200 rounded-xl flex-1 sm:flex-none order-2 sm:order-1"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`btn rounded-xl flex-1 sm:flex-none px-8 shadow-sm order-1 sm:order-2 ${isDestructive ? 'btn-error text-error-content hover:bg-error/90' : 'btn-primary'
                            }`}
                    >
                        {isLoading ? <span className="loading loading-spinner loading-sm"></span> : confirmText}
                    </button>
                </div>
            </div>

            {/* Clicking outside the modal closes it (unless it's currently loading) */}
            <form method="dialog" className="modal-backdrop">
                <button disabled={isLoading}>close</button>
            </form>
        </dialog>
    );
}