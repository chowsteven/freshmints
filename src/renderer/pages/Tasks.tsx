import { useCallback, useEffect, useState } from 'react';
import { Task } from 'renderer/components/Task';
import { AddTaskModal } from 'renderer/components/AddTaskModal';
import { ITask } from '../../interfaces/ITask';

export const Tasks = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditTask, setIsEditTask] = useState(false);
  const [isDeleteTask, setIsDeleteTask] = useState(false);

  const startTasks = () => {
    //
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-2xl mb-8">Tasks</div>
        <div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 mr-4 mb-4 border rounded-md hover:bg-gray-600"
          >
            Add Task
          </button>
          <button
            type="button"
            onClick={startTasks}
            className="px-4 py-2 mr-12 mb-4 border rounded-md hover:bg-green-800"
          >
            Start All
          </button>
        </div>
      </div>
      <table className="w-full text-left">
        <thead className="uppercase">
          <tr>
            <th className="w-3/12 py-3">Contract</th>
            <th className="w-1/6 py-3">Price (Qty)</th>
            <th className="w-1/12 py-3">Gas</th>
            <th className="w-1/12 py-3">Mode</th>
            <th className="w-1/6 py-3">Status</th>
            <th className="w-1/6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <Task />
          ))}
        </tbody>
      </table>
      <AddTaskModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
};
