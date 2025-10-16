import { memo } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Box, TextareaAutosize, Typography } from "@mui/material";
import React from "react";

type CustomNodeData = {
  label: string;
  text?: string;
};

type Props = {
  id: string;
  data: CustomNodeData;
};

const CustomNode: React.FC<Props> = ({ id, data }) => {
  const { updateNodeData } = useReactFlow();
  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{ fontSize: "22px", textTransform: "capitalize" }}
      >
        {data.label}{" "}
      </Typography>
      <TextareaAutosize
        onChange={(evt) => updateNodeData(id, { text: evt.target.value })}
        value={data.text}
        maxRows={10}
        minRows={2}
        placeholder="Type your thoughts here..."
        style={{
          width: "200px",
          resize: "vertical",
          maxHeight: "200px",
          outline: "none",
          border: "none",
          fontSize: "10px",
          fontFamily: "inherit",
        }}
      />
      <Handle type="target" position={Position.Top} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" />
      <Handle type="source" position={Position.Right} id="c" />
      <Handle type="target" position={Position.Left} id="d" />
    </Box>
  );
};

export default memo(CustomNode);
