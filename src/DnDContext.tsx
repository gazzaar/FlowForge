import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

type DnDValue = [string | null, Dispatch<SetStateAction<string | null>>];

const DnDContext = createContext<DnDValue>([null, () => {}]);

export const DnDProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState<string | null>(null);

  return <DnDContext value={[name, setName]}>{children}</DnDContext>;
};

export default DnDContext;

export const useDnD = () => {
  return useContext(DnDContext);
};
