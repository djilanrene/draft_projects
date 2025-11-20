"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCircle, Menu, X, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import type { Profile } from "@/lib/types";

type CvInfo = {
  url: string;
}

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  const firestore = useFirestore();
  const profileRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "profile", "main") : null),
    [firestore]
  );
  const { data: profile } = useDoc<Profile>(profileRef);

  const cvRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "cv", "main") : null),
    [firestore]
  );
  const { data: cvData } = useDoc<CvInfo>(cvRef);


  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/about", label: "À Propos" },
    { href: "/blog", label: "Blog" },
    { href: cvData?.url || "#", label: "Télécharger mon CV", download: !!cvData?.url },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled || isMenuOpen
          ? "border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-transparent"
      )}
    >
      <div className="px-4 sm:px-6 flex h-16 items-center">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-6 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Ouvrir le menu</span>
            </Button>
          </div>

          <div className="hidden md:flex">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold sm:inline-block">Draft Projects</span>
            </Link>
          </div>

          <nav className="hidden absolute left-1/2 -translate-x-1/2 items-center gap-6 text-sm md:flex">
            <Link
                href="/"
                className="flex items-center space-x-2"
              >
              <Avatar className="h-8 w-8">
                {profile?.profileImageUrl && <AvatarImage src={profile.profileImageUrl} alt="Profile" />}
                <AvatarFallback>
                  <UserCircle className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Link>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                target={link.download ? "_blank" : undefined}
                rel={link.download ? "noopener noreferrer" : undefined}
                className={cn(
                  "transition-colors hover:text-primary",
                   !link.download && pathname.startsWith(link.href) ? "text-primary font-semibold" : "text-foreground/60",
                   !cvData?.url && link.href === "#" ? "pointer-events-none opacity-50" : ""
                )}
              >
                {link.label}
              </Link>
            ))}
             {user && (
                <Link
                    href="/admin"
                    className={cn(
                        "transition-colors hover:text-primary flex items-center gap-2",
                        pathname.startsWith('/admin') ? "text-primary font-semibold" : "text-foreground/60"
                    )}
                >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                </Link>
            )}
          </nav>
          
          <div className="flex items-center justify-end">
             <ThemeToggle />
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
            <nav className="flex flex-col items-center gap-4 p-4">
                {navLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      target={link.download ? "_blank" : undefined}
                      rel={link.download ? "noopener noreferrer" : undefined}
                      className={cn(
                        "text-lg transition-colors hover:text-primary",
                        !link.download && pathname.startsWith(link.href) ? "text-primary font-semibold" : "text-foreground/80",
                        !cvData?.url && link.href === "#" ? "pointer-events-none opacity-50" : ""
                      )}
                    >
                      {link.label}
                    </Link>
                ))}
                 {user && (
                    <Link
                        href="/admin"
                         onClick={() => setIsMenuOpen(false)}
                        className={cn(
                            "text-lg transition-colors hover:text-primary flex items-center gap-2",
                            pathname.startsWith('/admin') ? "text-primary font-semibold" : "text-foreground/80"
                        )}
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </Link>
                )}
            </nav>
        </div>
      )}
    </header>
  );
}
