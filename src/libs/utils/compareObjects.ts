
/**
 * Checks if two objects are the same
 * @param obj1 
 * @param obj2 
 * @returns true if they match
 */
export function compareObjects(obj1: object, obj2: object): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
