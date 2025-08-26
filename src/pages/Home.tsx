// Home Page - CBO Glass Explorer
import React, { useState, useEffect, useMemo } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { SearchInput } from '@/components/ui/search-input';
import { OccupationCard, OccupationCardSkeleton } from '@/components/cbo/occupation-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FormBuilder, { FormFieldConfig } from '@/components/common/form-builder';
import {
  useAutoComplete,
  useOccupationStats,
  useFrequentOccupations,
  useSearchOccupations
} from '@/hooks/use-cbo-queries';
import { TCBOOccupation, TCBOSearchParams, TCBOStats } from '@/types/cbo';
import heroImage from '@/assets/images/jpg/hero-cbo.jpg';
import {
  Search,
  TrendingUp,
  BarChart3,
  Briefcase,
  Users,
  Code2,
  BookOpen,
  Settings,
  Star,
  Activity,
  Zap,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { THttpResponseMultiSuccess, THttpResponseSingleSuccess } from '@/types/http';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { debounce, throttle } from '@/lib/utils';
import StatCard from '@/components/cbo/stats-card';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryInput, setSearchQueryInput] = useState('');
  const [searchParams, setSearchParams] = useState<TCBOSearchParams>({ label: '', perPage: 20 });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showAllOcc, setShowAllOcc] = useState(false)

  // Queries
  const { data: suggestions, isLoading: isLoadingSuggestions } = useAutoComplete(
    searchQuery,
    5
  );


  const { data: statistics } = useOccupationStats();

  const { data: popularOccupations, isLoading: isLoadingPopular } = useFrequentOccupations(10);

  const { data: searchResults, isLoading: isSearching, refetch: executeSearch } = useSearchOccupations(
    searchParams,
    !!searchParams.label || showAllOcc
  );

  useEffect(() => {
    setShowSearchResults(searchParams.label !== '' || showAllOcc);
    if (isSearching) setShowSearchResults(true);
  }, [searchParams, setShowSearchResults, isSearching])

  // Handle search
  const handleSearch = (query: string) => {
    if (query === 'all') {
      query = '';
      setShowAllOcc(true)
    } else {
      setShowAllOcc(false)
    }
    setSearchParams({ label: query, perPage: 20 });
    executeSearch();
  };

  const handleSearchAll = () => {
    handleSearch('all');
  };

  const handleClearSearchInput = () => {
    setSearchParams({ ...searchParams, label: '' });
  }

  const debouncedSetSearchQuery = useMemo(
    () => debounce((value: string) => setSearchQuery(value), 400),
    []
  );

  function handleChangeSearchQuery(value: string) {
    setSearchQueryInput(value);
    debouncedSetSearchQuery(value);
  }

  const handleOccupationClick = (occupation: any) => {
    const url = `/occupations/${occupation.id}`;
    window.location.href = url;
  };

  // Advanced search form fields
  const advancedSearchFields: FormFieldConfig[] = [
    {
      name: 'label',
      type: 'text',
      label: 'Termo de busca',
      placeholder: 'Pesquise pelo nome da ocupação...',
    },
    {
      name: 'id',
      type: 'text',
      label: 'Código específico',
      placeholder: 'Ex: 252105',
    },
    {
      name: 'level',
      type: 'select',
      label: 'Nível hierárquico',
      options: [
        { value: 'todos', label: 'Todos os níveis' },
        { value: '1', label: 'Nível 1 - Grande Grupo' },
        { value: '2', label: 'Nível 2 - Subgrupo Principal' },
        { value: '3', label: 'Nível 3 - Subgrupo' },
        { value: '4', label: 'Nível 4 - Família' },
        { value: '5', label: 'Nível 5 - Ocupação' },
      ],
    },
    {
      name: 'bigGroup',
      type: 'text',
      label: 'Grande Grupo',
      placeholder: 'Ex: Profissionais das ciências e intelectuais',
    },
  ];

  const handleRestForm = () => {
    setShowSearchResults(false);
  }

  const handleAdvancedSearch = (data: any) => {

    const cleanParams = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '' && value !== 'todos' && value !== 'Selecione...')
    );
    setSearchParams({ ...cleanParams, perPage: 20 });
    executeSearch();
  };

  const handlePaginate = (page: number) => {
    setSearchParams({ ...searchParams, page });
    executeSearch();
  }

  const handleGotoDocs = (e) => {
    e.preventDefault()
    const url = "/docs"
    window.location.href = url
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="CBO Glass Explorer - Interface moderna para consulta de ocupações"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Title */}
            <div className="space-y-4 animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  CBO Glass
                </span>
                <br />
                <span className="text-foreground">Explorer</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Sistema moderno para consulta e exploração da{' '}
                <span className="text-primary font-semibold">
                  Classificação Brasileira de Ocupações
                </span>
              </p>
            </div>

            {/* Search */}
            <div className="max-w-2xl mx-auto animate-slide-up">
              <SearchInput
                value={searchQueryInput}
                onChange={handleChangeSearchQuery}
                onSearch={handleSearch}
                onSelect={handleSearch}
                suggestions={suggestions && (suggestions as THttpResponseMultiSuccess<TCBOOccupation>).data.map((occ) => occ.label) || []}
                isLoading={isLoadingSuggestions}
                placeholder="Busque por profissão, código ou área de atuação..."
                className="w-full"
                onClear={handleClearSearchInput}
                autoFocus
              />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-3 animate-slide-up">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="glass border-glass-border hover:bg-glass-bg/80"
              >
                <Search className="h-4 w-4 mr-2" />
                Busca Avançada
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="glass border-glass-border hover:bg-glass-bg/80"
                onClick={() => window.location.href = "#occupationStats"}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Estatísticas
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="glass border-glass-border hover:bg-glass-bg/80"
                onClick={handleGotoDocs}
              >
                <BookOpen
                  className="h-4 w-4 mr-2"
                />
                API Docs
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Advanced Search */}
        {showAdvancedSearch && (
          <section className="animate-fade-in">
            <GlassCard variant="elevated" size="lg">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Zap className="h-6 w-6 text-primary" />
                    Busca Avançada
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvancedSearch(false)}
                  >
                    Fechar
                  </Button>
                </div>
                <FormBuilder
                  fields={advancedSearchFields}
                  onSubmit={handleAdvancedSearch}
                  submitText="Buscar"
                  onReset={handleRestForm}
                  isLoading={isSearching}
                  variant="glass"
                  fieldClassName="grid md:grid-cols-2 gap-4"
                />
              </div>
            </GlassCard>
          </section>
        )}

        {/* Search Results */}
        {isSearching && (
          <section className="animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground" id='searchResultsSkeleton'>
                  Resultados da Busca
                </h2>
                <Badge variant="outline" className="text-sm">
                  0 ocupações encontradas
                </Badge>
              </div>
              <div className="grid grid-rows-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: searchParams.perPage || 20 }).map((_, i) => (
                  <OccupationCardSkeleton
                    key={i}
                    variant='detailed'
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Search Results */}
        {(showSearchResults && searchResults) && !isSearching && (
          <section className="animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground" id='searchResults'>
                  Resultados da Busca
                </h2>
                <Badge variant="outline" className="text-sm">
                  {(searchResults as THttpResponseMultiSuccess<TCBOOccupation>).pagination.totalItems} ocupações encontradas
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(searchResults as THttpResponseMultiSuccess<TCBOOccupation>).data.map((occupation) => (
                  <OccupationCard
                    key={occupation.id}
                    occupation={occupation}
                    onClick={handleOccupationClick}
                    variant="detailed"
                  />
                ))}
              </div>
              <div>
                {(() => {
                  const { page, totalPages } = (searchResults as THttpResponseMultiSuccess<TCBOOccupation>).pagination;
                  const maxVisible = 10;
                  const pages: (number | 'ellipsis')[] = [];

                  let start = Math.max(1, page - Math.floor(maxVisible / 2));
                  let end = (start + maxVisible - 1) > totalPages ? totalPages : (start + maxVisible - 1);


                  if (page >= totalPages) {
                    end = totalPages
                    start = Math.max(1, end - maxVisible + 1)
                  }

                  if (start > 1) {
                    pages.push(1)
                    if (start > 2) pages.push("ellipsis")
                  }

                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }

                  if (end < totalPages) {
                    if (end < totalPages - 1) pages.push("ellipsis");
                    pages.push(totalPages)
                  }

                  return (
                    <Pagination>
                      <PaginationContent>

                        {page > 1 && (
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => handlePaginate(1)}
                              aria-label='Primeira Página'
                              href='#searchResults'
                              style={{
                                cursor: 'pointer'
                              }}
                            >
                              <ChevronsLeft className="h-4 w-4" />
                            </PaginationLink>
                          </PaginationItem>
                        )}

                        {page > 1 && (
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => handlePaginate(page - 1)}
                              style={{
                                cursor: 'pointer'
                              }}
                              href='#searchResults'
                            />
                          </PaginationItem>
                        )}

                        {pages.map((p, idx) =>
                          p === 'ellipsis' ? (
                            <PaginationItem key={`ellipsis-${idx}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={p}>
                              <PaginationLink
                                isActive={page === p}
                                onClick={() => handlePaginate(p)}
                                href='#searchResults'
                              >
                                {p}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        )}

                        {page < totalPages && (
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => handlePaginate(page + 1)}
                              style={{
                                cursor: "pointer"
                              }}
                              href='#searchResults'
                            />
                          </PaginationItem>
                        )}

                        {page < totalPages && (
                          <PaginationItem>
                            <PaginationLink
                              aria-label='Última página'
                              onClick={() => handlePaginate(totalPages)}
                              href='#searchResults'
                            >
                              <ChevronsRight className="h-4 w-4" />
                            </PaginationLink>
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  )
                })()}
              </div>
            </div>
          </section>
        )}

        {/* Statistics */}
        {statistics && (
          <section>
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground" id='occupationStats'>
                  Estatísticas da CBO
                </h2>
                <p className="text-muted-foreground">
                  Visão geral da estrutura da Classificação Brasileira de Ocupações
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard
                  icon={Briefcase}
                  title="Ocupações"
                  value={Number((statistics as THttpResponseSingleSuccess<TCBOStats>).data.totalOccupations.toLocaleString('pt-BR'))}
                  subtitle="Total cadastradas"
                />
                <StatCard
                  icon={Users}
                  title="Grandes Grupos"
                  value={Number((statistics as THttpResponseSingleSuccess<TCBOStats>).data.totalBigGroups.toLocaleString('pt-BR'))}
                  subtitle="Categorias principais"
                />
                <StatCard
                  icon={Settings}
                  title="Sub. Principais"
                  value={Number((statistics as THttpResponseSingleSuccess<TCBOStats>).data.totalMainSubGroups.toLocaleString('pt-BR'))}
                  subtitle="Subdivisões"
                />
                <StatCard
                  icon={Code2}
                  title="Subgrupos"
                  value={Number((statistics as THttpResponseSingleSuccess<TCBOStats>).data.totalSubGroups.toLocaleString('pt-BR'))}
                  subtitle="Especializações"
                />
                <StatCard
                  icon={BookOpen}
                  title="Famílias"
                  value={Number((statistics as THttpResponseSingleSuccess<TCBOStats>).data.totalFamily.toLocaleString('pt-BR'))}
                  subtitle="Níveis finais"
                />
              </div>
            </div>
          </section>
        )}

        {/* Popular Occupations */}

        {isLoadingPopular && (
          <section className="animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2" id='popularOcuppationsSkeleton'>
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Ocupações Mais Consultadas
                </h2>
                <Button
                  variant="outline" size="sm"
                  onClick={() => { }}
                  disabled
                >
                  Ver todas
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: searchParams.perPage || 20 }).map((_, i) => (
                  <OccupationCardSkeleton
                    key={i}
                    variant='default'
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {(popularOccupations && !isLoadingPopular) && (popularOccupations as THttpResponseMultiSuccess<TCBOOccupation>).data.length > 0 && (
          <section className="animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2" id='popularOcuppations'>
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Ocupações Mais Consultadas
                </h2>
                <Button
                  variant="outline" size="sm"
                  onClick={handleSearchAll}
                >
                  Ver todas
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(popularOccupations as THttpResponseMultiSuccess<TCBOOccupation>).data.map((occupation) => (
                  <OccupationCard
                    key={occupation.id}
                    occupation={occupation}
                    onClick={handleOccupationClick}
                    variant="default"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features */}
        <section>
          <div className="text-center space-y-12">
            <div className="space-y-4 cursor-default">
              <h2 className="text-3xl font-bold text-foreground">
                Explore a CBO de forma moderna
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Interface elegante com tecnologia liquid glass para uma experiência única
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <GlassCard variant="elevated" className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2 cursor-default">
                  <h3 className="text-xl font-semibold text-foreground">
                    Busca Inteligente
                  </h3>
                  <p className="text-muted-foreground">
                    Encontre ocupações por nome, código ou área de atuação com sugestões automáticas
                  </p>
                </div>
              </GlassCard>

              <GlassCard variant="elevated" className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-secondary flex items-center justify-center">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2 cursor-default">
                  <h3 className="text-xl font-semibold text-foreground">
                    Navegação Hierárquica
                  </h3>
                  <p className="text-muted-foreground">
                    Explore a estrutura da CBO de forma intuitiva, do geral para o específico
                  </p>
                </div>
              </GlassCard>

              <GlassCard variant="elevated" className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2 cursor-default">
                  <h3 className="text-xl font-semibold text-foreground">
                    Interface Moderna
                  </h3>
                  <p className="text-muted-foreground">
                    Design elegante com efeitos liquid glass e animações suaves
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;