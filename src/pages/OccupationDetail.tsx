// Occupation Detail Page - CBO Glass Explorer
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOccupation } from '@/hooks/use-cbo-queries';
import {
  ArrowLeft,
  Briefcase,
  BookOpen,
  Users,
  Settings,
  GraduationCap,
  ClipboardList,
  Target,
  MapPin,
  Award,
  FileText,
  Share2,
  Star,
  Download,
  Dices
} from 'lucide-react';
import { THttpResponseSingleSuccess } from '@/types/http';
import { TCBOOccupation } from '@/types/cbo';

const OccupationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const { data, isLoading, error } = useOccupation(Number(id) || 0, !!Number(id));

  let occupation = data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="text-center space-y-4">
          <div className="animate-pulse space-y-2">
            <div className="h-8 bg-muted rounded w-48 mx-auto" />
            <div className="h-4 bg-muted rounded w-32 mx-auto" />
          </div>
          <p className="text-muted-foreground">Carregando ocupação...</p>
        </GlassCard>
      </div>
    );
  }

  if (error || occupation.success === false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <FileText className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Ocupação não encontrada</h2>
            <p className="text-muted-foreground">
              A ocupação com código "{id}" não foi encontrada.
            </p>
          </div>
          <Button onClick={() => navigate('/')} className="bg-gradient-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Button>
        </GlassCard>
      </div>
    );
  }

  const getIconByLevel = (nivel: number) => {
    switch (nivel) {
      case 1: return Users;
      case 2: return Briefcase;
      case 3: return Settings;
      case 4: return BookOpen;
      case 5: return Target;
      default: return Briefcase;
    }
  };

  occupation = occupation as THttpResponseSingleSuccess<TCBOOccupation>;

  const Icon = getIconByLevel(occupation.data.level);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/20 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="hover:bg-glass-bg/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="glass">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button variant="outline" size="sm" className="glass">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Title Section */}
        <GlassCard variant="elevated" size="lg">
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 p-4 rounded-2xl bg-gradient-primary">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-foreground leading-tight">
                    {occupation.data.label}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className="text-sm">
                      Código: {occupation.data.id}
                    </Badge>
                    <Badge variant="secondary" className="text-sm">
                      Nível {occupation.data.level}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      <Star className="h-3 w-3 mr-1" />
                      Favoritar
                    </Badge>
                  </div>
                </div>
                {occupation.data.description && (
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {occupation.data.description}
                  </p>
                )}
              </div>
            </div>

            {/* Hierarchy Breadcrumb */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Hierarquia
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {occupation.data.hierarchy.big_group && (
                  <>
                    <span className="text-foreground font-medium">
                      {occupation.data.hierarchy.big_group}
                    </span>
                    {occupation.data.hierarchy.sub_group && <span className="text-muted-foreground">→</span>}
                  </>
                )}
                {occupation.data.hierarchy.main_sub_group && (
                  <>
                    <span className="text-foreground font-medium">
                      {occupation.data.hierarchy.main_sub_group}
                    </span>
                    {occupation.data.hierarchy.family && <span className="text-muted-foreground">→</span>}
                  </>
                )}
                {occupation.data.hierarchy.sub_group && (
                  <>
                    <span className="text-foreground font-medium">
                      {occupation.data.hierarchy.sub_group}
                    </span>
                    {occupation.data.hierarchy.main_sub_group && <span className="text-muted-foreground">→</span>}
                  </>
                )}
                {occupation.data.hierarchy.family && (
                  <>
                    <span className="text-primary font-medium">
                      {occupation.data.hierarchy.family}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-auto p-1">
          <TabsList className="glass border-glass-border bg-glass-bg backdrop-blur-md">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Target className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="activities" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ClipboardList className="h-4 w-4 mr-2" />
              Atividades
            </TabsTrigger>
            <TabsTrigger value="competencies" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Award className="h-4 w-4 mr-2" />
              Competências
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <GraduationCap className="h-4 w-4 mr-2" />
              Formação
            </TabsTrigger>
            <TabsTrigger value="synonymous" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Dices className="h-4 w-4 mr-2" />
              Sinônimos
            </TabsTrigger>
          </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <GlassCard>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Condições de Trabalho
                  </h3>
                  {occupation.data.work_conditions && occupation.data.work_conditions.length > 0 ? (
                    <ul className="space-y-2">
                      {occupation.data.work_conditions.map((condicao, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {condicao}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Informações sobre condições de trabalho não disponíveis.
                    </p>
                  )}
                </div>
              </GlassCard>

              <GlassCard>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Recursos de Trabalho
                  </h3>
                  {occupation.data.work_resources && occupation.data.work_resources.length > 0 ? (
                    <ul className="space-y-2">
                      {occupation.data.work_resources.map((recurso, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                          {recurso}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Informações sobre recursos de trabalho não disponíveis.
                    </p>
                  )}
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <GlassCard>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Principais Atividades
                </h3>
                {occupation.data.activities && occupation.data.activities.length > 0 ? (
                  <div className="space-y-3">
                    {occupation.data.activities.map((atividade, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center justify-center">
                          {index + 1}
                        </span>
                        <p className="text-sm text-foreground">{atividade}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Não há atividades específicas cadastradas para esta ocupação.
                  </p>
                )}
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="competencies" className="space-y-6">
            <GlassCard>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Competências Requeridas
                </h3>
                {occupation.data.competencies && occupation.data.competencies.length > 0 ? (
                  <div className="grid gap-3">
                    {occupation.data.competencies.map((competencia, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                        <Award className="h-4 w-4 text-primary flex-shrink-0" />
                        <p className="text-sm text-foreground">{competencia}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Não há competências específicas cadastradas para esta ocupação.
                  </p>
                )}
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <GlassCard>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Formação e Especialização
                </h3>
                {occupation.data.academy && occupation.data.academy.length > 0 ? (
                  <div className="space-y-3">
                    {occupation.data.academy.map((formacao, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                        <GraduationCap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-foreground">{formacao}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Não há requisitos de formação específicos cadastrados para esta ocupação.
                  </p>
                )}
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="synonymous" className="space-y-6">
            <GlassCard>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Sinônimos
                </h3>
                {occupation.data.synonymous && occupation.data.synonymous.length > 0 ? (
                  <div className="space-y-3">
                    {occupation.data.synonymous.map((synon, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                        <Dices className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-foreground">{synon}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Não há Sinônimos cadastrados para esta ocupação.
                  </p>
                )}
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OccupationDetail;