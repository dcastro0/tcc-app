// services/pdfService.ts

import { Measurement } from "@/services/orm/entities/measurement";
import { getGlucoseLevelInfo } from "@/utils/glucoseLevels"; // Importa o helper de níveis
import * as Print from 'expo-print'; // Importa expo-print
import * as Sharing from 'expo-sharing'; // Importa expo-sharing
import { Alert } from "react-native";

/**
 * Gera uma string HTML a partir da lista de medições, incluindo cores.
 */
function createHistoryHtml(measurements: Measurement[]): string {
  const tableRows = measurements
    .map((m) => {
      // Pega informações do nível (incluindo cor e label)
      const levelInfo = getGlucoseLevelInfo(m.value);

      // Mapeia a classe Tailwind/lógica para cores CSS básicas para o PDF
      let cssColor = "black"; // Cor padrão
      switch (levelInfo.level) {
        case "bom":
          cssColor = "green";
          break;
        case "atencao":
          cssColor = "#B45309"; // Um amarelo/laranja escuro (mais legível que amarelo puro)
          break;
        case "risco":
          cssColor = "orange";
          break;
        case "alto_risco":
          cssColor = "red";
          break;
      }

      // Formata a data e hora
      const formattedDate = m.date ? new Date(m.date).toLocaleDateString("pt-BR") : "-";
      const formattedTime = m.date ? new Date(m.date).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit'}) : "-";

      return `
        <tr>
          <td style="border: 1px solid #ddd; padding: 6px; font-size: 9px;">${formattedDate}</td>
          <td style="border: 1px solid #ddd; padding: 6px; font-size: 9px;">${formattedTime}</td>
          {/* Aplica a cor ao valor da glicemia */}
          <td style="border: 1px solid #ddd; padding: 6px; font-size: 9px; color: ${cssColor}; font-weight: bold;">
            ${m.value !== null && m.value !== undefined ? `${m.value} mg/dL` : "-"}
          </td>
          {/* Coluna Nível com cor */}
          <td style="border: 1px solid #ddd; padding: 6px; font-size: 9px; color: ${cssColor};">
            ${levelInfo.label}
          </td>
          <td style="border: 1px solid #ddd; padding: 6px; font-size: 9px;">${m.note || ""}</td>
        </tr>
      `;
    })
    .join("");

  // Estilos CSS melhorados para o PDF
  const styles = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 20px; font-size: 10px; color: #333; }
      @page { margin: 20mm; } /* Define margens da página */
      h1 { color: #0056b3; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; }
      p { font-size: 10px; color: #555; margin-bottom: 15px; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th, td { text-align: left; padding: 8px; border: 1px solid #ddd; }
      th { background-color: #f0f0f0; font-weight: bold; font-size: 10px; }
      td { font-size: 9px; } /* Tamanho da fonte das células */
      tr:nth-child(even) { background-color: #f9f9f9; } /* Listras zebradas (opcional) */
    </style>
  `;

  return `
    <html>
      <head>
        <meta charset="UTF-8">
        ${styles}
      </head>
      <body>
        <h1>Relatório de Glicemia</h1>
        <p>Gerado em: ${new Date().toLocaleString("pt-BR")}</p>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Hora</th>
              <th>Valor</th>
              <th>Nível</th> {/* Coluna Nível adicionada */}
              <th>Nota</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `;
}

/**
 * Gera e compartilha um PDF do histórico de medições usando expo-print.
 */
export async function generateHistoryPdf(measurements: Measurement[]) {
  if (measurements.length === 0) {
    Alert.alert("Sem dados", "Não há medições registradas para gerar o relatório.");
    return;
  }

  // Ordena as medições da mais antiga para a mais recente para o relatório
  const sortedMeasurements = [...measurements].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const htmlContent = createHistoryHtml(sortedMeasurements); // Usa os dados ordenados

  try {
    // Gera o PDF usando expo-print para um arquivo temporário
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      // Opções para tentar melhorar a qualidade/layout (ajuste conforme necessário)
      // width: 612, // Largura de uma página US Letter em pontos (72 DPI)
      // height: 792, // Altura de uma página US Letter
      margins: { // Margens podem não funcionar bem em todas as plataformas
         top: 20,
         bottom: 20,
         left: 20,
         right: 20
       }
    });
    console.log('PDF gerado em (URI temporária):', uri);

    // Verifica se o compartilhamento está disponível
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert(
        "Compartilhamento Indisponível",
        "Não é possível compartilhar arquivos neste dispositivo.",
      );
      // Opcional: Mostrar URI para cópia manual
      // Alert.alert("PDF Gerado", `Arquivo salvo em: ${uri}`);
      return;
    }

    // Compartilha o arquivo PDF gerado
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Compartilhar Relatório de Glicemia',
      UTI: '.pdf', // Ajuda o iOS a identificar o tipo
    });

  } catch (error) {
    console.error("Erro ao gerar ou compartilhar PDF:", error);
    Alert.alert("Erro Inesperado", "Ocorreu um problema ao tentar gerar ou compartilhar o relatório em PDF.");
  }
}