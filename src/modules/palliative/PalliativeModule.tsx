import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PalliativeCareProvider } from "./context/PalliativeContext";
import { PalliativeThemeProvider, usePalliativeThemeContext } from "./context/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Brain, Heart, Users, FileText, Moon, Sun, Monitor } from "lucide-react";
import { usePalliativeNav } from "./hooks/usePalliativeNav";
import { useKeyboardNav } from "./hooks/useKeyboardNav";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import { KeyboardShortcutsDialog } from "./components/KeyboardShortcutsDialog";

// Lazy load components
const SymptomControlAssistant = React.lazy(() => import("./sections/symptom_control/SymptomControlAssistant"));
const PainManagement = React.lazy(() => import("./sections/pain_management/PainManagement"));
const FamilySupport = React.lazy(() => import("./sections/end_of_life/FamilySupport"));
const AdvanceDirectives = React.lazy(() => import("./sections/end_of_life/AdvanceDirectives"));
const PsychosocialCare = React.lazy(() => import("./sections/psychosocial_support/PsychosocialCare"));

const tabs = [
  {
    id: "symptoms",
    label: "Symptom Control",
    icon: Brain,
    component: SymptomControlAssistant
  },
  {
    id: "pain",
    label: "Pain Management",
    icon: Heart,
    component: PainManagement
  },
  {
    id: "psychosocial",
    label: "Psychosocial Care",
    icon: Users,
    component: PsychosocialCare
  },
  {
    id: "family",
    label: "Family Support",
    icon: Users,
    component: FamilySupport
  },
  {
    id: "directives",
    label: "Advance Directives",
    icon: FileText,
    component: AdvanceDirectives
  }
] as const;

const ThemeToggle = () => {
  const { theme, toggleTheme } = usePalliativeThemeContext();
  
  const icon = {
    light: Sun,
    dark: Moon,
    system: Monitor
  }[theme];

  const Icon = icon;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
      title={`Current theme: ${theme}`}
    >
      <Icon className="h-5 w-5" />
    </Button>
  );
};

const PalliativeModuleContent = () => {
  const { activeTab, isTransitioning, handleTabChange } = usePalliativeNav("symptoms");
  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);

  const handleNext = () => {
    if (currentTabIndex < tabs.length - 1) {
      handleTabChange(tabs[currentTabIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentTabIndex > 0) {
      handleTabChange(tabs[currentTabIndex - 1].id);
    }
  };

  useKeyboardNav({
    onNext: handleNext,
    onPrevious: handlePrevious,
    enabled: !isTransitioning
  });

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          🕊️ Palliative Care Module
        </h1>
        <div className="flex items-center gap-2">
          <KeyboardShortcutsDialog />
          <ThemeToggle />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="bg-white border">
          {tabs.map(({ id, label, icon: Icon }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
              disabled={isTransitioning}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(({ id, component: Component }) => (
          <TabsContent 
            key={id} 
            value={id} 
            className="mt-6"
            forceMount
          >
            <div className={`
              transition-all duration-300 ease
              ${activeTab === id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute'}
            `}>
              <ErrorBoundary
                moduleName={`Palliative Care - ${id}`}
                fallback={
                  <ErrorMessage
                    title="Section Error"
                    message={`There was an error loading the ${id} section. Please try refreshing the page.`}
                  />
                }
              >
                <React.Suspense fallback={
                  <div className="flex items-center justify-center h-32">
                    <LoadingSpinner size="lg" />
                  </div>
                }>
                  <Component />
                </React.Suspense>
              </ErrorBoundary>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const PalliativeModule = () => {
  return (
    <PalliativeThemeProvider>
      <PalliativeCareProvider>
        <PalliativeModuleContent />
      </PalliativeCareProvider>
    </PalliativeThemeProvider>
  );
};

export default PalliativeModule;
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PalliativeCareProvider } from "./context/PalliativeContext";
import { PalliativeThemeProvider, usePalliativeThemeContext } from "./context/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Brain, Heart, Users, FileText, Moon, Sun, Monitor } from "lucide-react";
import { usePalliativeNav } from "./hooks/usePalliativeNav";
import { useKeyboardNav } from "./hooks/useKeyboardNav";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import { KeyboardShortcutsDialog } from "./components/KeyboardShortcutsDialog";

// Lazy load components
const SymptomControl = React.lazy(() => import("./sections/symptom_control/SymptomControl"));
const PainManagement = React.lazy(() => import("./sections/pain_management/PainManagement"));
const FamilySupport = React.lazy(() => import("./sections/end_of_life/FamilySupport"));
const AdvanceDirectives = React.lazy(() => import("./sections/end_of_life/AdvanceDirectives"));
const PsychosocialCare = React.lazy(() => import("./sections/psychosocial_support/PsychosocialCare"));

const tabs = [
  {
    id: "symptoms",
    label: "Symptom Control",
    icon: Brain,
    component: SymptomControl
  },
  {
    id: "pain",
    label: "Pain Management",
    icon: Heart,
    component: PainManagement
  },
  {
    id: "psychosocial",
    label: "Psychosocial Care",
    icon: Users,
    component: PsychosocialCare
  },
  {
    id: "family",
    label: "Family Support",
    icon: Users,
    component: FamilySupport
  },
  {
    id: "directives",
    label: "Advance Directives",
    icon: FileText,
    component: AdvanceDirectives
  }
] as const;

const ThemeToggle = () => {
  const { theme, toggleTheme } = usePalliativeThemeContext();
  
  const icon = {
    light: Sun,
    dark: Moon,
    system: Monitor
  }[theme];

  const Icon = icon;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
      title={`Current theme: ${theme}`}
    >
      <Icon className="h-5 w-5" />
    </Button>
  );
};

const PalliativeModuleContent = () => {
  const { activeTab, isTransitioning, handleTabChange } = usePalliativeNav("symptoms");
  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);

  const handleNext = () => {
    if (currentTabIndex < tabs.length - 1) {
      handleTabChange(tabs[currentTabIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentTabIndex > 0) {
      handleTabChange(tabs[currentTabIndex - 1].id);
    }
  };

  useKeyboardNav({
    onNext: handleNext,
    onPrevious: handlePrevious,
    enabled: !isTransitioning
  });

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          🕊️ Palliative Care Module
        </h1>
        <div className="flex items-center gap-2">
          <KeyboardShortcutsDialog />
          <ThemeToggle />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="bg-white border">
          {tabs.map(({ id, label, icon: Icon }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
              disabled={isTransitioning}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(({ id, component: Component }) => (
          <TabsContent 
            key={id} 
            value={id} 
            className="mt-6"
            forceMount
          >
            <div className={`
              transition-all duration-300 ease
              ${activeTab === id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute'}
            `}>
              <ErrorBoundary
                moduleName={`Palliative Care - ${id}`}
                fallback={
                  <ErrorMessage
                    title="Section Error"
                    message={`There was an error loading the ${id} section. Please try refreshing the page.`}
                  />
                }
              >
                <React.Suspense fallback={
                  <div className="flex items-center justify-center h-32">
                    <LoadingSpinner size="lg" />
                  </div>
                }>
                  <Component />
                </React.Suspense>
              </ErrorBoundary>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const PalliativeModule = () => {
  return (
    <PalliativeThemeProvider>
      <PalliativeCareProvider>
        <PalliativeModuleContent />
      </PalliativeCareProvider>
    </PalliativeThemeProvider>
  );
};

export default PalliativeModule;
