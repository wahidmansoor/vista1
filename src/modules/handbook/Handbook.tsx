import { useState } from "react";
import {
  BookOpen,
  Brain,
  Search,
  Activity,
  Stethoscope,
  Radiation,
  HeartPulse,
  AlertTriangle,
  Baby,
  Landmark,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import MarkdownViewer from "../../components/MarkdownViewer";
import IPSChart from "../../components/charts/IPSChart";
import ErrorWrapper from "../../components/ErrorWrapper";

const toc: Record<string, string[]> = {
  "general-oncology": [
    "cancer-biology",
    "performance-status",
    "prognostic-scores",
    "staging-systems",
  ],
  "diagnosis-workup": [
    "diagnostic-flow",
    "histopathology",
    "radiology",
    "tumor-markers",
  ],
  "treatment-modalities": [
    "chemotherapy",
    "immunotherapy",
    "radiotherapy",
    "surgery",
    "targeted-therapy",
  ],
  "systems-oncology": [
    "breast-cancer",
    "colorectal-cancer",
    "lung-cancer",
    "head-neck",
    "prostate",
    "lymphomas",
    "leukemias",
    "gi-cancers",
    "gyn-cancers",
    "urological",
    "cns-tumors",
    "pediatric",
  ],
  "toxicities": [
    "acute-chronic",
    "ctcae",
    "chemo-side-effects",
    "survivorship",
  ],
  "supportive-care": [
    "antiemetics",
    "gcsf",
    "pain",
    "nutrition",
    "palliative",
  ],
  "emergencies": [
    "tls",
    "spinal-compression",
    "hypercalcemia",
    "febrile-neutropenia",
    "svc-syndrome",
  ],
  "special-topics": [
    "pregnancy",
    "elderly",
    "fertility",
    "genetics",
    "immunocompromised",
  ],
  "resources": ["calculators", "downloads", "guidelines"],
};

const formatTitle = (slug: string) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const sectionIcons: Record<string, any> = {
  "general-oncology": Brain,
  "diagnosis-workup": Search,
  "treatment-modalities": Stethoscope,
  "systems-oncology": BookOpen,
  "toxicities": Activity,
  "supportive-care": HeartPulse,
  "emergencies": AlertTriangle,
  "special-topics": Baby,
  "resources": Landmark,
};

export default function Handbook() {
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.keys(toc).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );
  const [searchText, setSearchText] = useState<string>("");
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const handleClick = (section: string, topic: string) => {
    const path = `/handbook/${section}/${topic}.md`;
    setActiveFile(path);
    setActiveTopicId(`${section}/${topic}`);
    setShowSummary(false); // reset summary when new topic selected
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredTOC = Object.entries(toc).reduce((acc, [section, topics]) => {
    const filteredTopics = topics.filter((topic) =>
      formatTitle(topic).toLowerCase().includes(searchText.toLowerCase())
    );
    if (filteredTopics.length > 0) acc[section] = filteredTopics;
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="flex h-full">
      {/* Left Column - TOC */}
      <div className="w-1/3 border-r overflow-y-auto p-6 h-screen sticky top-0">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-7 h-7" />
          AI Handbook
        </h1>

        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search topics..."
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
        />

        {Object.entries(filteredTOC).map(([section, topics]) => {
          const Icon = sectionIcons[section] || Radiation;
          const isOpen = openSections[section];

          return (
            <div key={section} className="mb-4">
              <button
                onClick={() => toggleSection(section)}
                className="text-xl font-semibold capitalize mb-2 flex items-center gap-2 w-full text-left"
              >
                <Icon className="w-5 h-5 text-blue-600" />
                {formatTitle(section.replace("-", " "))}
                {isOpen ? (
                  <ChevronUp className="ml-auto w-4 h-4" />
                ) : (
                  <ChevronDown className="ml-auto w-4 h-4" />
                )}
              </button>
              {isOpen && (
                <ul className="list-disc ml-6 space-y-1">
                  {topics.map((topic) => (
                    <li key={topic}>
                      <button
                        onClick={() => handleClick(section, topic)}
                        className={`cursor-pointer text-left block w-full text-blue-600 hover:underline px-2 py-1 rounded ${
                          activeTopicId === `${section}/${topic}`
                            ? "bg-blue-100 font-semibold"
                            : ""
                        }`}
                      >
                        {formatTitle(topic)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Right Column - Viewer */}
      <div className="w-2/3 p-6 overflow-y-auto h-screen">
        {activeFile ? (
          <>
            {/* Breadcrumb & Toolbar */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500">
                Home / <span className="text-blue-700 font-medium">AI Handbook</span> /{" "}
                <span className="capitalize">{formatTitle(activeFile.split("/")[2])}</span> /{" "}
                <span className="font-semibold">
                  {formatTitle(activeFile.split("/").pop()?.replace(".md", "") || "")}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded border"
                >
                  🖨 Print
                </button>
                <a
                  href={activeFile}
                  download
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded border"
                >
                  ⬇ Download
                </a>
              </div>
            </div>

            {/* Markdown Content */}
            <MarkdownViewer filePath={activeFile} />

            {/* Conditional Chart */}
            {activeFile.includes("prognostic-scores") && (
              <ErrorWrapper componentName="IPSChart">
                <IPSChart />
              </ErrorWrapper>
            )}

            {/* AI Summary Toggle */}
            <div className="mt-6">
              <button
                onClick={() => setShowSummary(!showSummary)}
                className="bg-blue-100 hover:bg-blue-200 text-sm text-blue-800 px-4 py-2 rounded shadow"
              >
                {showSummary ? "Hide Summary" : "🧠 Generate Summary"}
              </button>
              {showSummary && (
                <ErrorWrapper componentName="AI Summary">
                  <div className="mt-4 p-4 border rounded bg-blue-50 text-sm text-gray-800">
                    <h3 className="font-semibold mb-2">🧠 AI Summary</h3>
                    <p>
                      This section provides a simplified summary of the topic.
                      Prognostic scores are used to estimate cancer outcomes based
                      on patient and tumor factors. Examples include ECOG,
                      Karnofsky, IPS, and Motzer scores, which guide therapy and
                      risk stratification.
                    </p>
                  </div>
                </ErrorWrapper>
              )}
            </div>
          </>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-2">📌 Select a topic from the left</h2>
            <p className="text-gray-600">
              This panel will display the selected content from the handbook.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
