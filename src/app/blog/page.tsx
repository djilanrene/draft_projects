'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, where } from 'firebase/firestore';
import type { Article } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ArticleCard({ article }: { article: Article }) {
  const publishedDate = article.publishedDate?.toDate();
  return (
    <Link href={`/blog/${article.id}`} className="block">
      <Card className="flex h-full flex-col overflow-hidden opacity-0 animate-slide-fade-in-fast transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        <CardContent className="p-0">
          <Image
            src={
              article.imageUrl ||
              'https://placehold.co/600x400/27272a/94a3b8?text=Image'
            }
            alt={article.title}
            data-ai-hint={article.imageHint}
            width={600}
            height={400}
            className="h-full w-full object-cover aspect-video"
          />
        </CardContent>
        <CardHeader>
          <CardTitle>{article.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {article.excerpt}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          {publishedDate && (
            <p className="text-sm text-muted-foreground">
              {format(publishedDate, "d MMMM yyyy 'à' HH:mm", { locale: fr })}
            </p>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const firestore = useFirestore();

  const articlesQuery = useMemoFirebase(
    () =>
      firestore
        ? query(
            collection(firestore, 'articles'),
            orderBy('publishedDate', 'desc')
          )
        : null,
    [firestore]
  );
  const { data: articles, isLoading } = useCollection<Article>(articlesQuery);

  const publishedArticles = React.useMemo(() => {
    return articles?.filter((a) => a.published !== false) || [];
  }, [articles]);

  const filteredArticles = React.useMemo(() => {
    if (!publishedArticles) return [];
    if (!searchTerm) {
      return publishedArticles;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return publishedArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowercasedTerm) ||
        article.excerpt.toLowerCase().includes(lowercasedTerm) ||
        (article.tags &&
          article.tags.some((tag) =>
            tag.toLowerCase().includes(lowercasedTerm)
          ))
    );
  }, [searchTerm, publishedArticles]);

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
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-12">
        <div className="text-left mb-8 md:mb-0">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Blog
          </h1>
          <p className="mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            Réflexions, découvertes et expérimentations partagées.
          </p>
        </div>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par titre, contenu, ou tag..."
            className="w-full rounded-full bg-muted pl-10 pr-4 py-2 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {isLoading ? (
            <Skeletons />
          ) : (
            filteredArticles.map((article) => (
              <motion.div
                layout
                key={article.id}
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArticleCard article={article} />
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {!isLoading && filteredArticles.length === 0 && (
        <div className="mt-16 text-center text-muted-foreground col-span-full">
          <p>
            {searchTerm
              ? 'Aucun article ne correspond à votre recherche.'
              : 'Aucun article publié pour le moment. Revenez bientôt !'}
          </p>
        </div>
      )}
    </div>
  );
}
