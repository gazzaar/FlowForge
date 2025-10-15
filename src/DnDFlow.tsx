import { useDnD } from "@/DnDContext";
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
import toast, { Toaster } from "react-hot-toast";
import { downloadImage } from "@/utils/downloadImage";
import { FLOW_KEY, IMAGE_WIDTH, IMAGE_HEIGHT } from "@/config";
import { v4 as uuidv4 } from "uuid";

const theme = createTheme({
  palette: {
    background: {
      default: "#f9fbfc",
    },
  },
});

export const getId = () => `dndnode_${uuidv4()}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const lastConnectionRef = useRef<string | null>(null);

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<
    Node,
    Edge
  > | null>(null);
  const { screenToFlowPosition, setViewport, getEdges, getNodes } =
    useReactFlow();
  const flowRef = useRef<HTMLDivElement | null>(null);
  const [name] = useDnD();

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(FLOW_KEY, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const raw = localStorage.getItem(FLOW_KEY);
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

      const connectionKey = `${connection.source}-${connection.target}`;

      const hasCycle = (node: Node, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
        return false;
      };

      if (!target) return false;

      if (target.id === connection.source) {
        if (lastConnectionRef.current !== connectionKey) {
          toast.error("You can't connect the same node");
          lastConnectionRef.current = connectionKey;
        }
        return false;
      }

      const wouldCreateCycle = hasCycle(target);
      if (wouldCreateCycle) {
        if (lastConnectionRef.current !== connectionKey) {
          toast.error("This connection would create a cycle in the flow");
          lastConnectionRef.current = connectionKey;
        }
        return false;
      }

      lastConnectionRef.current = null;
      return true;
    },
    [getNodes, getEdges],
  );

  useEffect(() => {
    onRestore();
  }, []);

  const onDownload = () => {
    const flowElement =
      flowRef.current || document.querySelector(".react-flow__viewport");

    if (!flowElement) return;

    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(
      nodesBounds,
      IMAGE_WIDTH,
      IMAGE_HEIGHT,
      0.5,
      2,
      0,
    );

    toPng(flowElement, {
      backgroundColor: "transparent",
      width: IMAGE_HEIGHT,
      height: IMAGE_HEIGHT,
      pixelRatio: 2,
      style: {
        width: String(IMAGE_WIDTH),
        height: String(IMAGE_HEIGHT),
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    }).then(downloadImage);

    const flow = document.querySelector(".react-flow__viewport");
    if (!flow) return;

    const nodes = getNodes();
    const bounds = getNodesBounds(nodes);

    // Add padding to ensure edges and labels aren’t cut off
    const padding = 50;

    const x = bounds.x - padding;
    const y = bounds.y - padding;
    const width = bounds.width + padding * 2;
    const height = bounds.height + padding * 2;

    toPng(flow, {
      backgroundColor: "#ffffff", // or transparent
      width,
      height,
      pixelRatio: 2,
      style: {
        transform: `translate(${-x}px, ${-y}px)`, // shift so flow starts at (0,0)
        width: `${width}px`,
        height: `${height}px`,
      },
    }).then(downloadImage);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ height: "100vh", px: { xs: 1, sm: 2 } }}>
        <div>
          <Toaster />
        </div>
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
              onMouseLeave={() => {
                if (rfInstance) onSave();
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
                  <StoreButton
                    onAction={() => {
                      setNodes([]);
                      setEdges([]);
                      try {
                        localStorage.removeItem(FLOW_KEY);
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

export default DnDFlow;
