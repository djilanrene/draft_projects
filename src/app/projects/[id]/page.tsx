import { projects } from "@/app/lib/projects-data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Github, Globe } from "lucide-react";

const resourceIcons = {
  website: Globe,
  github: Github,
};

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    notFound();
  }

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="font-headline text-3xl font-bold tracking-tight mt-12 mb-4">{children}</h2>
  );

  const SectionParagraph = ({ children }: { children: React.ReactNode }) => (
    <p className="text-foreground/80 mb-4">{children}</p>
  );

  return (
    <div className="container mx-auto py-12 md:py-24 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
        <div className="md:col-span-3">
          <div className="space-y-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{project.category}</Badge>
              {project.software.map((s) => (
                <Badge key={s} variant="outline">
                  {s}
                </Badge>
              ))}
            </div>
            <p className="text-muted-foreground md:text-xl/relaxed">
              {project.description}
            </p>

            {project.resources && project.resources.length > 0 && (
              <div className="flex flex-wrap gap-4 pt-4">
                {project.resources.map((resource) => {
                  const Icon = resourceIcons[resource.type as keyof typeof resourceIcons];
                  return (
                    <Button key={resource.url} asChild variant="outline">
                      <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                        {Icon && <Icon className="mr-2 h-4 w-4" />}
                        {resource.label}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="md:col-span-2">
          <Card className="overflow-hidden rounded-xl shadow-lg">
            <CardContent className="p-0">
              <Image
                src={project.imageUrl}
                alt={project.title}
                data-ai-hint={project.imageHint}
                width={600}
                height={400}
                className="h-full w-full object-cover aspect-video"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-12" />

      <div className="max-w-4xl mx-auto">
        <section>
          <SectionTitle>Contexte du Projet</SectionTitle>
          <SectionParagraph>
            C'est ici que vous décrivez le problème initial ou l'opportunité. Quel était le besoin du client ou le point de départ de cette expérimentation ? Expliquez les objectifs principaux et les défis attendus.
          </SectionParagraph>
          <SectionParagraph>
            Exemple : Le client, une startup dans le secteur de la food-tech, souhaitait créer une application mobile pour faciliter la commande de repas sains. Le principal défi était de concevoir une expérience utilisateur simple et rapide, tout en proposant un large choix de personnalisation.
          </SectionParagraph>
        </section>
        
        <section>
          <SectionTitle>Processus de Conception</SectionTitle>
          <SectionParagraph>
            Décrivez les étapes de votre processus de conception. Avez-vous commencé par des recherches utilisateurs, des wireframes, des maquettes interactives ? Quels outils avez-vous utilisés (Figma, Sketch, etc.) ?
          </SectionParagraph>
          <SectionParagraph>
            Justifiez vos choix de conception. Pourquoi cette palette de couleurs, cette typographie, ou cette disposition ? Comment cela répond-il aux besoins de l'utilisateur final ?
          </SectionParagraph>
          
          {/* Vous pouvez ajouter des images de vos maquettes ici si vous le souhaitez */}
          {/* <Image src="/path/to/mockup.jpg" alt="Maquette du projet" width={800} height={600} className="rounded-lg my-6" /> */}

        </section>

        <section>
          <SectionTitle>Développement et Implémentation</SectionTitle>
          <SectionParagraph>
            Expliquez comment vous avez donné vie au projet. Quelles technologies avez-vous utilisées (React, Next.js, etc.) ? Avez-vous rencontré des défis techniques particuliers ?
          </SectionParagraph>
          <SectionParagraph>
            C'est l'occasion de mettre en avant vos compétences techniques. Mentionnez les librairies spécifiques, les API que vous avez intégrées, ou les optimisations de performance que vous avez mises en place.
          </SectionParagraph>
        </section>

        <section>
          <SectionTitle>Résultats et Apprentissages</SectionTitle>
          <SectionParagraph>
            Quel a été le résultat final ? Le projet a-t-il atteint ses objectifs ? Si possible, incluez des métriques de succès (augmentation de l'engagement, amélioration des conversions, etc.).
          </SectionParagraph>
          <SectionParagraph>
            Partagez également ce que vous avez appris au cours de ce projet. Chaque projet est une opportunité d'apprendre, que ce soit une nouvelle compétence technique, une meilleure compréhension d'un secteur d'activité, ou une nouvelle méthode de travail.
          </SectionParagraph>
        </section>
      </div>
    </div>
  );
}
