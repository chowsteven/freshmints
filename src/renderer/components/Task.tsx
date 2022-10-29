import { useState } from 'react';
import { ITask } from 'interfaces/ITask';
import { MdPlayArrow, MdEdit, MdDelete, MdStop } from 'react-icons/md';
import { useStartTask } from 'renderer/hooks/useStartTask';
import { useCancelTransaction } from 'renderer/hooks/useCancelTransaction';

interface TaskProps {
  task: ITask;
  taskNumber: number;
  setTaskNumber: React.Dispatch<React.SetStateAction<number>>;
  setIsEditTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteTask: boolean;
  setIsDeleteTask: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Task = ({
  task,
  taskNumber,
  setTaskNumber,
  setIsEditTaskModalOpen,
  isDeleteTask,
  setIsDeleteTask,
}: TaskProps) => {
  const [status, setStatus] = useState(task.status);
  const { startTask } = useStartTask({ task, setStatus });
  const { cancelTransaction } = useCancelTransaction({
    task,
    setStatus,
  });

  const handleStart = async () => {
    await startTask();
  };

  const handleStop = async () => {
    await cancelTransaction();
  };

  const handleEdit = () => {
    // set task number state so edit modal knows which task to bring up
    setTaskNumber(taskNumber);
    setIsEditTaskModalOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    await window.api.deleteTask(taskId);
    setIsDeleteTask(!isDeleteTask);
  };

  return (
    <tr>
      <td className="py-2">
        <div>{task.contract}</div>
        <div className="text-sm text-gray-300">{task.wallet.address}</div>
      </td>
      <td className="py-2">
        {task.mintPrice} ({task.mintParameters})
      </td>
      <td className="py-2">
        {task.maxGas} + {task.priorityFee}
      </td>
      <td className="py-2">{task.mode}</td>
      <td className="py-2">{status}</td>
      <td className="flex gap-2 pt-6">
        <MdPlayArrow
          size={22}
          onClick={handleStart}
          className="hover:cursor-pointer pb-1"
        />
        <MdStop
          size={16}
          onClick={handleStop}
          className="hover:cursor-pointer"
        />
        <MdEdit
          size={16}
          onClick={handleEdit}
          className="hover:cursor-pointer"
        />
        <MdDelete
          size={16}
          onClick={() => handleDelete(task.id)}
          className="hover:cursor-pointer"
        />
      </td>
    </tr>
  );
};
