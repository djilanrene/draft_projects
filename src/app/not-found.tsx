import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center space-y-8 text-center px-4">
      <div className="space-y-4">
        <h1 className="font-headline text-8xl font-bold tracking-tighter text-primary sm:text-9xl">
          404
        </h1>
        <p className="text-3xl font-semibold tracking-tight text-foreground">
          Page non trouvée
        </p>
        <p className="max-w-md text-muted-foreground">
          Désolé, nous n'avons pas trouvé la page que vous recherchez. Elle a peut-être été déplacée ou supprimée.
        </p>
      </div>
      <Button asChild>
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Link>
      </Button>
    </div>
  );
}
