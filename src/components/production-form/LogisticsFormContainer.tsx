
import React, { useState } from "react";
import LogisticsSectionSelector from "./LogisticsSectionSelector";
import LogisticsSection from "./LogisticsSection";

interface LogisticsFormContainerProps {
  loadingTime: number;
  setLoadingTime: (v: number) => void;
  unloadingTime: number;
  setUnloadingTime: (v: number) => void;
}

export default function LogisticsFormContainer({
  loadingTime,
  setLoadingTime,
  unloadingTime,
  setUnloadingTime,
}: LogisticsFormContainerProps) {
  const [selectedSection, setSelectedSection] = useState<"loading" | "unloading" | null>(null);

  if (!selectedSection) {
    return <LogisticsSectionSelector onSelectSection={setSelectedSection} />;
  }

  return (
    <div>
      <LogisticsSection
        loadingTime={loadingTime}
        setLoadingTime={setLoadingTime}
        unloadingTime={unloadingTime}
        setUnloadingTime={setUnloadingTime}
        showLogistics={true}
      />
      <div className="mt-4 flex justify-end">
        <Button
          onClick={() => setSelectedSection(null)}
          variant="outline"
          className="text-gray-600 hover:text-gray-800"
        >
          Voltar à seleção
        </Button>
        <Button
          onClick={() => {/* Save logic here */}}
          className="ml-4 bg-green-600 hover:bg-green-700 text-white"
        >
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
