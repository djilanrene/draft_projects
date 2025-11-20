"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  FolderKanban,
  Home,
  Newspaper,
  PanelLeft,
  Share2,
  User,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth, useUser } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut } from "firebase/auth";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full">
        <div className="flex h-full w-14 flex-col border-r bg-background p-2">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
        <div className="flex-1 p-8">{children}</div>
      </div>
    );
  }

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push("/");
  };

  const navItems = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/projects", icon: FolderKanban, label: "Projets" },
    { href: "/admin/articles", icon: Newspaper, label: "Articles" },
    { href: "/admin/profile", icon: User, label: "Profil" },
    { href: "/admin/social-links", icon: Share2, label: "Réseaux Sociaux" },
    { href: "/admin/cv", icon: FileText, label: "CV" },
  ];

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full">
        <aside
          className={cn(
            "hidden h-screen flex-col border-r bg-background transition-all duration-300 md:flex",
            isCollapsed ? "w-14" : "w-64"
          )}
        >
          <div className={cn("flex h-16 items-center border-b px-4", isCollapsed ? 'justify-center' : 'justify-between')}>
            {!isCollapsed && (
              <Link href="/admin" className="font-bold">
                Backoffice
              </Link>
            )}
             <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </div>
          <nav className={cn("flex flex-col gap-2 p-2", isCollapsed ? "items-center" : "")}>
            {navItems.map((item) => (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      pathname === item.href && "bg-muted text-primary",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            ))}
          </nav>
          <div className="mt-auto p-2">
             <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Button onClick={handleLogout} variant="ghost" className={cn("w-full justify-start gap-3", isCollapsed && "justify-center")}>
                        <LogOut className="h-5 w-5" />
                        {!isCollapsed && <span>Déconnexion</span>}
                    </Button>
                </TooltipTrigger>
                 {isCollapsed && <TooltipContent side="right">Déconnexion</TooltipContent>}
            </Tooltip>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}

export default AdminLayout;
