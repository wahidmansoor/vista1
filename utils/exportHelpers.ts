// Utility functions for export/print if needed

export function formatProtocolForPrint(protocol: {
  title: string;
  system: string;
  category: string;
  timeToAction: number;
  keySigns: string[];
  description: string;
}) {
  return `
${protocol.title}
System: ${protocol.system}
Category: ${protocol.category}
Urgency: ${protocol.timeToAction < 1 ? "<1h" : protocol.timeToAction + "h"}
Key Signs: ${protocol.keySigns.join(", ")}

${protocol.description}
  `.trim();
}
