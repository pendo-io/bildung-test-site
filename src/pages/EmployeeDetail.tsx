import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { EmployeeStageProgress } from "@/components/hire-to-retire/EmployeeStageProgress";
import { EmployeeStageActions } from "@/components/hire-to-retire/EmployeeStageActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Mail,
  Phone,
  User,
  CheckCircle2,
  UserX,
  Edit,
  FileText,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockEmployee = {
  id: "EMP-45678",
  name: "Sarah Johnson",
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@ups.com",
  phone: "+1 (555) 987-6543",
  role: "Senior Logistics Manager",
  department: "Operations",
  employmentType: "Full-Time",
  location: "Atlanta, GA",
  startDate: "2024-12-15",
  salary: 95000,
  manager: "David Williams",
  stage: "onboarding",
  isTerminated: false,
  isOffboarded: false,
  createdAt: "2024-12-10",
};

const stages = ["offer", "onboarding", "probation", "active", "development", "offboarding"];

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [employee, setEmployee] = useState(mockEmployee);
  const [completedActions, setCompletedActions] = useState<string[]>([
    "paperwork",
    "equipment",
  ]);

  const handleActionToggle = (actionId: string) => {
    setCompletedActions((prev) =>
      prev.includes(actionId)
        ? prev.filter((id) => id !== actionId)
        : [...prev, actionId]
    );
  };

  const handleAdvanceStage = () => {
    const currentIndex = stages.indexOf(employee.stage);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      setEmployee((prev) => ({
        ...prev,
        stage: nextStage,
        isOffboarded: nextStage === "offboarding",
      }));
      setCompletedActions([]);

      toast({
        title: "Stage Updated",
        description: `Employee moved to ${nextStage.charAt(0).toUpperCase() + nextStage.slice(1)} stage`,
      });
    }
  };

  const handleTerminate = () => {
    setEmployee((prev) => ({ ...prev, isTerminated: true }));
    toast({
      title: "Employment Terminated",
      description: `${employee.name}'s employment has been terminated.`,
      variant: "destructive",
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");

  return (
    <AppLayout title="Employee Details" subtitle={employee.id}>
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/hire-to-retire")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Employees
      </Button>

      {/* Status Banner */}
      {(employee.isOffboarded || employee.isTerminated) && (
        <div
          className={cn(
            "mb-6 p-4 rounded-xl flex items-center gap-4",
            employee.isOffboarded && !employee.isTerminated && "bg-success/10 border border-success/20",
            employee.isTerminated && "bg-destructive/10 border border-destructive/20"
          )}
        >
          {employee.isOffboarded && !employee.isTerminated ? (
            <>
              <CheckCircle2 className="h-8 w-8 text-success" />
              <div>
                <h3 className="font-semibold text-success">Offboarding Complete</h3>
                <p className="text-sm text-success/80">
                  Employee has completed the offboarding process
                </p>
              </div>
            </>
          ) : (
            <>
              <UserX className="h-8 w-8 text-destructive" />
              <div>
                <h3 className="font-semibold text-destructive">Employment Terminated</h3>
                <p className="text-sm text-destructive/80">
                  This employee's employment has been terminated
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Stage Progress */}
      <Card className="mb-8 card-elevated">
        <CardHeader>
          <CardTitle>Employee Lifecycle</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeStageProgress
            currentStage={employee.stage}
            isTerminated={employee.isTerminated}
            isOffboarded={employee.isOffboarded}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Employee Details */}
          <Card className="card-elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Employee Information</CardTitle>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {getInitials(employee.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-card-foreground">
                    {employee.name}
                  </h2>
                  <p className="text-lg text-muted-foreground">{employee.role}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{employee.department}</Badge>
                    <Badge variant="outline">{employee.employmentType}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{employee.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{employee.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{employee.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Annual Salary</p>
                      <p className="text-xl font-bold text-accent">
                        {formatCurrency(employee.salary)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">{employee.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Reports To</p>
                      <p className="font-medium">{employee.manager}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stage Actions */}
          {!employee.isOffboarded && !employee.isTerminated && (
            <EmployeeStageActions
              stage={employee.stage}
              completedActions={completedActions}
              onActionToggle={handleActionToggle}
              onAdvanceStage={handleAdvanceStage}
              onTerminate={handleTerminate}
            />
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                View Documents
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <GraduationCap className="h-4 w-4 mr-2" />
                Training Records
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Briefcase className="h-4 w-4 mr-2" />
                Performance Reviews
              </Button>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-base">Employment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employee ID</span>
                  <span className="font-medium">{employee.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{employee.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={employee.isTerminated ? "destructive" : "default"}>
                    {employee.isTerminated ? "Terminated" : "Active"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
