import axios from "axios";
import { ElementDto } from ".";

export async function getLinksOnline(
  links: ElementDto[]
): Promise<ElementDto[]> {
  const newList = [];

  for (let index = 0; index < links.length; index++) {
    try {
      await axios.head(links[index].url);
      newList.push(links[index]);
    } catch (error) {
      // Se a solicitação falhar, consideramos o link offline
    } finally {
      console.log(((index * 100) / links.length).toFixed(2) + "%");
    }
  }
  return newList;
}
