
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ReceivingItem, ShippingItem } from "./LogisticsModule";

interface LogisticsIndicatorsProps {
  receivingItems: ReceivingItem[];
  shippingItems: ShippingItem[];
}

const LogisticsIndicators = ({ receivingItems, shippingItems }: LogisticsIndicatorsProps) => {
  const totalReceived = receivingItems.filter(item => item.status === "received").length;
  const totalReceivedPercentage = receivingItems.length > 0 
    ? Math.round((totalReceived / receivingItems.length) * 100) 
    : 0;
    
  const totalShipped = shippingItems.filter(item => item.status === "shipped" || item.status === "delivered").length;
  const totalShippedPercentage = shippingItems.length > 0 
    ? Math.round((totalShipped / shippingItems.length) * 100) 
    : 0;
    
  const totalDelivered = shippingItems.filter(item => item.status === "delivered").length;
  const totalDeliveredPercentage = shippingItems.length > 0 
    ? Math.round((totalDelivered / shippingItems.length) * 100) 
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Receiving Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReceived} / {receivingItems.length}</div>
          <Progress value={totalReceivedPercentage} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {totalReceivedPercentage}% of items received
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Shipping Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalShipped} / {shippingItems.length}</div>
          <Progress value={totalShippedPercentage} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {totalShippedPercentage}% of orders shipped
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDelivered} / {shippingItems.length}</div>
          <Progress value={totalDeliveredPercentage} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {totalDeliveredPercentage}% of orders delivered
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticsIndicators;
