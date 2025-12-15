import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ModuleOverview } from "@/components/dashboard/ModuleOverview";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import {
  ShoppingCart,
  TrendingUp,
  UserCheck,
  DollarSign,
  FileText,
  Users,
  Package,
} from "lucide-react";

const Index = () => {
  return (
    <AppLayout
      title="Dashboard"
      subtitle="Welcome back! Here's an overview of your enterprise operations."
    >
      {/* Top Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Total Revenue"
          value="$12.4M"
          change={{ value: "+12.5%", trend: "up" }}
          icon={DollarSign}
          variant="primary"
        />
        <MetricCard
          title="Active Vendors"
          value="847"
          change={{ value: "+23", trend: "up" }}
          icon={Package}
          variant="accent"
        />
        <MetricCard
          title="Open Purchase Orders"
          value="1,234"
          change={{ value: "-5.2%", trend: "down" }}
          icon={FileText}
        />
        <MetricCard
          title="Total Employees"
          value="45,623"
          change={{ value: "+156", trend: "up" }}
          icon={Users}
        />
      </div>

      {/* Module Overviews */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <ModuleOverview
          title="Source to Pay"
          description="Manage procurement, vendors, and payments"
          icon={ShoppingCart}
          href="/source-to-pay"
          color="brown"
          stats={[
            { label: "Pending POs", value: "234" },
            { label: "Due Invoices", value: "$2.1M" },
            { label: "Vendors", value: "847" },
          ]}
        />
        <ModuleOverview
          title="Lead to Cash"
          description="Track sales pipeline and revenue"
          icon={TrendingUp}
          href="/lead-to-cash"
          color="amber"
          stats={[
            { label: "Active Leads", value: "1,456" },
            { label: "Pipeline", value: "$8.4M" },
            { label: "Win Rate", value: "34%" },
          ]}
        />
        <ModuleOverview
          title="Hire to Retire"
          description="Employee lifecycle management"
          icon={UserCheck}
          href="/hire-to-retire"
          color="green"
          stats={[
            { label: "Open Positions", value: "89" },
            { label: "New Hires", value: "156" },
            { label: "Turnover", value: "4.2%" },
          ]}
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
