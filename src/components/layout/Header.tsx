import { Bell, RefreshCw, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { userInfo, refreshUser } = useUser();

  const roleColors = {
    admin: "bg-green-500/20 text-green-400 border-green-500/30",
    user: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "read-only": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-64 pl-9 bg-muted/50 border-transparent focus:border-border"
          />
        </div>

        {/* Refresh User Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={refreshUser}
          title="Refresh visitor/account"
          data-pendo-id="refresh-visitor"
        >
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative" data-pendo-id="notifications">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent animate-pulse-subtle" />
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2" data-pendo-id="user-menu">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden lg:flex flex-col items-start text-left">
                <span className="text-sm font-medium">{userInfo.visitor}</span>
                <span className="text-xs text-muted-foreground">{userInfo.account}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{userInfo.visitor}</p>
                <p className="text-xs text-muted-foreground">{userInfo.visitorId}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex justify-between">
              <span className="text-muted-foreground">Account</span>
              <span className="font-medium">{userInfo.account}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-between">
              <span className="text-muted-foreground">Role</span>
              <Badge variant="outline" className={roleColors[userInfo.role]}>
                {userInfo.role}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={refreshUser} className="cursor-pointer" data-pendo-id="simulate-new-visitor">
              <RefreshCw className="mr-2 h-4 w-4" />
              Simulate New Visitor
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
