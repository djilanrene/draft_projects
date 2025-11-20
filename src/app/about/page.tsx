import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  const profileImage = PlaceHolderImages.find((img) => img.id === 'profile');

  return (
    <div className="container max-w-5xl py-12 md:py-24">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            À Propos de Moi
          </h1>
          <p className="mt-4 text-muted-foreground md:text-xl/relaxed">
            Je suis un designer et développeur passionné avec un œil pour l'esthétique minimaliste et les expériences utilisateur intuitives.
          </p>
          <p className="mt-4 text-foreground/80">
            Avec plusieurs années d'expérience dans l'industrie, j'ai eu le plaisir de travailler sur une variété de projets, allant de l'identité de marque pour des startups émergentes à la conception d'interfaces complexes pour des applications à grande échelle. Ma philosophie est simple : créer des solutions belles, fonctionnelles et centrées sur l'humain.
          </p>
          <p className="mt-4 text-foreground/80">
            Quand je ne suis pas en train de concevoir, vous pouvez me trouver en train d'explorer de nouveaux cafés, de lire sur les dernières tendances technologiques ou de planifier ma prochaine aventure.
          </p>
        </div>
        <div className="order-1 md:order-2">
          {profileImage && (
            <Card className="overflow-hidden rounded-xl shadow-lg">
              <CardContent className="p-0">
                <Image
                  src={profileImage.imageUrl}
                  alt={profileImage.description}
                  data-ai-hint={profileImage.imageHint}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
