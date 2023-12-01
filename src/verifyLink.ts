import axios from "axios";

export async function verifyLinks(links: string[]) {
  const linksOffline: string[] = [];

  const verifiesLinks = links.map(async (link) => {
    try {
      console.log(link);
      await axios.head(link);
      console.log("falhow");
    } catch (error) {
      // Se a solicitação falhar, consideramos o link offline
      linksOffline.push(link);
    }
  });
  await Promise.all(verifiesLinks);

  return linksOffline;
}
