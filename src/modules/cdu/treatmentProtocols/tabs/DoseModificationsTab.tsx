import { Protocol } from '../../../../types/protocol';
import { getProtocolDoseReductions } from '../../../../utils/protocolHelpers';

type DoseModificationsTabProps = {
  protocol: Protocol;
};

type CriterionItem = string | { criterion: string };

export const DoseModificationsTab = ({ protocol }: DoseModificationsTabProps) => {
  const doseReductions = getProtocolDoseReductions(protocol);

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-lg font-semibold mb-4">Dose Modification Criteria</h3>
        <ul className="list-disc pl-5 space-y-2">
          {doseReductions.criteria?.length > 0 && doseReductions.criteria.map((item: CriterionItem, index) => (
            <li key={index} className="text-gray-700 dark:text-gray-300">
              {typeof item === 'string' ? item : item.criterion}
            </li>
          ))}
        </ul>
      </section>

      {Object.keys(doseReductions.levels).length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-4">Dose Reduction Levels</h3>
          <div className="space-y-4">
            {Object.entries(doseReductions.levels).map(([level, details]) => (
              <div key={level} className="border-l-4 border-gray-200 pl-4">
                <h4 className="font-medium">{level}</h4>
                <p className="text-gray-600 dark:text-gray-400">{details}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DoseModificationsTab;
