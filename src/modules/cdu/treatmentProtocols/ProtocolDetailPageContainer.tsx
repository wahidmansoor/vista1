import React from 'react';
import TreatmentProtocols from './TreatmentProtocols';

/**
 * Container component for protocol detail pages
 * This is a wrapper around TreatmentProtocols to maintain compatibility with existing route structure
 */
const ProtocolDetailPageContainer: React.FC = () => {
  return <TreatmentProtocols />;
};

export default ProtocolDetailPageContainer;
