
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogisticsModule from "@/components/logistics/LogisticsModule";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Logistics Management System</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Logistics Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <LogisticsModule />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
