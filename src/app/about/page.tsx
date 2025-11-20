"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { Profile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutPage() {
  const firestore = useFirestore();
  const profileRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "profile", "main") : null),
    [firestore]
  );
  const { data: profile, isLoading } = useDoc<Profile>(profileRef);

  if (isLoading) {
    return <AboutPageSkeleton />;
  }

  return (
    <div className="container mx-auto py-12 md:py-24 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        <div className="order-2 md:order-1 space-y-4">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            À Propos de Moi
          </h1>
          {profile ? (
            <>
              <p className="text-muted-foreground md:text-xl/relaxed">
                {profile.aboutText1}
              </p>
              <p className="text-foreground/80">
                {profile.aboutText2}
              </p>
              <p className="text-foreground/80">
                {profile.aboutText3}
              </p>
            </>
          ) : (
             <p className="text-muted-foreground md:text-xl/relaxed">
              Les informations du profil sont en cours de chargement...
            </p>
          )}
        </div>
        <div className="order-1 md:order-2">
          {profile && (
            <Card className="overflow-hidden rounded-xl shadow-lg">
              <CardContent className="p-0">
                <Image
                  src={profile.aboutImageUrl}
                  alt="À propos de moi"
                  data-ai-hint={profile.aboutImageHint}
                  width={600}
                  height={600}
                  className="h-full w-full object-cover aspect-square"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function AboutPageSkeleton() {
  return (
    <div className="container mx-auto py-12 md:py-24 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        <div className="order-2 md:order-1 space-y-4">
          <Skeleton className="h-14 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-full" />
        </div>
        <div className="order-1 md:order-2">
          <Skeleton className="w-[600px] h-[600px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
