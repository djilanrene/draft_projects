import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/app/lib/projects-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="flex h-full flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="aspect-video overflow-hidden rounded-lg border">
            <Image
              src={project.imageUrl}
              alt={project.title}
              data-ai-hint={project.imageHint}
              width={600}
              height={400}
              className="h-full w-full object-cover"
            />
          </div>
        </CardContent>
        <CardFooter className="flex-wrap gap-2 pt-4">
          <Badge variant="secondary">{project.category}</Badge>
          {project.software.map((s) => (
            <Badge key={s} variant="outline">{s}</Badge>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
}
