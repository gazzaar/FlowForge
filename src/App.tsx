import { DnDProvider } from "@/DnDContext";
import { ReactFlowProvider } from "@xyflow/react";
import DnDFlow from "@/DnDFlow";

const App = () => {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <DnDFlow />
      </DnDProvider>
    </ReactFlowProvider>
  );
};
export default App;
