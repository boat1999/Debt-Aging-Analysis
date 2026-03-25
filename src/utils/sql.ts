export function minifySql(sql: string): string {
  return sql
    .replace(/--.*$/gm, '')           // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/\s+/g, ' ')            // Collapse whitespace
    .trim();
}
