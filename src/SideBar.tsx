import { useDnD } from '@/DnDContext';
import ActionsList from '@/components/ActionList';
import NewAction from '@/components/NewAction';
import { type Node as NodeInput } from '@/types';
import { Stack } from '@mui/material';
import type React from 'react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function SideBar() {
  const [_, setName] = useDnD();
  const [inputValue, setInputValue] = useState('');
  const [nodes, setNodes] = useState<NodeInput[]>([]);
  const [error, setError] = useState('');

  // localStorage key for sidebar action templates
  const sidebarKey = 'ff-sidebar-actions';

  // load actions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(sidebarKey);
      if (saved) {
        const parsed = JSON.parse(saved) as NodeInput[];
        setNodes(parsed);
      }
    } catch (_) {}
  }, []);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setName(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // TODO: Refactor this
  const handleNewNode = () => {
    if (!inputValue.trim()) {
      setInputValue('');
      setError('Please Enter a valid value');
      return;
    }
    setError('');
    const newNode = {
      id: uuidv4(),
      name: inputValue,
    };
    setNodes((prevNodes) => {
      const next = [...prevNodes, newNode];
      try {
        localStorage.setItem(sidebarKey, JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    setInputValue('');
  };

  const handleDeleteNode = (id: string) => {
    setNodes((prevNodes) => {
      const next = prevNodes.filter((node) => node.id !== id);
      try {
        localStorage.setItem(sidebarKey, JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  };

  const handleEnterPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNewNode();
    }
  };

  return (
    <Stack sx={{ padding: '12px', height: '100%' }}>
      <NewAction
        handleNewNode={handleNewNode}
        error={error}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleEnterPress={handleEnterPress}
      />

      <ActionsList
        nodes={nodes}
        onDragHandle={onDragStart}
        handleDeleteNode={handleDeleteNode}
      />
    </Stack>
  );
}
