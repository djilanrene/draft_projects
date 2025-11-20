import * as React from "react";
import { Github, Linkedin, Mail, MessageSquare } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-8">
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center gap-6">
        <div className="flex items-center gap-6">
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <Linkedin className="h-6 w-6" />
            <span className="sr-only">LinkedIn</span>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <Github className="h-6 w-6" />
            <span className="sr-only">GitHub</span>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <MessageSquare className="h-6 w-6" />
            <span className="sr-only">WhatsApp</span>
          </a>
          <a href="mailto:#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Mail className="h-6 w-6" />
            <span className="sr-only">Gmail</span>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M14 6.46a4.48 4.48 0 0 0-8.91.13c0 2.45 1.14 4.5 4.44 4.5s4.5-2.05 4.5-4.5a.05.05 0 0 0 0-.13Z" />
              <path d="M19.82 20.93a.2.2 0 0 0 .18-.33c-.15-1.05-1.02-3.6-4.5-3.6-2.52 0-4.14 1.7-4.5 3.6a.2.2 0 0 0 .18.33h8.64Z" />
              <path d="M22 20.6v.33a.2.2 0 0 1-.2.2H14v-4.13c3.55 0 5.4 2.8 5.7 4.13a.2.2 0 0 1 .1.2c.2.06.4-.04.4-.13V18c-0.3-2-2.1-4-5.5-4s-5.2 2-5.5 4v2.6c0 .1.2.2.4.13a.2.2 0 0 1 .1-.2c0.3-1.3 2.15-4.13 5.7-4.13V21H2.2a.2.2 0 0 1-.2-.2v-.33c.25-1.12 1.3-4.6 6.5-4.6s6.25 3.48 6.5 4.6Z" />
            </svg>
            <span className="sr-only">Medium</span>
          </a>
        </div>
        <p className="text-center text-sm leading-loose text-muted-foreground">
          © {new Date().getFullYear()} Draft Projects. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
