"use client";

import * as React from "react";
import * as LucideIcons from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { SocialLink } from "@/lib/types";

// A type assertion to allow string indexing for LucideIcons
const Icons = LucideIcons as unknown as { [key: string]: React.ComponentType<{ className?: string }> };

export function SiteFooter() {
  const firestore = useFirestore();
  const socialLinksQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "social_links"), orderBy("name")) : null),
    [firestore]
  );
  const { data: socialLinks } = useCollection<SocialLink>(socialLinksQuery);

  return (
    <footer className="py-6 md:px-8 md:py-8">
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center gap-6">
        <div className="flex items-center gap-6">
          {socialLinks?.map((link) => {
            const IconComponent = Icons[link.icon];
            if (!IconComponent) {
              // Fallback for an unknown icon
              return (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <LucideIcons.Link className="h-6 w-6" />
                  <span className="sr-only">{link.name}</span>
                </a>
              );
            }
            return (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <IconComponent className="h-6 w-6" />
                <span className="sr-only">{link.name}</span>
              </a>
            );
          })}
        </div>
        <p className="text-center text-sm leading-loose text-muted-foreground">
          © {new Date().getFullYear()} Draft Projects. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
