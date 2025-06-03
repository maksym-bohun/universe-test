import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage<Map<string, string>>();

export function addCorrelationId(id: string) {
  asyncLocalStorage.enterWith(new Map([['correlationId', id]]));
}

export function getCorrelationId(): string | undefined {
  return asyncLocalStorage.getStore()?.get('correlationId');
}
