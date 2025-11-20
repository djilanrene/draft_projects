"use client";

import * as React from "react";
import { projects, categories, software as allSoftware } from "@/app/lib/projects-data";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [filteredProjects, setFilteredProjects] = React.useState(projects);
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedSoftware, setSelectedSoftware] = React.useState("all");

  React.useEffect(() => {
    let tempProjects = projects;
    
    if (selectedCategory !== "all") {
      tempProjects = tempProjects.filter(p => p.category === selectedCategory);
    }
    
    if (selectedSoftware !== "all") {
      tempProjects = tempProjects.filter(p => p.software.includes(selectedSoftware));
    }
    
    setFilteredProjects(tempProjects);
  }, [selectedCategory, selectedSoftware]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleSoftwareChange = (software: string) => {
    setSelectedSoftware(software);
  };

  return (
    <main className="container py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Découvrez Mes Projets
        </h1>
        <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
          Une sélection de mes travaux récents en design et développement.
        </p>
      </div>

      <div className="my-12 flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Catégorie:</span>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Logiciel:</span>
            <Select value={selectedSoftware} onValueChange={handleSoftwareChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    {allSoftware.map((sw) => (
                        <SelectItem key={sw} value={sw}>{sw}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <Button 
            variant="ghost" 
            onClick={() => {
                setSelectedCategory("all");
                setSelectedSoftware("all");
            }}>
            Réinitialiser
        </Button>
      </div>

      <AnimatePresence>
        <motion.div 
            layout 
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
          {filteredProjects.map((project) => (
            <motion.div layout key={project.id} animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      {filteredProjects.length === 0 && (
          <div className="mt-16 text-center text-muted-foreground">
              <p>Aucun projet ne correspond à votre sélection.</p>
          </div>
      )}
    </main>
  );
}
