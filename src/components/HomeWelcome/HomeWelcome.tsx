import React from "react";
import { Button } from "@/components/ui/button";

interface HomeWelcomeProps {
  onNewFlow: () => void;
}

export default function HomeWelcome({ onNewFlow }: HomeWelcomeProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Bem vindo ao sistema de Flows
      </h1>
      <p className="text-lg text-muted-foreground text-center mb-8">
        Selecione ou Crie um Flow na barra há esquerda.
      </p>
      <Button onClick={onNewFlow} size="lg">
        Criar Novo Flow
      </Button>
    </div>
  );
} 