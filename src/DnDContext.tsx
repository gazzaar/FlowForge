import { createContext, useContext, useState } from 'react';

const DnDContext = createContext([null, (_) => {}]);

export const DnDProvider = ({ children }) => {
  const [name, setName] = useState(null);

  return <DnDContext value={[name, setName]}>{children}</DnDContext>;
};

export default DnDContext;

export const useDnD = () => {
  return useContext(DnDContext);
};
