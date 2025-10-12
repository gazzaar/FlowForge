import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import { useCallback, useRef } from 'react';

import '@xyflow/react/dist/style.css';

import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Typography,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DnDProvider, useDnD } from '@/DnDContext';
import Sidebar from '@/SideBar.tsx';

const theme = createTheme({
  palette: {
    background: {
      default: '#f9fbfc',
    },
  },
});
const initialNodes = [
  // {
  //   id: '1',
  //   type: 'input',
  //   data: { label: 'input node' },
  //   position: { x: 250, y: 5 },
  // },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      // check if the dropped element is valid
      if (!type) {
        return;
      }

      // project was renamed to screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type],
  );

  const onDragStart = (event: DragEvent, nodeType) => {
    setType(nodeType);
    event.dataTransfer.setData('text/plain', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth='1242px' sx={{ height: '100vh' }}>
        <Grid
          container
          sx={{
            border: '1px solid #E5E7E9',
            borderRadius: '4px',
            height: '100%',
          }}
        >
          <Grid
            size={2}
            sx={{
              backgroundColor: '#F9FBFC',
              borderRight: '1px solid #E5E7E9',
            }}
          >
            <Sidebar />
          </Grid>
          <Grid size={10} sx={{ height: '100%' }}>
            <Box
              sx={{
                height: '10%',
                borderBottom: '1px solid #E5E7E9',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant='h6' sx={{ pl: '12px', fontWeight: 'bold' }}>
                Your Ideas to Actions!
              </Typography>
            </Box>
            <Box
              ref={reactFlowWrapper}
              sx={{ height: '90%', bgcolor: 'white' }}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                fitView
              >
                <Controls />
                <Background />
              </ReactFlow>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default () => (
  <ReactFlowProvider>
    <DnDProvider>
      <DnDFlow />
    </DnDProvider>
  </ReactFlowProvider>
);
