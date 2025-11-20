"use client";

import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Github, Globe } from "lucide-react";
import type { Project } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

// This is a simple markdown-to-html converter.
// For a real app, you might want to use a more robust library like 'marked' or 'react-markdown'.
function SimpleMarkdown({ content }: { content: string }) {
    const htmlContent = content
        .split('\n')
        .map(line => {
            if (line.startsWith('### ')) return `<h3>${line.substring(4)}</h3>`;
            if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`;
            if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`;
            if (line.trim() === '') return '<br />';
            return `<p>${line}</p>`;
        })
        .join('');

    return <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}


const resourceIcons = {
  website: Globe,
  github: Github,
};

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const projectRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "projects", params.id) : null),
    [firestore, params.id]
  );
  const { data: project, isLoading } = useDoc<Project>(projectRef);

  // Show a skeleton loader while the document is loading.
  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  // After loading is complete, if there's still no project, then it's a 404.
  if (!project) {
    notFound();
  }

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
              {project.excerpt}
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

      <div className="max-w-4xl mx-auto space-y-6 text-lg text-foreground/80">
        <SimpleMarkdown content={project.content} />
      </div>
    </div>
  );
}


function ProjectDetailSkeleton() {
  return (
    <div className="container mx-auto py-12 md:py-24 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
        <div className="md:col-span-3 space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
          <div className="flex flex-wrap gap-4 pt-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="md:col-span-2">
          <Skeleton className="aspect-video w-full rounded-xl" />
        </div>
      </div>
      <Separator className="my-12" />
      <div className="max-w-4xl mx-auto space-y-12">
        {[...Array(4)].map((_, i) => (
          <section key={i} className="space-y-4">
            <Skeleton className="h-9 w-1/2" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </section>
        ))}
      </div>
    </div>
  );
}
