import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Panel,
  addEdge,
  useEdgesState,
  getOutgoers,
  useNodesState,
  useReactFlow,
  type Node,
  type Edge,
  type OnConnect,
} from "@xyflow/react";
import { useEffect, useState, useCallback, useRef } from "react";
import "@xyflow/react/dist/style.css";
import { Box, Container, CssBaseline, Grid, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { DnDProvider, useDnD } from "@/DnDContext";
import Sidebar from "@/SideBar.tsx";
import StoreButton from "@/components/StoreButton";

const theme = createTheme({
  palette: {
    background: {
      default: "#f9fbfc",
    },
  },
});

let id = 0;
const getId = () => `dndnode_${id++}`;
const flowKey = "react-flow";

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [rfInstance, setRfInstance] = useState(null);
  const { screenToFlowPosition, setViewport, getEdges, getNodes } =
    useReactFlow();
  const [name] = useDnD();

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  });

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!name) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type: "default",
        position,
        data: { label: `${name}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, name],
  );

  const isValidConnection = useCallback(
    (connection) => {
      const nodes = getNodes();
      const edges = getEdges();
      const target = nodes.find((node) => node.id === connection.target);
      const hasCycle = (node: Node, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      if (target.id === connection.source) return false;
      return !hasCycle(target);
    },
    [getNodes, getEdges],
  );

  useEffect(() => {
    onRestore();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="1242px" sx={{ height: "100vh" }}>
        <Grid
          container
          sx={{
            border: "1px solid #E5E7E9",
            borderRadius: "4px",
            height: "100%",
          }}
        >
          <Grid
            size={2}
            sx={{
              backgroundColor: "#F9FBFC",
              borderRight: "1px solid #E5E7E9",
            }}
          >
            <Sidebar />
          </Grid>
          <Grid size={10} sx={{ height: "100%" }}>
            <Box
              sx={{
                height: "5%",
                borderBottom: "1px solid #E5E7E9",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ pl: "12px", fontWeight: "bold" }}>
                Your Ideas to Actions!
              </Typography>
            </Box>
            <Box
              ref={reactFlowWrapper}
              sx={{ height: "95%", bgcolor: "white" }}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onInit={setRfInstance}
                isValidConnection={isValidConnection}
                onDragOver={onDragOver}
                fitView
              >
                <Controls />
                <Background />
                <Panel
                  position="top-right"
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <StoreButton onAction={onSave} actionName="Save" />
                  <StoreButton onAction={onRestore} actionName="Restore" />
                </Panel>
                <MiniMap />
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
