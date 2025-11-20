"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useAuth, useUser } from "@/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true); 
  const { toast } = useToast();
  const auth = useAuth();
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (user) {
    router.push('/admin');
    return null;
  }

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignUp) {
        // For the first user, we allow signup.
        // In a real scenario, you'd likely disable this after the first admin is created.
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: "Compte créé !",
          description: "Vous êtes maintenant connecté.",
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre backoffice.",
        });
      }
      router.push("/admin");
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Oh non ! Une erreur est survenue.",
        description: error.message || "Impossible de se connecter. Vérifiez vos identifiants.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Tabs defaultValue="signup" className="w-full max-w-md" onValueChange={(value) => setIsSignUp(value === 'signup')}>
        <TabsList className="grid w-full grid-cols-2">
          {/* We only show signup for the very first user setup. 
              In a real application, you might hide this tab entirely after the first user exists.
              For now, we'll keep it simple and just default to it.
          */}
          <TabsTrigger value="signup">Créer un compte</TabsTrigger>
          <TabsTrigger value="login">Se connecter</TabsTrigger>
        </TabsList>
        <form onSubmit={handleAuthAction}>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Création du compte administrateur</CardTitle>
                <CardDescription>
                  Créez le compte qui servira à gérer votre portfolio. Conservez ces identifiants précieusement.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input id="email-signup" type="email" placeholder="admin@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Mot de passe</Label>
                  <Input id="password-signup" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Créer le compte
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </form>
        <form onSubmit={handleAuthAction}>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Connexion</CardTitle>
                <CardDescription>
                  Accédez à votre espace d'administration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email</Label>
                  <Input id="email-login" type="email" placeholder="admin@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login">Mot de passe</Label>
                  <Input id="password-login" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Se connecter
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
}
