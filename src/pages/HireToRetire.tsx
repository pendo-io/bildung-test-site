import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AddEmployeeDialog } from "@/components/hire-to-retire/AddEmployeeDialog";
import { UserCheck, Users, Briefcase, TrendingUp, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const initialRecentHires = [
  { id: "EMP-45678", name: "Sarah Johnson", role: "Senior Logistics Manager", department: "Operations", location: "Atlanta, GA", startDate: "Dec 15, 2024", status: "onboarding" },
  { id: "EMP-45677", name: "Michael Chen", role: "Data Analyst", department: "Analytics", location: "Louisville, KY", startDate: "Dec 10, 2024", status: "active" },
  { id: "EMP-45676", name: "Emily Rodriguez", role: "Fleet Coordinator", department: "Transportation", location: "Dallas, TX", startDate: "Dec 8, 2024", status: "active" },
  { id: "EMP-45675", name: "James Wilson", role: "Warehouse Supervisor", department: "Logistics", location: "Chicago, IL", startDate: "Dec 5, 2024", status: "active" },
];

const openPositions = [
  { title: "Supply Chain Director", department: "Operations", location: "Atlanta, GA", applicants: 45, priority: "high" },
  { title: "Software Engineer II", department: "Technology", location: "Louisville, KY", applicants: 128, priority: "medium" },
  { title: "HR Business Partner", department: "Human Resources", location: "Remote", applicants: 67, priority: "medium" },
  { title: "Package Handler", department: "Operations", location: "Multiple Locations", applicants: 234, priority: "low" },
];

const priorityStyles = { high: "bg-destructive/10 text-destructive border-destructive/30", medium: "bg-warning/10 text-warning border-warning/30", low: "bg-muted text-muted-foreground border-border" };

export default function HireToRetire() {
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [recentHires, setRecentHires] = useState(initialRecentHires);

  const handleAddEmployee = (newEmp: any) => {
    setRecentHires(prev => [{ ...newEmp, status: "onboarding" }, ...prev]);
  };

  return (
    <AppLayout title="Hire to Retire" subtitle="Manage employee lifecycle and HR operations">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard title="Total Employees" value="45,623" change={{ value: "+156", trend: "up" }} icon={Users} variant="primary" />
        <MetricCard title="Open Positions" value="89" change={{ value: "-12", trend: "down" }} icon={Briefcase} variant="accent" />
        <MetricCard title="New Hires (MTD)" value="156" change={{ value: "+23%", trend: "up" }} icon={UserCheck} />
        <MetricCard title="Turnover Rate" value="4.2%" change={{ value: "-0.3%", trend: "down" }} icon={TrendingUp} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 card-elevated">
          <div className="flex items-center justify-between mb-6">
            <div><h3 className="text-lg font-semibold text-card-foreground">Recent Hires</h3><p className="text-sm text-muted-foreground">New team members joining this month</p></div>
            <Button onClick={() => setShowAddDialog(true)}>Add Employee</Button>
          </div>
          <div className="space-y-4">
            {recentHires.map((employee) => (
              <div key={employee.id} onClick={() => navigate(`/hire-to-retire/employee/${employee.id}`)} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary text-primary-foreground text-sm">{employee.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><h4 className="font-medium text-card-foreground truncate">{employee.name}</h4>{employee.status === "onboarding" && <Badge variant="outline" className="bg-info/10 text-info border-info/30">Onboarding</Badge>}</div>
                  <p className="text-sm text-muted-foreground truncate">{employee.role} • {employee.department}</p>
                </div>
                <div className="text-right hidden sm:block"><div className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{employee.location}</div><div className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" />{employee.startDate}</div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 card-elevated">
          <div className="flex items-center justify-between mb-6"><div><h3 className="text-lg font-semibold text-card-foreground">Open Positions</h3><p className="text-sm text-muted-foreground">Active job requisitions</p></div><Button>Post New Job</Button></div>
          <div className="space-y-4">
            {openPositions.map((position) => (
              <div key={position.title} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted"><Briefcase className="h-5 w-5 text-muted-foreground" /></div>
                <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><h4 className="font-medium text-card-foreground truncate">{position.title}</h4><Badge variant="outline" className={priorityStyles[position.priority as keyof typeof priorityStyles]}>{position.priority}</Badge></div><p className="text-sm text-muted-foreground truncate">{position.department} • {position.location}</p></div>
                <div className="text-right"><p className="text-lg font-semibold text-card-foreground">{position.applicants}</p><p className="text-xs text-muted-foreground">applicants</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddEmployeeDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={handleAddEmployee} />
    </AppLayout>
  );
}
