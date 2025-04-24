
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ShippingItem } from "./LogisticsModule";
import { toast } from "sonner";

interface ShippingFormProps {
  onSubmit: (item: ShippingItem) => void;
}

const ShippingForm = ({ onSubmit }: ShippingFormProps) => {
  const [orderNumber, setOrderNumber] = useState("");
  const [destination, setDestination] = useState("");
  const [items, setItems] = useState("");
  const [status, setStatus] = useState<"pending" | "shipped" | "delivered">("pending");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber || !destination || !items) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const newItem: ShippingItem = {
      id: Date.now().toString(),
      orderNumber,
      destination,
      items: Number(items),
      date: new Date().toISOString(),
      status
    };
    
    onSubmit(newItem);
    toast.success("Shipping order added successfully");
    
    // Reset form
    setOrderNumber("");
    setDestination("");
    setItems("");
    setStatus("pending");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Shipping Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="orderNumber">Order Number</Label>
            <Input 
              id="orderNumber" 
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter order number"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="destination">Destination</Label>
            <Input 
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="items">Number of Items</Label>
            <Input 
              id="items"
              type="number"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              placeholder="Enter number of items"
              min="1"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={status} 
              onValueChange={(value: "pending" | "shipped" | "delivered") => setStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full">Add Shipping Order</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ShippingForm;
