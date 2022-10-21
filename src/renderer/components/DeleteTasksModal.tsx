import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ITask } from '../../interfaces/ITask';

interface DeleteTasksModalProps {
  isDeleteTasksModalOpen: boolean;
  setIsDeleteTasksModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
}

export const DeleteTasksModal = ({
  isDeleteTasksModalOpen,
  setIsDeleteTasksModalOpen,
  setTasks,
}: DeleteTasksModalProps) => {
  const handleConfirm = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsDeleteTasksModalOpen(false);
    await window.api.deleteTasks();
    setTasks([]);
  };

  return (
    <Transition appear show={isDeleteTasksModalOpen} as={Fragment}>
      <Dialog
        open={isDeleteTasksModalOpen}
        onClose={() => setIsDeleteTasksModalOpen(false)}
        className="relative z-50"
      >
        {/* backdrop */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* modal */}
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="w-full p-8 max-w-sm rounded-2xl bg-gray-200">
            <Dialog.Description className="mb-4 font-semibold">
              Are you sure you want to delete all tasks?
            </Dialog.Description>
            <button
              type="button"
              onClick={handleConfirm}
              className="border border-black rounded-md p-2 font-semibold text-red-800 hover:bg-red-800 hover:text-white"
            >
              Confirm
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};
