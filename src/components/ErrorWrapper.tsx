import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  componentName?: string;
}

export default function ErrorWrapper({ children, componentName }: Props) {
  try {
    return <>{children}</>;
  } catch (err) {
    console.error(`Error in ${componentName || "component"}:`, err);
    return (
      <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded mt-4">
        ⚠️ Failed to load {componentName || "component"}.
      </div>
    );
  }
}
