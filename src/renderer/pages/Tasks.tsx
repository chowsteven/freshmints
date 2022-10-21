import { useCallback, useEffect, useState } from 'react';
import { Task } from 'renderer/components/Task';
import { AddTaskModal } from 'renderer/components/AddTaskModal';
import { DeleteTasksModal } from 'renderer/components/DeleteTasksModal';
import { ITask } from '../../interfaces/ITask';

export const Tasks = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isDeleteTasksModalOpen, setIsDeleteTasksModalOpen] = useState(false);
  const [isEditTask, setIsEditTask] = useState(false);
  const [isDeleteTask, setIsDeleteTask] = useState(false);

  // // wrap around useCallback: https://devtrium.com/posts/async-functions-useeffect
  const fetchTasks = useCallback(async () => {
    const tasksArrStr: string = await window.api.fetchTasks();
    const tasksArr: ITask[] = JSON.parse(tasksArrStr);

    setTasks(tasksArr);
    return tasksArr;
  }, []);

  // // fetch tasks on component mount, on task edit, and task delete
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, isEditTask, isDeleteTask]);

  const startTasks = () => {
    //
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-2xl mb-8">Tasks</div>
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => setIsAddTaskModalOpen(true)}
            className="px-4 py-2 border rounded-md hover:bg-gray-600"
          >
            Add Task
          </button>
          <button
            type="button"
            onClick={startTasks}
            className="px-4 py-2 border rounded-md hover:bg-green-800"
          >
            Start All
          </button>
          <button
            type="button"
            onClick={() => setIsDeleteTasksModalOpen(true)}
            className="px-4 py-2 mr-12 border rounded-md hover:bg-red-800"
          >
            Delete All
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
            <Task
              key={task.walletAddress}
              task={task}
              isEditTask={isEditTask}
              setIsEditTask={setIsEditTask}
              isDeleteTask={isDeleteTask}
              setIsDeleteTask={setIsDeleteTask}
            />
          ))}
        </tbody>
      </table>
      <AddTaskModal
        isAddTaskModalOpen={isAddTaskModalOpen}
        setIsAddTaskModalOpen={setIsAddTaskModalOpen}
        setTasks={setTasks}
        fetchTasks={fetchTasks}
      />
      <DeleteTasksModal
        isDeleteTasksModalOpen={isDeleteTasksModalOpen}
        setIsDeleteTasksModalOpen={setIsDeleteTasksModalOpen}
        setTasks={setTasks}
      />
    </div>
  );
};
