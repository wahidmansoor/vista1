import React from "react";

interface InfoTabProps {
  info?: {
    references?: Array<string>;
    lastUpdated?: string;
    source?: string;
    additionalNotes?: string;
  };
}

const InfoTab: React.FC<InfoTabProps> = ({ info }) => {
  if (!info) {
    return <p className="text-muted-foreground">No additional information available.</p>;
  }

  const { references = [], lastUpdated, source, additionalNotes } = info;

  return (
    <div className="space-y-6">
      {references && references.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-2">References</h3>
          <ul className="list-disc list-inside space-y-1">
            {references.map((reference, idx) => (
              <li key={idx} className="text-gray-700 dark:text-gray-300">{reference}</li>
            ))}
          </ul>
        </div>
      )}

      {source && (
        <div>
          <h3 className="font-semibold text-lg mb-2">Source</h3>
          <p className="text-gray-700 dark:text-gray-300">{source}</p>
        </div>
      )}

      {lastUpdated && (
        <div>
          <h3 className="font-semibold text-lg mb-2">Last Updated</h3>
          <p className="text-gray-700 dark:text-gray-300">{lastUpdated}</p>
        </div>
      )}

      {additionalNotes && (
        <div>
          <h3 className="font-semibold text-lg mb-2">Additional Notes</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{additionalNotes}</p>
        </div>
      )}
    </div>
  );
};

export default InfoTab;
