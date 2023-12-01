"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificaLinks = void 0;
const axios_1 = __importDefault(require("axios"));
async function verificaLinks(links) {
    const linksOffline = [];
    for (const link of links) {
        try {
            await axios_1.default.head(link);
        }
        catch (error) {
            // Se a solicitação falhar, consideramos o link offline
            linksOffline.push(link);
        }
    }
    return linksOffline;
}
exports.verificaLinks = verificaLinks;
// Lista de links de exemplo
const listaDeLinks = [
    "https://stmv1.srvif.com/animetv/animetv/playlist.m3u8",
    // Adicione mais links conforme necessário
];
verificaLinks(listaDeLinks)
    .then((linksOffline) => {
    console.log("Links offline:");
    linksOffline.forEach((link) => {
        console.log(link);
    });
})
    .catch((error) => console.error("Erro ao verificar links:", error));
