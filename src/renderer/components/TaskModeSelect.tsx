import { Listbox } from '@headlessui/react';

interface TaskModeSelectProps {
  mode: 'Manual' | 'Automatic';
  setMode: React.Dispatch<React.SetStateAction<'Manual' | 'Automatic'>>;
}

export const TaskModeSelect = ({ mode, setMode }: TaskModeSelectProps) => {
  return (
    <Listbox value={mode} onChange={setMode}>
      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left">
        {mode}
      </Listbox.Button>
      <Listbox.Options className="absolute mt-1 max-h-60 w-80 overflow-auto rounded-md bg-white py-1 text-base shadow-lg">
        <Listbox.Option
          key="manual"
          value="Manual"
          className="relative cursor-default select-none py-2 pl-2 pr-4 hover:bg-gray-300"
        >
          Manual
        </Listbox.Option>
        <Listbox.Option
          key="automatic"
          value="Automatic"
          className="relative cursor-default select-none py-2 pl-2 pr-4 hover:bg-gray-300"
        >
          Automatic
        </Listbox.Option>
      </Listbox.Options>
    </Listbox>
  );
};
