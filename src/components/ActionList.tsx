import { type Node } from "@/types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import RemoveIcon from "@mui/icons-material/Remove";
type ActionsListProps = {
  nodes: Node[];
  onDragHandle: (event: React.DragEvent, nodeType: string) => void;
  handleDeleteNode: (id: string) => void;
};

const ActionsList = ({
  nodes,
  onDragHandle,
  handleDeleteNode,
}: ActionsListProps) => {
  return (
    <Box sx={{ mt: "12px" }}>
      <Accordion
        defaultExpanded
        sx={{
          bgcolor: "#fff",
          p: "4px 6px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        slotProps={{ transition: { unmountOnExit: true } }}
      >
        <AccordionSummary sx={{ padding: 0 }} expandIcon={<ExpandMoreIcon />}>
          <Typography component={"h3"} sx={{ pl: "6px" }}>
            Actions
          </Typography>
        </AccordionSummary>
        {nodes.map((node) => (
          <AccordionDetails
            key={node.id}
            onDragStart={(event) => onDragHandle(event, node.name)}
            draggable
            sx={{
              border: "1px solid #E2E2E2",
              borderRadius: "6px",
              padding: "8px 12px",
              marginBottom: "10px",
              backgroundColor: "#F6F6F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "grab",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                maxWidth: "80%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {node.name}
            </Typography>
            <RemoveIcon
              onClick={() => handleDeleteNode(node.id)}
              sx={{ color: "#AF2426", cursor: "pointer" }}
            />
          </AccordionDetails>
        ))}
      </Accordion>
    </Box>
  );
};

export default ActionsList;
