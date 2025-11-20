"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCircle, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const profileImage = PlaceHolderImages.find((img) => img.id === 'profile');
  
  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/about", label: "À Propos" },
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
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
            <Link href="/" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  {profileImage && <AvatarImage src={profileImage.imageUrl} alt="Profile" />}
                  <AvatarFallback>
                    <UserCircle className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <span className="hidden font-bold sm:inline-block">Élégance</span>
            </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm md:flex md:flex-1 md:justify-center">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === link.href ? "text-primary font-semibold" : "text-foreground/60"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
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
                      className={cn(
                        "text-lg transition-colors hover:text-primary",
                        pathname === link.href ? "text-primary font-semibold" : "text-foreground/80"
                      )}
                    >
                      {link.label}
                    </Link>
                ))}
            </nav>
        </div>
      )}
    </header>
  );
}
