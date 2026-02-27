import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { POStageProgress } from "@/components/source-to-pay/POStageProgress";
import { POStageActions } from "@/components/source-to-pay/POStageActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  Package,
  Tag,
  User,
  CheckCircle2,
  XCircle,
  Edit,
  FileText,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockPO = {
  id: "PO-2024-0892",
  vendor: "Office Depot",
  vendorContact: "vendor@officedepot.com",
  category: "Office Supplies",
  priority: "medium",
  amount: 12450,
  description: "Q4 office supplies including paper, printer cartridges, and stationery",
  deliveryDate: "2024-12-20",
  department: "Operations",
  costCenter: "CC-4521",
  createdAt: "2024-12-14",
  requestedBy: "John Smith",
  stage: "approved",
  isCancelled: false,
  isComplete: false,
};

const stages = ["requested", "approved", "ordered", "shipped", "received", "paid"];

const priorityStyles = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-warning/10 text-warning border-warning/30",
  high: "bg-accent/10 text-accent border-accent/30",
  urgent: "bg-destructive/10 text-destructive border-destructive/30",
};

export default function PurchaseOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [po, setPO] = useState(mockPO);
  const [completedActions, setCompletedActions] = useState<string[]>([
    "final_review",
  ]);

  const handleActionToggle = (actionId: string) => {
    setCompletedActions((prev) =>
      prev.includes(actionId)
        ? prev.filter((id) => id !== actionId)
        : [...prev, actionId]
    );
  };

  const handleAdvanceStage = () => {
    const currentIndex = stages.indexOf(po.stage);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      setPO((prev) => ({
        ...prev,
        stage: nextStage,
        isComplete: nextStage === "paid",
      }));
      setCompletedActions([]);

      toast({
        title: "Stage Updated",
        description: `PO moved to ${nextStage.charAt(0).toUpperCase() + nextStage.slice(1)} stage`,
      });
    }
  };

  const handleCancel = () => {
    setPO((prev) => ({ ...prev, isCancelled: true }));
    toast({
      title: "Purchase Order Cancelled",
      description: `${po.id} has been cancelled.`,
      variant: "destructive",
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <AppLayout title="Purchase Order Details" subtitle={po.id}>
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/source-to-pay")}
        data-pendo-id="back-to-purchase-orders"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Purchase Orders
      </Button>

      {/* Status Banner */}
      {(po.isComplete || po.isCancelled) && (
        <div
          className={cn(
            "mb-6 p-4 rounded-xl flex items-center gap-4",
            po.isComplete && "bg-success/10 border border-success/20",
            po.isCancelled && "bg-destructive/10 border border-destructive/20"
          )}
        >
          {po.isComplete ? (
            <>
              <CheckCircle2 className="h-8 w-8 text-success" />
              <div>
                <h3 className="font-semibold text-success">PO Complete!</h3>
                <p className="text-sm text-success/80">
                  Payment processed for {formatCurrency(po.amount)}
                </p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-8 w-8 text-destructive" />
              <div>
                <h3 className="font-semibold text-destructive">PO Cancelled</h3>
                <p className="text-sm text-destructive/80">
                  This purchase order has been cancelled
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Stage Progress */}
      <Card className="mb-8 card-elevated">
        <CardHeader className="w-fit">
          <CardTitle>Order Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <POStageProgress
            currentStage={po.stage}
            isCancelled={po.isCancelled}
            isComplete={po.isComplete}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* PO Details */}
          <Card className="card-elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Order Details</CardTitle>
              <Button variant="ghost" size="sm" data-pendo-id="edit-po">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Vendor</p>
                      <p className="font-medium">{po.vendor}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">{po.category}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Requested By</p>
                      <p className="font-medium">{po.requestedBy}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium">{po.department}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="text-2xl font-bold text-accent">
                        {formatCurrency(po.amount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery Date</p>
                      <p className="font-medium">{po.deliveryDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Priority</p>
                    <Badge
                      variant="outline"
                      className={cn("capitalize", priorityStyles[po.priority as keyof typeof priorityStyles])}
                    >
                      {po.priority}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Cost Center</p>
                    <Badge variant="secondary">{po.costCenter}</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-card-foreground">{po.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Stage Actions */}
          {!po.isComplete && !po.isCancelled && (
            <POStageActions
              stage={po.stage}
              completedActions={completedActions}
              onActionToggle={handleActionToggle}
              onAdvanceStage={handleAdvanceStage}
              onCancel={handleCancel}
            />
          )}
        </div>

        {/* Right Column - Quick Info */}
        <div className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" data-pendo-id="view-documents">
                <FileText className="h-4 w-4 mr-2" />
                View Documents
              </Button>
              <Button variant="outline" className="w-full justify-start" data-pendo-id="track-shipment">
                <Truck className="h-4 w-4 mr-2" />
                Track Shipment
              </Button>
              <Button variant="outline" className="w-full justify-start" data-pendo-id="contact-vendor">
                <Building2 className="h-4 w-4 mr-2" />
                Contact Vendor
              </Button>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{po.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected Delivery</span>
                  <span className="font-medium">{po.deliveryDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
