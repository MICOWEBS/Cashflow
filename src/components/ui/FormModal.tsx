import React from 'react';

interface FormData {
  [key: string]: string | number | boolean | null;
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void | Promise<void>;
  title: string;
  children: React.ReactNode;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitLabel = "Save",
  isSubmitting = false
}: FormModalProps) {
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: FormData = {};
    
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        data[key] = value.name;
      } else {
        data[key] = value;
      }
    }
    
    await onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>

        {/* Modal */}
        <div className="relative w-full max-w-md rounded-lg bg-white shadow-lg">
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">{title}</h2>
            <form onSubmit={handleSubmit}>
              {children}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : submitLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 