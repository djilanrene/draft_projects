"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { Article } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function ArticleCard({ article }: { article: Article }) {
  const publishedDate = article.publishedDate?.toDate();
  return (
    <Link href={`/blog/${article.id}`} className="block">
      <Card className="flex h-full flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        <CardContent className="p-0">
           <Image
              src={article.imageUrl}
              alt={article.title}
              data-ai-hint={article.imageHint}
              width={600}
              height={400}
              className="h-full w-full object-cover aspect-video"
            />
        </CardContent>
        <CardHeader>
          <CardTitle>{article.title}</CardTitle>
          <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
        </CardHeader>
        <CardFooter>
          {publishedDate && (
            <p className="text-sm text-muted-foreground">
              {format(publishedDate, "d MMMM yyyy", { locale: fr })}
            </p>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}


export default function BlogPage() {
  const firestore = useFirestore();

  const articlesQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "articles"), orderBy("publishedDate", "desc")) : null),
    [firestore]
  );
  const { data: articles, isLoading } = useCollection<Article>(articlesQuery);

  const Skeletons = () => (
    <>
      {[...Array(3)].map((_, i) => (
         <div key={i} className="flex flex-col gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </div>
      ))}
    </>
  );

  return (
    <div className="container mx-auto py-12 md:py-24 px-4 md:px-6">
      <div className="text-left mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Blog
        </h1>
        <p className="mt-4 max-w-[700px] text-muted-foreground md:text-xl">
          Réflexions, découvertes et expérimentations partagées.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <Skeletons />
        ) : (
          articles?.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        )}
      </div>

      {!isLoading && (!articles || articles.length === 0) && (
          <div className="mt-16 text-center text-muted-foreground col-span-full">
              <p>Aucun article publié pour le moment. Revenez bientôt !</p>
          </div>
      )}
    </div>
  );
}
