import { createContext, useContext, useState } from 'react';

const DnDContext = createContext([null, (_) => {}]);

export const DnDProvider = ({ children }) => {
  const [type, setType] = useState(null);

  return <DnDContext value={[type, setType]}>{children}</DnDContext>;
};

export default DnDContext;

export const useDnD = () => {
  return useContext(DnDContext);
};
