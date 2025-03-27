import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Syringe,
  Hospital,
  Leaf,
  Wrench
} from "lucide-react";

const ModuleCard = ({
  title,
  description,
  path,
  Icon,
}: {
  title: string;
  description: string;
  path: string;
  Icon: any;
}) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(path)}
      className="cursor-pointer border rounded-lg p-5 mb-4 bg-slate-50 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-blue-700">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default function HomeDashboard() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        🧠 OncoVista Dashboard
      </h1>

      <ModuleCard
        Icon={Stethoscope}
        title="Oncology OPD"
        description="Outpatient workflows, diagnostics, and follow-up"
        path="/opd"
      />

      <ModuleCard
        Icon={Syringe}
        title="Chemotherapy Day Unit (CDU)"
        description="Chemo protocols, side effects, and calculations"
        path="/cdu"
      />

      <ModuleCard
        Icon={Hospital}
        title="Inpatient Oncology"
        description="Admissions, rounds, complications, and supportive care"
        path="/inpatient"
      />

      <ModuleCard
        Icon={Leaf}
        title="Palliative Care"
        description="End-of-life care, symptom control, and family support"
        path="/palliative"
      />

      <ModuleCard
        Icon={Wrench}
        title="Tools"
        description="Oncology calculators and clinical red flags"
        path="/tools"
      />
    </div>
  );
}
