import { Resolve } from '../types/';

/** 
  This resolver map is used for supporting multiple popup instances at the same time which are locally stored in this map 
  Upon being resolved they are removed
*/
const resolverMap = new Map<string, Resolve>();

/**
 * Registers a popup resolver instance
 * @param id 
 * @param resolver 
 */
export const registerResolver = (id: string, resolver: Resolve) => {
  resolverMap.set(id, resolver);
};

/**
 * Removes a popup resolver instance
 * @param id 
 * @param value 
 */
export const resolveAndRemove = (id: string, value: boolean) => {
  const resolver = resolverMap.get(id);
  if (resolver) {
    resolver(value);
    resolverMap.delete(id);
  }
};
