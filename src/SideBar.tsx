import { Box, Stack } from '@mui/material';
import { useState } from 'react';
import { useDnD } from '@/DnDContext';
import ActionsList from '@/components/ActionList';
import { customNnodes } from '@/nodes';
import NewAction from '@/components/NewAction';
import { v4 as uuidv4 } from 'uuid';

export default function SideBar() {
  const [nodeValue, setNodeValue] = useState('');
  const [_, setType] = useDnD();
  const [inputValue, setInputValue] = useState('');
  const [nodes, setNodes] = useState(customNnodes);
  const [error, setError] = useState('');

  const onDragStart = (event: DragEvent, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

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
    customNnodes.push(newNode);
    setInputValue('');
  };

  const handleDeleteNode = (id: number) => {
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
      <Box component={'h3'} sx={{}}>
        Component Library
      </Box>

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
