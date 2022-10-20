import { ITask } from 'interfaces/ITask';
import { MdEdit, MdDelete } from 'react-icons/md';

interface TaskProps {
  task: ITask;
  isEditTask: boolean;
  setIsEditTask: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteTask: boolean;
  setIsDeleteTask: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Task = ({
  task,
  isEditTask,
  setIsEditTask,
  isDeleteTask,
  setIsDeleteTask,
}: TaskProps) => {
  const handleEdit = () => {
    // await window.api.editTask(task);
    // setIsEditTask(!isEditTask);
  };

  const handleDelete = () => {
    // await window.api.deleteTask(task);
    // setIsDeleteTask(!isDeleteTask);
  };

  return (
    <tr>
      <td className="py-2">
        <div>{task.contract}</div>
        <div className="text-sm text-gray-300">{task.walletAddress}</div>
      </td>
      <td className="py-2">
        {task.mintPrice} ({task.quantity})
      </td>
      <td className="py-2">
        {task.maxGas} + {task.priorityFee}
      </td>
      <td className="py-2">{task.mode}</td>
      <td className="py-2">{task.status}</td>
      <td className="flex gap-2 pt-6">
        <MdEdit onClick={handleEdit} className="hover:cursor-pointer" />{' '}
        <MdDelete onClick={handleDelete} className="hover:cursor-pointer" />
      </td>
    </tr>
  );
};
