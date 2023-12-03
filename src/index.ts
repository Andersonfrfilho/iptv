import "dotenv/config";
import path from "path";
import { config } from "./config";
import { getLinksOnline } from "./verifyLink";
import fs, { link } from "fs";
export interface ElementDto {
  url: string;
  info: string;
  additional: string[];
}
async function main() {
  const arrayStringList = await new Promise<ElementDto[]>(
    (resolve, rejects) => {
      const fileListPath = path.resolve(config.list.path);
      const arrayString: ElementDto[] = [];
      const newArrayList: ElementDto[] = [];
      let index = 0;
      if (typeof fileListPath !== "string") {
        console.error("Erro: O caminho do arquivo não é uma string válida.");
      } else {
        try {
          // Verifica se o caminho é um diretório ou um arquivo
          const isDirectory = fs.statSync(fileListPath).isDirectory();
          if (isDirectory) {
            console.error(
              `Erro: O caminho ${fileListPath} aponta para um diretório, não um arquivo.`
            );
          } else {
            let fileStream = fs.createReadStream(fileListPath);

            fileStream.on("data", (chunk) => {
              console.log("teste de arquivo");
              const chunkStringArray = chunk.toString().split("\n");
              chunkStringArray.forEach((chunkString) => {
                const data: any = {};
                if (chunkString.startsWith("#EXTINF:-1")) {
                  data.info = chunkString;
                } else if (chunkString.startsWith("#EXTVLCOPT")) {
                  data.additional = (arrayString[index]?.additional &&
                    arrayString[index]?.additional.length > 0 &&
                    arrayString[index].additional.push(chunkString)) || [
                    chunkString,
                  ];
                } else if (
                  chunkString.endsWith(".m3u8") ||
                  chunkString.endsWith(".mp4")
                ) {
                  data.url = chunkString;
                }
                arrayString[index] = Object.assign(
                  arrayString[index] || {},
                  data
                );

                if (
                  arrayString[index] &&
                  arrayString[index]?.info &&
                  arrayString[index]?.url
                ) {
                  newArrayList.push(arrayString[index]);
                  index += 1;
                }
              });
            });

            fileStream.on("end", () => {
              console.log("Leitura do arquivo concluída.");
              resolve(newArrayList);
            });

            fileStream.on("error", (err) => {
              console.error(`Erro ao ler o arquivo ${fileListPath}:`, err);
            });
          }
        } catch (err) {
          console.error(`Erro ao verificar o arquivo ${fileListPath}:`, err);
          rejects(err);
        }
      }
    }
  );
  const linksWorker = await getLinksOnline(arrayStringList);
  const fileListPath = path.resolve("newList.m3u");
  let fileWriteStream = fs.createWriteStream(fileListPath);
  fileWriteStream.write("#EXTM3U");
  fileWriteStream.write("\n");
  linksWorker.forEach((element) => {
    fileWriteStream.write(element.info);
    fileWriteStream.write("\n");
    fileWriteStream.write(element.url);
    fileWriteStream.write("\n");
  });
  fileWriteStream.end();
}
main();
