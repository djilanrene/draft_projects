"use client";

import * as React from "react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { Project } from "@/lib/types";
import { ProjectCard } from "@/components/project-card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { TypewriterEffect } from "@/components/typewriter-effect";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const firestore = useFirestore();

  const projectsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "projects"), orderBy("title")) : null),
    [firestore]
  );
  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  const staticWords = [{ text: "Apprendre," }, { text: "Standardiser," }];
  const dynamicWords = [
    { text: "Coder", className: "text-primary" },
    { text: "Automatiser", className: "text-primary" },
    { text: "Publier", className: "text-primary" },
  ];

  const filteredProjects = React.useMemo(() => {
    if (!projects) return [];
    if (!searchTerm) {
      return projects;
    }
    return projects.filter(project =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.software.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, projects]);

  const ProjectSkeletons = () => (
    <>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </>
  );

  return (
    <main className="px-4 md:px-6 py-12 md:py-24">
      <div className="text-center">
        <TypewriterEffect 
          staticWords={staticWords}
          dynamicWords={dynamicWords}
          className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl justify-center" 
        />
        <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
          Une collection de petits projets et d'expérimentations, nés ici et là.
        </p>
      </div>

      <div className="my-12 flex justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des projets..."
            className="w-full rounded-full bg-muted pl-10 pr-4 py-2 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        <AnimatePresence>
          <motion.div 
              layout 
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
          >
            {isLoading ? (
              <ProjectSkeletons />
            ) : (
              filteredProjects.map((project) => (
                <motion.div layout key={project.id} animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <ProjectCard project={project} />
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
        {!isLoading && filteredProjects.length === 0 && (
            <div className="mt-16 text-center text-muted-foreground">
                <p>Aucun projet ne correspond à votre recherche.</p>
            </div>
        )}
      </div>
    </main>
  );
}
