import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import PalliativeModule from "./PalliativeModule";

const Palliative = () => {
  return (
    <ErrorBoundary moduleName="Palliative Care">
      <PalliativeModule />
    </ErrorBoundary>
  );
};

export default Palliative;