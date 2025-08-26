import { ChevronDown, ChevronRight, ChevronUp, FileText, Play, X } from "lucide-react";
import { useEffect, useState } from "react";

const TryOutPanel = ({ endpoint, onClose, requestParams, onParamChange, responseData, onExecute, loading }) => {
  const [activeTab, setActiveTab] = useState('params');
  const [expandedJsonPaths, setExpandedJsonPaths] = useState<Record<string, any>>({});
  const [expandedPaginationPaths, setExpandedPaginationPaths] = useState<Record<string, any>>({});

  // Mudar para a aba de resposta quando os dados chegarem
  useEffect(() => {
    if (responseData && !responseData.error) {
      setActiveTab('response');
    }
  }, [responseData, setActiveTab]);

  if (!endpoint) return null;

  const method = endpoint.methods[0].method;
  const details = endpoint.methods[0];
  const components = endpoint.components

  // Função para renderizar JSON de forma interativa
  const renderJson = (data: any, path = '') => {
    if (typeof data !== 'object' || data === null) {
      return <span className="text-foreground/80">{JSON.stringify(data)}</span>;
    }

    if (Array.isArray(data)) {
      return (
        <div className="pl-4">
          <button
            onClick={() => setExpandedJsonPaths(prev => ({
              ...prev,
              [path]: !prev[path]
            }))}
            className="flex items-center text-foreground/60 hover:text-foreground mb-1"
          >
            {expandedJsonPaths[path] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span className="ml-1">[{data.length} items]</span>
          </button>

          {expandedJsonPaths[path] && (
            <div className="border-l border-glass-border pl-4 ml-1">
              {data.map((item, index) => (
                <div key={index} className="my-1">
                  {renderJson(item, `${path}[${index}]`)}
                  {index < data.length - 1 && ','}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="pl-4">
        <button
          onClick={() => setExpandedJsonPaths(prev => ({
            ...prev,
            [path]: !prev[path]
          }))}
          className="flex items-center text-foreground/60 hover:text-foreground mb-1"
        >
          {expandedJsonPaths[path] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span className="ml-1">{'{'}...{'}'}</span>
        </button>

        {expandedJsonPaths[path] && (
          <div className="border-l border-glass-border pl-4 ml-1">
            {Object.entries(data).map(([key, value], index, array) => (
              <div key={key} className="my-1">
                <span className="text-blue-400">"{key}"</span>
                <span className="text-foreground/60">: </span>
                {renderJson(value, path ? `${path}.${key}` : key)}
                {index < array.length - 1 && ','}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPagination = (data: any, path = '') => {
    if (typeof data !== 'object' || data === null) {
      return <span className="text-foreground/80">{JSON.stringify(data)}</span>;
    }

    if (Array.isArray(data)) {
      return (
        <div className="pl-4">
          <button
            onClick={() => setExpandedPaginationPaths(prev => ({
              ...prev,
              [path]: !prev[path]
            }))}
            className="flex items-center text-foreground/60 hover:text-foreground mb-1"
          >
            {expandedPaginationPaths[path] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span className="ml-1">[{data.length} items]</span>
          </button>

          {expandedPaginationPaths[path] && (
            <div className="border-l border-glass-border pl-4 ml-1">
              {data.map((item, index) => (
                <div key={index} className="my-1">
                  {renderPagination(item, `${path}[${index}]`)}
                  {index < data.length - 1 && ','}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="pl-4">
        <button
          onClick={() => setExpandedPaginationPaths(prev => ({
            ...prev,
            [path]: !prev[path]
          }))}
          className="flex items-center text-foreground/60 hover:text-foreground mb-1"
        >
          {expandedPaginationPaths[path] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span className="ml-1">{'{'}...{'}'}</span>
        </button>

        {expandedPaginationPaths[path] && (
          <div className="border-l border-glass-border pl-4 ml-1">
            {Object.entries(data).map(([key, value], index, array) => (
              <div key={key} className="my-1">
                <span className="text-blue-400">"{key}"</span>
                <span className="text-foreground/60">: </span>
                {renderPagination(value, path ? `${path}.${key}` : key)}
                {index < array.length - 1 && ','}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-4xl w-full max-h-[150vh] min-h[120vh] h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-glass-border">
          <h2 className="text-2xl font-bold flex items-center">
            <Play size={24} className="mr-2 text-primary" />
            Testar Endpoint
          </h2>
          <button
            onClick={onClose}
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-auto flex flex-col">
          <div className="flex border-b border-glass-border">
            <button
              className={`px-6 py-3 font-medium flex-1 text-center ${activeTab === 'params'
                ? 'text-primary border-b-2 border-primary'
                : 'text-foreground/60 hover:text-foreground'
                }`}
              onClick={() => setActiveTab('params')}
            >
              Parâmetros
            </button>
            <button
              className={`px-6 py-3 font-medium flex-1 text-center ${activeTab === 'response'
                ? 'text-primary border-b-2 border-primary'
                : 'text-foreground/60 hover:text-foreground'
                }`}
              onClick={() => setActiveTab('response')}
            >
              Resposta
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            {activeTab === 'params' && (
              <div className="space-y-6">
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${method === 'get' ? 'bg-green-500/20 text-green-400' :
                      method === 'post' ? 'bg-blue-500/20 text-blue-400' :
                        method === 'put' ? 'bg-yellow-500/20 text-yellow-400' :
                          method === 'delete' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                      }`}>
                      {method.toUpperCase()}
                    </span>
                    <span className="font-mono text-lg">{endpoint.path}</span>
                  </div>
                  <p className="text-foreground/80">{details.summary}</p>
                </div>

                {details.parameters && details.parameters.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground/80">Parâmetros:</h4>
                    {details.parameters.map((param: any, idx: number) => {

                      let isRef = param.hasOwnProperty("$ref");

                      if (isRef) {
                        param = components.parameters[param.$ref.replace('#/components/parameters/', '').trim()]
                        let isRefSchema = (param.schema as Record<string, any>).hasOwnProperty("$ref");
                        if (isRefSchema) {
                          param.schema = components.schemas[param.schema.$ref.replace('#/components/schemas/', '').trim()]
                        }
                      }

                      return (
                        <div key={idx} className="glass rounded-xl p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center">
                              <span className="font-mono text-primary bg-primary/10 px-2 py-1 rounded mr-2">
                                {param.name}
                              </span>
                              <span className="text-xs bg-muted px-2 py-1 rounded">
                                {param.in}
                              </span>
                              {param.required && (
                                <span className="text-red-400 text-xs bg-red-500/10 px-2 py-1 rounded ml-2">
                                  obrigatório
                                </span>
                              )}
                            </div>
                            <span className="text-foreground/60 text-sm">{param.schema?.type}</span>
                          </div>

                          <p className="text-foreground/80 text-sm mb-3">{param.description}</p>

                          <input
                            type="text"
                            placeholder={param.example ? `ex: ${param.example}` : `Digite o valor para ${param.name}`}
                            className="glass w-full px-4 py-2 rounded-lg border border-glass-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                            value={requestParams[param.name] || ''}
                            onChange={(e) => onParamChange({
                              ...requestParams,
                              [param.name]: e.target.value
                            })}
                          />
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText size={24} className="text-foreground/40" />
                    </div>
                    <p className="text-foreground/60">Este endpoint não requer parâmetros</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'response' && (
              <div className="h-full flex flex-col">
                {responseData ? (
                  <>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold mr-3 ${responseData.status >= 200 && responseData.status < 300
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                            {responseData.status} {responseData.statusText}
                          </span>
                          <span className="text-foreground/60 text-sm">
                            {new Date().toLocaleTimeString()}
                          </span>
                        </div>

                        {responseData.headers && (
                          <button
                            onClick={() => setExpandedJsonPaths((prev) => ({
                              ...prev,
                              headers: !prev.headers
                            }))}
                            className="text-xs text-foreground/60 hover:text-foreground flex items-center"
                          >
                            {expandedJsonPaths.headers ? 'Ocultar' : 'Mostrar'} Headers
                            {expandedJsonPaths.headers ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
                          </button>
                        )}
                      </div>

                      {responseData.headers && expandedJsonPaths.headers && (
                        <div className="glass rounded-xl p-4 mb-4">
                          <h4 className="font-semibold mb-3 text-foreground/80">Headers:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {Object.entries(responseData.headers).map(([key, value]: [key: string, value: any]) => (
                              <div key={key} className="flex">
                                <span className="text-blue-400 font-medium w-32 truncate">{key}:</span>
                                <span className="text-foreground/80 flex-1 truncate" title={value}>{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="glass border-none rounded p-2">
                      <h4 className="font-semibold text-foreground/80">Resposta:</h4>
                    </div>
                    <div className="flex-1 overflow-auto">
                      <div className="glass rounded-xl p-4 h-full border-t-[0] rounded-t-none overflow-auto">
                        <div className="font-mono text-sm">

                          {(() => {
                            const renderElement = () => {
                              if (responseData.error) {
                                return (
                                  <div className="text-destructive">
                                    <span className="font-semibold">Erro: </span>
                                    {responseData.error}
                                  </div>
                                )
                              }
                              if (responseData.data) {
                                const {
                                  pagination,
                                  ...restResponseData
                                } = responseData.data;

                                return (
                                  renderJson(restResponseData)
                                )
                              }

                              return (
                                <div className="text-foreground/60">Nenhum dado retornado</div>
                              )

                            }

                            return renderElement()
                          })()}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText size={24} className="text-foreground/40" />
                      </div>
                      <p className="text-foreground/60">Execute a requisição para ver a resposta</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {activeTab === 'params' && (
            <div className="p-6 border-t border-glass-border">
              <button
                onClick={onExecute}
                disabled={loading}
                className="bg-gradient-primary text-white px-8 py-3 rounded-xl hover:shadow-glow transition-all w-full flex items-center justify-center disabled:opacity-50 font-semibold"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Executando...
                  </>
                ) : (
                  <>
                    <Play size={18} className="mr-2" />
                    Executar Requisição
                  </>
                )}
              </button>
            </div>
          )}


          {activeTab === 'response' && responseData && responseData.data && responseData.data.pagination && (
            <div className="p-6 border-t border-glass-border overflow-auto">
              <div className="glass rounded-xl p-4">
                <h4 className="font-semibold mb-3 text-foreground/80">Paginação:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {renderPagination(responseData.data.pagination)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TryOutPanel;