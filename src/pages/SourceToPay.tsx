import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import {
  ShoppingCart,
  FileText,
  CreditCard,
  Building2,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const purchaseOrders = [
  {
    id: "PO-2024-0892",
    vendor: "Office Depot",
    amount: "$12,450.00",
    status: "pending",
    date: "Dec 14, 2024",
  },
  {
    id: "PO-2024-0891",
    vendor: "Tech Solutions Inc",
    amount: "$45,230.00",
    status: "approved",
    date: "Dec 13, 2024",
  },
  {
    id: "PO-2024-0890",
    vendor: "Industrial Supply Co",
    amount: "$8,920.00",
    status: "processing",
    date: "Dec 12, 2024",
  },
  {
    id: "PO-2024-0889",
    vendor: "Global Logistics Parts",
    amount: "$23,100.00",
    status: "approved",
    date: "Dec 11, 2024",
  },
  {
    id: "PO-2024-0888",
    vendor: "Fleet Maintenance Corp",
    amount: "$67,800.00",
    status: "pending",
    date: "Dec 10, 2024",
  },
];

const statusStyles = {
  pending: {
    variant: "outline" as const,
    icon: Clock,
    className: "text-warning border-warning/30 bg-warning/10",
  },
  approved: {
    variant: "outline" as const,
    icon: CheckCircle2,
    className: "text-success border-success/30 bg-success/10",
  },
  processing: {
    variant: "outline" as const,
    icon: AlertCircle,
    className: "text-info border-info/30 bg-info/10",
  },
};

export default function SourceToPay() {
  return (
    <AppLayout
      title="Source to Pay"
      subtitle="Manage procurement, vendors, and payment operations"
    >
      {/* Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Total Spend (YTD)"
          value="$24.8M"
          change={{ value: "+8.3%", trend: "up" }}
          icon={ShoppingCart}
          variant="primary"
        />
        <MetricCard
          title="Active Vendors"
          value="847"
          change={{ value: "+12", trend: "up" }}
          icon={Building2}
          variant="accent"
        />
        <MetricCard
          title="Open POs"
          value="234"
          change={{ value: "-18", trend: "down" }}
          icon={FileText}
        />
        <MetricCard
          title="Pending Invoices"
          value="$2.1M"
          change={{ value: "+$340K", trend: "up" }}
          icon={CreditCard}
        />
      </div>

      {/* Purchase Orders Table */}
      <div className="rounded-xl border border-border bg-card p-6 card-elevated">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Recent Purchase Orders
            </h3>
            <p className="text-sm text-muted-foreground">
              Track and manage your procurement requests
            </p>
          </div>
          <Button>Create New PO</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseOrders.map((po) => {
              const StatusIcon = statusStyles[po.status as keyof typeof statusStyles].icon;
              return (
                <TableRow key={po.id}>
                  <TableCell className="font-medium">{po.id}</TableCell>
                  <TableCell>{po.vendor}</TableCell>
                  <TableCell>{po.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={statusStyles[po.status as keyof typeof statusStyles].variant}
                      className={statusStyles[po.status as keyof typeof statusStyles].className}
                    >
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{po.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
