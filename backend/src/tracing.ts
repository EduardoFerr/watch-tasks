import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

console.log('A inicializar o sistema de tracing...');

// Configura o exportador para enviar traces para o nosso container Jaeger.
// A porta 4317 é a porta padrão para a ingestão de dados gRPC.
const jaegerExporter = new OTLPTraceExporter({

  url: 'http://jaeger:4317',
});

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'task-manager-backend',
  }),
  traceExporter: jaegerExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start()
  .then(() => console.log('Tracing inicializado com sucesso.'))
  .catch((error) => console.log('Erro ao inicializar o tracing', error));

// Garante que, ao encerrar a aplicação, todos os traces pendentes são enviados.
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminado.'))
    .catch((error) => console.log('Erro ao terminar o tracing', error))
    .finally(() => process.exit(0));
});
