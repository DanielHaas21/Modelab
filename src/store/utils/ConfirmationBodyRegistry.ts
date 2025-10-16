const bodyRegistry = new Map<string, React.ReactNode>();

export function registerBody(id: string, body: React.ReactNode | undefined) {
  if (body !== undefined) {
    bodyRegistry.set(id, body);
  }
}

export function getBody(id: string | undefined): React.ReactNode | undefined {
  if (!id) return undefined;
  return bodyRegistry.get(id);
}

export function removeBody(id: string | undefined) {
  if (!id) return;
  bodyRegistry.delete(id);
}
