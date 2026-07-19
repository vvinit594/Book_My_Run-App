/** Formats sequential support ticket numbers as BMR-SUP-000001 */
export function formatTicketNumber(n: number): string {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error("Ticket sequence must be a positive integer");
  }
  return `BMR-SUP-${String(n).padStart(6, "0")}`;
}

// ponytail: ceiling = single-process counter; upgrade to DB SEQUENCE if multi-region
if (require.main === module) {
  console.assert(formatTicketNumber(1) === "BMR-SUP-000001");
  console.assert(formatTicketNumber(42) === "BMR-SUP-000042");
  console.assert(formatTicketNumber(1000000) === "BMR-SUP-1000000");
  console.log("ticketNumber self-check ok");
}
