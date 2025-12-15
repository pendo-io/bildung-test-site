import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AddPurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: (po: any) => void;
}

const vendors = [
  { value: "office-depot", label: "Office Depot" },
  { value: "tech-solutions", label: "Tech Solutions Inc" },
  { value: "industrial-supply", label: "Industrial Supply Co" },
  { value: "fleet-maintenance", label: "Fleet Maintenance Corp" },
  { value: "global-logistics", label: "Global Logistics Parts" },
];

const categories = [
  { value: "office-supplies", label: "Office Supplies" },
  { value: "it-equipment", label: "IT Equipment" },
  { value: "fleet-parts", label: "Fleet Parts" },
  { value: "warehouse", label: "Warehouse Equipment" },
  { value: "services", label: "Professional Services" },
];

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export function AddPurchaseOrderDialog({
  open,
  onOpenChange,
  onAdd,
}: AddPurchaseOrderDialogProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    vendor: "",
    category: "",
    priority: "medium",
    amount: "",
    description: "",
    deliveryDate: "",
    department: "",
    costCenter: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPO = {
      id: `PO-2024-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      status: "pending",
      stage: "requested",
      createdAt: new Date().toISOString(),
      requestedBy: "Current User",
    };

    onAdd?.(newPO);

    toast({
      title: "Purchase Order Created",
      description: `${newPO.id} has been submitted for approval.`,
    });

    onOpenChange(false);
    setFormData({
      vendor: "",
      category: "",
      priority: "medium",
      amount: "",
      description: "",
      deliveryDate: "",
      department: "",
      costCenter: "",
    });

    navigate(`/source-to-pay/purchase-order/${newPO.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <DialogDescription>
            Submit a new purchase order for approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="vendor">Vendor *</Label>
              <Select
                value={formData.vendor}
                onValueChange={(value) =>
                  setFormData({ ...formData, vendor: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.value} value={vendor.value}>
                      {vendor.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Amount ($) *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="10000"
                required
              />
            </div>

            <div>
              <Label htmlFor="deliveryDate">Required Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryDate: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                placeholder="Operations"
              />
            </div>

            <div>
              <Label htmlFor="costCenter">Cost Center</Label>
              <Input
                id="costCenter"
                value={formData.costCenter}
                onChange={(e) =>
                  setFormData({ ...formData, costCenter: e.target.value })
                }
                placeholder="CC-1234"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe what you're ordering..."
                rows={3}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Submit for Approval</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
