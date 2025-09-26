
export function formatTime(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleTimeString("es-CO", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
