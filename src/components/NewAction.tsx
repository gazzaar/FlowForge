import { Box, TextField } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import React, { type Dispatch, type SetStateAction } from "react";

type Props = {
  error: string;
  inputValue: string;
  handleNewNode: () => void;
  handleEnterPress: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  setInputValue: Dispatch<SetStateAction<string>>;
};
const NewAction: React.FC<Props> = ({
  handleNewNode,
  error,
  inputValue,
  handleEnterPress,
  setInputValue,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <TextField
        variant="standard"
        placeholder={error ? error : "Study.."}
        sx={{ padding: "8px 12px", marginBottom: "4px", width: "100%" }}
        value={inputValue}
        type="text"
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleEnterPress}
        error={error ? true : false}
      />
      <AddIcon
        fontSize="medium"
        sx={{
          color: "#86418D",
          cursor: "pointer",
        }}
        onClick={handleNewNode}
      />
    </Box>
  );
};

export default NewAction;
