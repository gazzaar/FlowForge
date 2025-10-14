import { Button } from '@mui/material';
const StoreButton = ({
  actionName,
  onAction,
}: {
  actionName: string;
  onAction: () => void;
}) => {
  return (
    <Button
      variant="outlined"
      onClick={onAction}
      sx={{
        color: '#86418D',
        textTransform: 'none',
        fontSize: '16px',
        borderColor: '#86418D',
        bgcolor: 'white',
        p: '2px 10px',
      }}
    >
      {actionName}
    </Button>
  );
};

export default StoreButton;
