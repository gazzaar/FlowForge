import { DnDProvider, useDnD } from "@/DnDContext";
import Sidebar from "@/SideBar.tsx";
import StoreButton from "@/components/StoreButton";
import { Box, Container, CssBaseline, Grid, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  getNodesBounds,
  getOutgoers,
  getViewportForBounds,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type OnConnect,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { toPng } from "html-to-image";
import { useCallback, useEffect, useRef, useState } from "react";

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

function downloadImage(dataUrl) {
  const a = document.createElement("a");

  a.setAttribute("download", "flow.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<
    Node,
    Edge
  > | null>(null);
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
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const raw = localStorage.getItem(flowKey);
      if (!raw) return;
      const flow = JSON.parse(raw);
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setEdges, setViewport]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
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
    (connection: Connection) => {
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
      if (!target) return false;
      if (target.id === connection.source) return false;
      return !hasCycle(target);
    },
    [getNodes, getEdges],
  );

  useEffect(() => {
    onRestore();
  }, []);

  const onDownload = () => {
    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
    );

    toPng(document.querySelector(".react-flow__viewport"), {
      backgroundColor: "transparent",
      width: imageWidth,
      height: imageHeight,
      pixelRatio: 2,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    }).then(downloadImage);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ height: "100vh", px: { xs: 1, sm: 2 } }}>
        <Grid
          container
          sx={{
            border: "1px solid #E5E7E9",
            borderRadius: "4px",
            height: "100%",
          }}
        >
          <Grid
            size={{ xs: 12, sm: 4, md: 2 }}
            sx={{
              backgroundColor: "#F9FBFC",
              borderRight: "1px solid #E5E7E9",
              borderRightColor: { xs: "transparent", sm: "#E5E7E9" },
              borderBottom: { xs: "1px solid #E5E7E9", sm: "none" },
            }}
          >
            <Sidebar />
          </Grid>
          <Grid size={{ xs: 12, sm: 8, md: 10 }} sx={{ height: "100%" }}>
            <Box
              sx={{
                height: "5%",
                borderBottom: "1px solid #E5E7E9",
                display: "flex",
                alignItems: "center",
                px: { xs: 1, sm: 2 },
              }}
            >
              <Typography variant="h6" sx={{ pl: "12px", fontWeight: "bold" }}>
                Your Ideas to Actions!
              </Typography>
            </Box>
            <Box
              ref={reactFlowWrapper}
              sx={{
                height: { xs: "calc(100% - 48px)", sm: "95%" },
                bgcolor: "white",
              }}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onInit={(instance) => setRfInstance(instance)}
                isValidConnection={(conn) =>
                  isValidConnection(conn as Connection)
                }
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
                  <StoreButton
                    onAction={() => {
                      setNodes([]);
                      setEdges([]);
                      try {
                        localStorage.removeItem(flowKey);
                      } catch (_) {}
                    }}
                    actionName="Clear"
                  />
                  <StoreButton
                    onAction={onDownload}
                    actionName="Download an Image"
                  />
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
