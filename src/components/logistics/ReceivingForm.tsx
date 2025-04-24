
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ReceivingItem } from "./LogisticsModule";
import { toast } from "sonner";

interface ReceivingFormProps {
  onSubmit: (item: ReceivingItem) => void;
}

const ReceivingForm = ({ onSubmit }: ReceivingFormProps) => {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState<"pending" | "received" | "rejected">("pending");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !quantity) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const newItem: ReceivingItem = {
      id: Date.now().toString(),
      productName,
      quantity: Number(quantity),
      date: new Date().toISOString(),
      status
    };
    
    onSubmit(newItem);
    toast.success("Item added successfully");
    
    // Reset form
    setProductName("");
    setQuantity("");
    setStatus("pending");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Receiving Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input 
              id="productName" 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input 
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              min="1"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={status} 
              onValueChange={(value: "pending" | "received" | "rejected") => setStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full">Add Item</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReceivingForm;
