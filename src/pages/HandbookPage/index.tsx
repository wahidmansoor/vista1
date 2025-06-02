import React from 'react';
import { Box, Container } from '@mui/material';
import HandbookViewer from '../../modules/handbook/HandbookViewer';

const HandbookPage: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <HandbookViewer />
      </Box>
    </Container>
  );
};

export default HandbookPage;
