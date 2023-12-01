import "dotenv/config";
import path from "path";
import { config } from "./config";
import { verifyLinks } from "./verifyLink";
import fs from "fs";

async function main() {
  const fileListPath = path.resolve(config.list.path);
  const arrayString: string[] = [];
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
          const chunkString = chunk.toString().split("\n");
          const filterLinks = chunkString.filter((link) =>
            link.endsWith(".m3u8")
          );
          arrayString.push(...filterLinks);
        });

        fileStream.on("end", () => {
          console.log("Leitura do arquivo concluída.");
        });

        fileStream.on("error", (err) => {
          console.error(`Erro ao ler o arquivo ${fileListPath}:`, err);
        });
      }
    } catch (err) {
      console.error(`Erro ao verificar o arquivo ${fileListPath}:`, err);
    }
  }
  console.log(arrayString);
  const offlineLinks = await verifyLinks(arrayString);
  console.log(offlineLinks);
}
main();
