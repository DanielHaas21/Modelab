
/**
 * @param author Authors name
 * @param assetName Asset name
 * @param assetUrl Accessible URL
 * @param creationDate Date created asset
 * @returns Standard ISO 690 czech citation
 */
export const generateCzechISO690 = (author: string, assetName: string, assetUrl: string, creationDate: Date): string => {
  const formattedDate: string = creationDate.toLocaleDateString('cs-CZ');
  const accessDate: string = new Date().toLocaleDateString('cs-CZ');

  const nameParts: string[] = author.trim().split(' ');
  let formattedAuthor: string;

  if (nameParts.length === 1) {
    formattedAuthor = nameParts[0].toUpperCase();
  } else {
    const surname: string = nameParts.pop()?.toUpperCase() ?? "";
    const firstName: string = nameParts.join(' ');
    formattedAuthor = `${surname}, ${firstName}`;
  }

  return `${formattedAuthor}. ${assetName} [online]. ${formattedDate} [cit. ${accessDate}]. Dostupné z: ${assetUrl}`;
}