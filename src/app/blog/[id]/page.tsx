"use client";

import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Article } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ArticlePage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const articleRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "articles", params.id) : null),
    [firestore, params.id]
  );
  const { data: article, isLoading } = useDoc<Article>(articleRef);

  if (isLoading) {
    return <ArticlePageSkeleton />;
  }

  if (!article) {
    notFound();
  }
  
  const publishedDate = article.publishedDate?.toDate();

  return (
    <article className="container mx-auto max-w-4xl py-12 md:py-24 px-4 md:px-6">
       <header className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4">
          {article.title}
        </h1>
        {publishedDate && (
            <p className="text-muted-foreground">
                Publié le {format(publishedDate, "d MMMM yyyy 'à' HH:mm", { locale: fr })}
            </p>
        )}
      </header>

      <div className="mb-12">
        <Image
          src={article.imageUrl}
          alt={article.title}
          data-ai-hint={article.imageHint}
          width={1200}
          height={630}
          className="w-full h-auto object-cover rounded-lg aspect-video"
          priority
        />
      </div>
      
      <div className="mx-auto">
        <MarkdownRenderer content={article.content} />
      </div>

      {article.tags && article.tags.length > 0 && (
        <footer className="mt-12">
          <Separator />
          <div className="pt-8 flex items-center gap-4">
            <h3 className="text-lg font-semibold">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        </footer>
      )}
    </article>
  );
}


function ArticlePageSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-24 px-4 md:px-6 animate-pulse">
      <header className="mb-12 text-center">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-5 w-48 mx-auto" />
      </header>

      <Skeleton className="w-full aspect-video rounded-lg mb-12" />

      <div className="space-y-6">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <br />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-1/2" />
      </div>

       <div className="mt-12">
          <Separator />
          <div className="pt-8 flex items-center gap-4">
             <Skeleton className="h-8 w-20" />
            <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
    </div>
  );
}
