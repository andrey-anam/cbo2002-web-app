import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Search, FileText, Layers, Users, Tag, BarChart3, UserCheck, ExternalLink, X, Play } from 'lucide-react';
import TryOutPanel from '@/components/cbo/try-out-pannel';

const CBOApiDocs = () => {
  const [swaggerData, setSwaggerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPaths, setExpandedPaths] = useState({});
  const [expandedSchemas, setExpandedSchemas] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // --- Try Out ---
  const [tryOutOpen, setTryOutOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [requestParams, setRequestParams] = useState({});
  const [responseData, setResponseData] = useState(null);
  const [loadingRequest, setLoadingRequest] = useState(false);


  useEffect(() => {
    const fetchSwaggerData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL ||'https://cbo2002.analiseops.com.br'}/api/docs.json`, {
          headers: {
            "Cache-Control": "no-store",
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error('Falha ao carregar documentação');
        }
        const data = await response.json();
        return data
      } catch (err) {
        return err
      }
    };

    fetchSwaggerData()
      .then((data) => setSwaggerData(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [setSwaggerData, setError, setLoading]);

  const togglePath = (path) => {
    setExpandedPaths(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const toggleSchema = (schema) => {
    setExpandedSchemas(prev => ({
      ...prev,
      [schema]: !prev[schema]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="glass-card p-8 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-foreground/80">Carregando documentação...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-destructive" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-destructive mb-2">Erro ao carregar</h2>
          <p className="text-foreground/80">{error}</p>
        </div>
      </div>
    );
  }

  if (!swaggerData) {
    return null;
  }

  const { info, paths, components, servers } = swaggerData;

  // Filtrar paths com base no termo de pesquisa
  const filteredPaths = Object.entries(paths).filter(([path]) =>
    Object.entries(paths[path]).some(([_method, details]: [_method: string, details: any]) => details.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
    path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Object.values(paths[path]).some((method: any) =>
      (method.summary && method.summary.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  // Filtrar schemas com base no termo de pesquisa
  const filteredSchemas = Object.entries(components.schemas).filter(([schemaName]) =>
    schemaName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="glass border-b border-glass-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center space-x-4"
              role='button'
              onClick={() => window.location.href = "/"}

            >
              <div
                className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center glow"
              >
                <Layers size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{info.title}</h1>
                <p className="text-foreground/80 text-sm">{info.version}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-foreground/60" />
                </div>
                <input
                  type="text"
                  placeholder="Pesquisar endpoints, schemas..."
                  className="glass pl-10 pr-4 py-2 rounded-lg w-80 focus:ring-2 focus:ring-primary/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <div className="glass px-4 py-2 rounded-lg">
                <span className="text-sm text-foreground/80">Base URL: {servers[0].url}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="glass-card mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-32 translate-x-32 pulse-glow"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full translate-y-24 -translate-x-24 pulse-glow"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              {info.title}
            </h1>
            <p className="text-xl text-foreground/80 mb-6 max-w-3xl">
              {info.description}
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 glass px-4 py-2 rounded-lg">
                <BarChart3 size={18} />
                <span>API RESTful</span>
              </div>
              <div className="flex items-center space-x-2 glass px-4 py-2 rounded-lg">
                <FileText size={18} />
                <span>OpenAPI 3.0.0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card sticky top-24">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Layers size={18} className="mr-2" />
                Navegação
              </h2>
              <nav className="space-y-2">
                <a href="#endpoints" className="flex items-center py-2 px-3 rounded-lg hover:bg-glass-highlight transition-colors">
                  <ChevronRight size={16} className="mr-2" />
                  Endpoints
                </a>
                <a href="#schemas" className="flex items-center py-2 px-3 rounded-lg hover:bg-glass-highlight transition-colors">
                  <ChevronRight size={16} className="mr-2" />
                  Schemas
                </a>
                <a href="#parameters" className="flex items-center py-2 px-3 rounded-lg hover:bg-glass-highlight transition-colors">
                  <ChevronRight size={16} className="mr-2" />
                  Parameters
                </a>
              </nav>

              <h3 className="text-md font-semibold mt-6 mb-3 flex items-center">
                <Users size={16} className="mr-2" />
                Categorias
              </h3>
              <div className="space-y-1">
                {['Grande Grupo', 'Família', 'Sub Grupo', 'Sub Grupo Principal', 'Ocupação', 'Sinônimo', 'Estatísticas', 'Perfil Ocupacional'].map(tag => (
                  <button
                    key={tag}
                    className="w-full text-left py-1 px-3 rounded-lg text-sm hover:bg-glass-highlight transition-colors"
                    onClick={() => setSearchTerm(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Endpoints Section */}
            <section id="endpoints" className="glass-card">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FileText size={24} className="mr-2 text-primary" />
                Endpoints da API
              </h2>

              <div className="space-y-4">
                {filteredPaths.map(([path, methods]) => (
                  <div key={path} className="glass rounded-xl overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-4 bg-glass-highlight hover:bg-glass-border transition-colors"
                      onClick={() => togglePath(path)}
                    >
                      <div className="flex items-center space-x-3">
                        {expandedPaths[path] ? (
                          <ChevronDown size={20} className="text-primary" />
                        ) : (
                          <ChevronRight size={20} className="text-foreground/60" />
                        )}
                        <span className="font-mono text-lg">{path}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {Object.keys(methods).map(method => (
                          <span
                            key={method}
                            className={`px-2 py-1 rounded text-xs font-semibold ${method === 'get' ? 'bg-green-500/20 text-green-400' :
                              method === 'post' ? 'bg-blue-500/20 text-blue-400' :
                                method === 'put' ? 'bg-yellow-500/20 text-yellow-400' :
                                  method === 'delete' ? 'bg-red-500/20 text-red-400' :
                                    'bg-gray-500/20 text-gray-400'
                              }`}
                          >
                            {method.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </button>

                    {expandedPaths[path] && (
                      <div className="p-4 space-y-4">
                        {Object.entries(methods).map(([method, details]) => (


                          <div key={method} className="glass rounded-lg p-4">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mr-3 ${method === 'get' ? 'bg-green-500/20 text-green-400' :
                                  method === 'post' ? 'bg-blue-500/20 text-blue-400' :
                                    method === 'put' ? 'bg-yellow-500/20 text-yellow-400' :
                                      method === 'delete' ? 'bg-red-500/20 text-red-400' :
                                        'bg-gray-500/20 text-gray-400'
                                  }`}>
                                  {method.toUpperCase()}
                                </span>
                                <h3 className="inline-block text-lg font-semibold">
                                  {details.summary}
                                </h3>
                              </div>
                              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                                {details.tags?.[0] || 'Geral'}
                              </span>
                            </div>

                            <p className="text-foreground/80 mb-4">{details.description}</p>

                            {details.parameters && details.parameters.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold mb-2">Parâmetros:</h4>
                                <div className="space-y-2">
                                  {details.parameters.map((param: Record<string, any>, idx: number) => {

                                    let isRef = param.hasOwnProperty("$ref");

                                    if (isRef) {
                                      param = components.parameters[param.$ref.replace('#/components/parameters/', '').trim()]
                                      let isRefSchema = (param.schema as Record<string, any>).hasOwnProperty("$ref");
                                      if (isRefSchema) {
                                        param.schema = components.schemas[param.schema.$ref.replace('#/components/schemas/', '').trim()]
                                      }
                                    }

                                    return (
                                      <div key={idx} className="flex items-center text-sm">
                                        <span className="font-mono bg-muted px-2 py-1 rounded mr-2">
                                          {param.name}
                                        </span>
                                        <span className="text-foreground/60">
                                          {param.in} • {param.schema?.type || 'string'}
                                          {param.required && ' • obrigatório'}
                                        </span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            {details.responses && (
                              <div>
                                <h4 className="font-semibold mb-2">Respostas:</h4>
                                <div className="space-y-2">
                                  {Object.entries(details.responses).map(([code, response]: [code: string, response: any]) => (
                                    <div key={code} className="flex items-start">
                                      <span className={`px-2 py-1 rounded text-xs font-semibold mr-3 mt-1 ${code.startsWith('2') ? 'bg-green-500/20 text-green-400' :
                                        code.startsWith('4') ? 'bg-yellow-500/20 text-yellow-400' :
                                          code.startsWith('5') ? 'bg-red-500/20 text-red-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {code}
                                      </span>
                                      <div>
                                        <p className="text-sm font-medium">{response.description}</p>
                                        {response.content && (
                                          <div className="mt-1 text-xs text-foreground/60">
                                            Content-type: {Object.keys(response.content).join(', ')}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {expandedPaths[path] && (
                      <div className="p-4 space-y-4">
                        {Object.entries(methods).map(([method, details]) => (
                          <div key={method} className="glass rounded-lg p-4">
                            <div className="flex items-start justify-between mb-4">
                              {/* ... conteúdo existente ... */}
                            </div>

                            {/* Botão Try It Out */}
                            <div className="mb-4">
                              <button
                                onClick={() => {
                                  setSelectedEndpoint({
                                    path,
                                    methods: [{ method, ...details }],
                                    components
                                  });
                                  setRequestParams({});
                                  setResponseData(null);
                                  setTryOutOpen(true);
                                }}
                                className="bg-gradient-primary text-white px-4 py-2 rounded-lg hover:shadow-glow transition-all flex items-center"
                              >
                                <Play size={16} className="mr-2" />
                                Try it out
                              </button>
                            </div>

                            {/* ... resto do conteúdo do endpoint ... */}
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </section>

            {/* Schemas Section */}
            <section id="schemas" className="glass-card">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Tag size={24} className="mr-2 text-secondary" />
                Esquemas de Dados
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSchemas.map(([schemaName, schema]: [schemaName: string, schema: any]) => (
                  <div key={schemaName} className="glass rounded-xl overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-4 bg-glass-highlight hover:bg-glass-border transition-colors"
                      onClick={() => toggleSchema(schemaName)}
                    >
                      <div className="flex items-center space-x-3">
                        {expandedSchemas[schemaName] ? (
                          <ChevronDown size={20} className="text-secondary" />
                        ) : (
                          <ChevronRight size={20} className="text-foreground/60" />
                        )}
                        <span className="font-semibold">{schemaName}</span>
                      </div>
                      <span className="text-xs text-foreground/60 bg-muted px-2 py-1 rounded">
                        {schema.type}
                      </span>
                    </button>

                    {expandedSchemas[schemaName] && (
                      <div className="p-4">
                        {schema.description && (
                          <p className="text-foreground/80 mb-4 text-sm">{schema.description}</p>
                        )}

                        {schema.properties && (
                          <div>
                            <h4 className="font-semibold mb-2 text-sm">Propriedades:</h4>
                            <div className="space-y-2">
                              {Object.entries(schema.properties).map(([propName, prop]: [propName: string, prop: any]) => (
                                <div key={propName} className="flex justify-between items-start text-sm">
                                  <div>
                                    <span className="font-mono text-primary">{propName}</span>
                                    {schema.required?.includes(propName) && (
                                      <span className="text-red-400 text-xs ml-2">obrigatório</span>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <span className="text-foreground/60">{prop.type}</span>
                                    {prop.example && (
                                      <span className="text-foreground/40 text-xs block">ex: {prop.example}</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Parameters Section */}
            <section id="parameters" className="glass-card">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <UserCheck size={24} className="mr-2 text-accent" />
                Parâmetros
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {components.parameters && Object.entries(components.parameters).map(([paramName, param]: [paramName: string, param: any]) => (
                  <div key={paramName} className="glass rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold font-mono">{param.name}</h3>
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                        {param.in}
                      </span>
                    </div>

                    <p className="text-sm text-foreground/80 mb-3">{param.description}</p>

                    <div className="text-xs text-foreground/60">
                      <span className="bg-muted px-2 py-1 rounded mr-2">Tipo: {param.schema?.type}</span>
                      {param.required && (
                        <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded">Obrigatório</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>


      {tryOutOpen && (
        <TryOutPanel
          endpoint={selectedEndpoint}
          onClose={() => {
            setTryOutOpen(false);
            setSelectedEndpoint(null);
            setRequestParams({});
            setResponseData(null);
          }}
          requestParams={requestParams}
          onParamChange={setRequestParams}
          responseData={responseData}
          onExecute={async () => {
            setLoadingRequest(true);
            try {
              // Construir URL com parâmetros
              let url = `${import.meta.env.VITE_API_URL || "https://cbo2002.analiseops.com.br"}${servers[0].url}${selectedEndpoint.path}`;

              // Substituir parâmetros de path
              Object.entries(requestParams).forEach(([key, value]: [key: string, value: any]) => {
                if (selectedEndpoint.methods[0].parameters.find((p: any) => {
                  let isRef = p.hasOwnProperty("$ref");
                  if (isRef) {
                    p = components.parameters[p.$ref.replace('#/components/parameters/', '').trim()]
                    let isRefSchema = (p.schema as Record<string, any>).hasOwnProperty("$ref");
                    if (isRefSchema) {
                      p.schema = components.schemas[p.schema.$ref.replace('#/components/schemas/', '').trim()]
                    }
                  }

                  return p.in === 'path' && p.name === key
                })) {
                  url = url.replace(`{${key}}`, encodeURIComponent(value));
                }
              });

              // Adicionar parâmetros de query
              const queryParams = Object.entries(requestParams)
                .filter(([key]) => selectedEndpoint.methods[0].parameters.find((p: any) => {
                  let isRef = p.hasOwnProperty("$ref");
                  if (isRef) {
                    p = components.parameters[p.$ref.replace('#/components/parameters/', '').trim()]
                    let isRefSchema = (p.schema as Record<string, any>).hasOwnProperty("$ref");
                    if (isRefSchema) {
                      p.schema = components.schemas[p.schema.$ref.replace('#/components/schemas/', '').trim()]
                    }
                  }

                  return p.in === 'query' && p.name === key
                }))
                .map(([key, value]: [keyof: string, value: any]) => `${key}=${encodeURIComponent(value)}`)
                .join('&');

              console.log(queryParams);

              if (queryParams) {
                url += `?${queryParams}`;
              }

              // Fazer a requisição
              const response = await fetch(url, {
                method: selectedEndpoint.methods[0].method.toUpperCase(),
                headers: {
                  'Content-Type': 'application/json',
                  "Cache-Control": "no-store"
                },
              });

              const data = await response.json();
              setResponseData({
                status: response.status,
                statusText: response.statusText,
                data,
                headers: Object.fromEntries([...response.headers.entries()])
              });
            } catch (error) {
              setResponseData({
                error: error.message,
                status: 0,
                statusText: 'Error'
              });
            } finally {
              setLoadingRequest(false);
            }
          }}
          loading={loadingRequest}
        />
      )}

      {/* Footer */}
      <footer className="glass border-t border-glass-border mt-12">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
              <p className="text-foreground/80 text-sm">{info.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-foreground/60">Versão {info.version}</span>
              <a
                href={`${servers[0].url}/docs.json`}
                className="flex items-center text-primary hover:text-primary/80 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-sm mr-1">JSON Raw</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>


      </footer>
    </div>
  );
};

export default CBOApiDocs;