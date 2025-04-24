
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface OEEPreviewSectionProps {
  oeePreview: {
    availability: number;
    performance: number;
    quality: number;
    oee: number;
  };
}

export default function OEEPreviewSection({ oeePreview }: OEEPreviewSectionProps) {
  return (
    <Card className="bg-green-50 dark:bg-green-900/20 shadow border-l-4 border-green-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Prévia do Cálculo OEE</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="text-center p-2">
            <div className="text-sm font-medium">Disponibilidade</div>
            <div className="text-2xl font-bold">{oeePreview.availability}%</div>
          </div>
          <div className="text-center p-2">
            <div className="text-sm font-medium">Performance</div>
            <div className="text-2xl font-bold">{oeePreview.performance}%</div>
          </div>
          <div className="text-center p-2">
            <div className="text-sm font-medium">Qualidade</div>
            <div className="text-2xl font-bold">{oeePreview.quality}%</div>
          </div>
          <div className="text-center p-2 bg-green-100 dark:bg-green-800/40 rounded-md">
            <div className="text-sm font-medium">OEE</div>
            <div className="text-2xl font-bold">{oeePreview.oee}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
