import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';

Modal.setAppElement('#root');

const ModalComponent = ({
  isOpen,
  onRequestClose,
  onSave,
  onCancel,
  title,
  initialValues = {},
  mode = 'create',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const handleSave = (data) => {
    onSave(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-content"
      overlayClassName="modal-overlay"
      closeTimeoutMS={200}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    >
      <div>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {mode === 'view' ? (
          <div>
            <p>
              <strong>Title:</strong> {initialValues.title}
            </p>
            <p>
              <strong>Description:</strong> {initialValues.description}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleSave)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                {...register('title', {
                  required: 'Title is required',
                  validate: (value) =>
                    value.trim() !== '' || 'Title cannot be empty or just spaces',
                })}
                disabled={mode === 'view'}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                {...register('description', {
                  validate: (value) =>
                    value.trim() !== '' || 'Description cannot be empty or just spaces',
                })}
                disabled={mode === 'view'}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              {mode !== 'view' && (
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  {mode === 'edit' ? 'Update' : 'Save'}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default ModalComponent;
