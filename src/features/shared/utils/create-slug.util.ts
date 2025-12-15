export function createSlug(text: string, id?: string) {
  return `${text}${id ? `-${id}` : ""}`
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]+/g, "")
    .replace(/[\s-]+/g, "-");
}
