import { projects } from "@/app/lib/projects-data";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 md:py-24 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
        <div className="md:col-span-3 space-y-6">
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
          <p className="text-foreground/80">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec
            fermentum aliquam, nunc nisl aliquet nisl, eget aliquam nisl nisl sit amet
            nisl. Sed euismod, nisl nec fermentum aliquam, nunc nisl aliquet nisl, eget
            aliquam nisl nisl sit amet nisl.
          </p>
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
    </div>
  );
}
