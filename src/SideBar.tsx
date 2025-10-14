import { Stack } from '@mui/material';
import { useState } from 'react';
import { useDnD } from '@/DnDContext';
import ActionsList from '@/components/ActionList';
import NewAction from '@/components/NewAction';
import { v4 as uuidv4 } from 'uuid';
import{type Node}from '@xyflow/react'
import { type Node as NodeInput } from '@/types'; 

export default function SideBar() {
  const [_, setName] = useDnD();
  const [inputValue, setInputValue] = useState('');
  const [nodes, setNodes] = useState<NodeInput[]>([]);
  const [error, setError] = useState('');

  const onDragStart = (event, nodeType: Node) => {
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
      return [...prevNodes, newNode];
    });
    setInputValue('');
  };

  const handleDeleteNode = (id: string) => {
    setNodes((prevNodes) => {
      return prevNodes.filter((node) => node.id !== id);
    });
    nodes.filter((node) => node.id !== id);
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
