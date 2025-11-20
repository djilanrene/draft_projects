"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCollection, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import type { Project, Article, SocialLink, Profile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function StatCard({ title, description, value, isLoading }: { title: string, description: string, value: string | number, isLoading: boolean }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                ) : (
                    <div className="text-4xl font-bold">{value}</div>
                )}
            </CardContent>
        </Card>
    );
}

function StatCardDate({ title, description, date, isLoading }: { title: string, description: string, date: Date | undefined, isLoading: boolean }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-6 w-32" />
                ) : date ? (
                    <div className="text-xl font-semibold">{format(date, "d MMMM yyyy 'à' HH:mm", { locale: fr })}</div>
                ) : (
                     <div className="text-xl font-semibold text-muted-foreground">Jamais modifié</div>
                )}
            </CardContent>
        </Card>
    );
}


export default function AdminDashboard() {
  const firestore = useFirestore();

  const projectsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, "projects") : null),
    [firestore]
  );
  const { data: projects, isLoading: isLoadingProjects } = useCollection<Project>(projectsQuery);

  const articlesQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, "articles") : null),
    [firestore]
  );
  const { data: articles, isLoading: isLoadingArticles } = useCollection<Article>(articlesQuery);

  const socialLinksQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, "social_links") : null),
    [firestore]
  );
  const { data: socialLinks, isLoading: isLoadingSocialLinks } = useCollection<SocialLink>(socialLinksQuery);
  
  const profileRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "profile", "main") : null),
    [firestore]
  );
  const { data: profile, isLoading: isLoadingProfile } = useDoc<Profile>(profileRef);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue dans l'espace d'administration de votre portfolio.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            title="Projets"
            description="Nombre total de projets"
            value={projects?.length ?? 0}
            isLoading={isLoadingProjects}
        />
         <StatCard 
            title="Articles"
            description="Nombre total d'articles"
            value={articles?.length ?? 0}
            isLoading={isLoadingArticles}
        />
        <StatCard
            title="Réseaux Sociaux"
            description="Nombre de liens"
            value={socialLinks?.length ?? 0}
            isLoading={isLoadingSocialLinks}
        />
        <StatCardDate
            title="Profil"
            description="Dernière modification"
            date={profile?.updatedAt?.toDate()}
            isLoading={isLoadingProfile}
        />
      </div>
       <div className="pt-8">
        <Card>
            <CardHeader>
                <CardTitle>Bienvenue !</CardTitle>
                <CardDescription>Comment utiliser votre backoffice.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>Ce tableau de bord vous donne un contrôle total sur le contenu de votre portfolio. Utilisez le menu latéral pour :</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Gérer vos <span className="font-semibold text-foreground">Projets</span> : ajoutez, modifiez et supprimez les réalisations que vous souhaitez présenter.</li>
                    <li>Rédiger des <span className="font-semibold text-foreground">Articles</span> : partagez vos connaissances et vos expériences.</li>
                    <li>Mettre à jour votre <span className="font-semibold text-foreground">Profil</span> : changez votre biographie et vos photos à tout moment.</li>
                     <li>Administrer vos <span className="font-semibold text-foreground">Réseaux Sociaux</span> : gardez vos liens de contact à jour.</li>
                </ul>
                <p>Toutes les modifications sont sauvegardées en temps réel et visibles instantanément sur votre site public.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
