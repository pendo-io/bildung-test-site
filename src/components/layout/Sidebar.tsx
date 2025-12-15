import { cn } from "@/lib/utils";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  Users,
  FileText,
  Package,
  CreditCard,
  UserCheck,
  Building2,
  Settings,
  ChevronRight,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Source to Pay",
    href: "/source-to-pay",
    icon: ShoppingCart,
    children: [
      { name: "Vendors", href: "/source-to-pay/vendors", icon: Building2 },
      { name: "Purchase Orders", href: "/source-to-pay/orders", icon: FileText },
      { name: "Invoices", href: "/source-to-pay/invoices", icon: CreditCard },
    ],
  },
  {
    name: "Lead to Cash",
    href: "/lead-to-cash",
    icon: TrendingUp,
    children: [
      { name: "Leads", href: "/lead-to-cash/leads", icon: Users },
      { name: "Opportunities", href: "/lead-to-cash/opportunities", icon: TrendingUp },
      { name: "Orders", href: "/lead-to-cash/orders", icon: Package },
    ],
  },
  {
    name: "Hire to Retire",
    href: "/hire-to-retire",
    icon: UserCheck,
    children: [
      { name: "Employees", href: "/hire-to-retire/employees", icon: Users },
      { name: "Recruitment", href: "/hire-to-retire/recruitment", icon: UserCheck },
      { name: "Performance", href: "/hire-to-retire/performance", icon: TrendingUp },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Package className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">UPS ERP</h1>
            <p className="text-xs text-sidebar-muted">Enterprise Platform</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navigation.map((item) => (
            <div key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive: active }) =>
                  cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive(item.href)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )
                }
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive(item.href) ? "text-sidebar-primary" : "text-sidebar-muted group-hover:text-sidebar-foreground"
                  )}
                />
                <span className="flex-1">{item.name}</span>
                {item.children && (
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isActive(item.href) && "rotate-90"
                    )}
                  />
                )}
              </NavLink>

              {/* Sub-navigation */}
              {item.children && isActive(item.href) && (
                <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.name}
                      to={child.href}
                      className={({ isActive: childActive }) =>
                        cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                          childActive
                            ? "text-sidebar-primary font-medium"
                            : "text-sidebar-muted hover:text-sidebar-foreground"
                        )
                      }
                    >
                      <child.icon className="h-4 w-4" />
                      {child.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <NavLink
            to="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            <Settings className="h-5 w-5" />
            Settings
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
