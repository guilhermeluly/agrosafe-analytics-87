
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import LogisticsIndicators from "./LogisticsIndicators";
import ReceivingForm from "./ReceivingForm";
import ShippingForm from "./ShippingForm";

export interface LogisticsData {
  receivingItems: ReceivingItem[];
  shippingItems: ShippingItem[];
}

export interface ReceivingItem {
  id: string;
  productName: string;
  quantity: number;
  date: string;
  status: "pending" | "received" | "rejected";
}

export interface ShippingItem {
  id: string;
  orderNumber: string;
  destination: string;
  items: number;
  date: string;
  status: "pending" | "shipped" | "delivered";
}

const LogisticsModule = () => {
  const [logisticsData, setLogisticsData] = useState<LogisticsData>({
    receivingItems: [],
    shippingItems: []
  });

  const handleReceivingSubmit = (item: ReceivingItem) => {
    setLogisticsData(prev => ({
      ...prev,
      receivingItems: [...prev.receivingItems, item]
    }));
  };

  const handleShippingSubmit = (item: ShippingItem) => {
    setLogisticsData(prev => ({
      ...prev,
      shippingItems: [...prev.shippingItems, item]
    }));
  };

  return (
    <div className="space-y-6">
      <LogisticsIndicators 
        receivingItems={logisticsData.receivingItems}
        shippingItems={logisticsData.shippingItems}
      />
      
      <Tabs defaultValue="receiving" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="receiving">Receiving</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>
        <TabsContent value="receiving">
          <ReceivingForm onSubmit={handleReceivingSubmit} />
        </TabsContent>
        <TabsContent value="shipping">
          <ShippingForm onSubmit={handleShippingSubmit} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogisticsModule;
