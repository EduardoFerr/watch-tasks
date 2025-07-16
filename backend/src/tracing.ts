import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { credentials } from '@grpc/grpc-js';

// Executa o tracing apenas se não estivermos em modo de teste
if (process.env.NODE_ENV !== 'test') {
  console.log('A inicializar o sistema de tracing...');

  const jaegerExporter = new OTLPTraceExporter({
    url: 'http://jaeger:4317',
    credentials: credentials.createInsecure(),
  });

  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'task-manager-backend',
    }),
    traceExporter: jaegerExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
  console.log('Tracing inicializado com sucesso.');

  process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => console.log('Tracing terminado.'))
      .catch((error) => console.log('Erro ao terminar o tracing', error))
      .finally(() => process.exit(0));
  });
}
