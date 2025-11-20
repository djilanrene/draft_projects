"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const profileImage = PlaceHolderImages.find((img) => img.id === 'profile');

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center">
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className={cn(
              "transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-foreground/60"
            )}
          >
            Accueil
          </Link>
          <Link
            href="/about"
            className={cn(
              "transition-colors hover:text-primary",
              pathname === "/about" ? "text-primary" : "text-foreground/60"
            )}
          >
            À Propos
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end">
          <Link href="/about">
            <Avatar className="h-9 w-9">
              {profileImage && <AvatarImage src={profileImage.imageUrl} alt="Profile" />}
              <AvatarFallback>
                <UserCircle className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">À Propos</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
