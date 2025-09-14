export default function getDateAfter(days: number, from: null | Date): Date {
    const expiresAt = new Date();
    expiresAt.setDate(from ? from.getDate() : expiresAt.getDate() + days)

    return expiresAt
}