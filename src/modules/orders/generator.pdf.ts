import { Order } from "./order.entity";
import PDFDocument = require("pdfkit");
import { createWriteStream } from 'fs';
import moment = require('moment')


export default (order: Order) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "a4"
    });
    try {
      const ws = createWriteStream(`public/rent-pdf/${order.id}.pdf`);
      doc.pipe(ws);
      const valorTotal = order.products.reduce((total, product) => total += !product.product.isRent ? product.amount * parseFloat(product.product.value) : 0, 0);
      const locatario = order.client.name;
      const locatarioCpf = "000.000.234-63";
      const locador = "Eliana Luiza Vieira Galdino";
      const locadorCpf = "132.117.334-01";

      moment.locale('pt-BR')
      const dateNow = moment().format("LL")
      const dateRent = moment(order.dateDelivery).format("LL")

      let produtos = "";
      order.products.forEach(product => {
        if (product.product.isRent) {
          produtos += `\n${product.product.id} - ${product.product.name} - R$ ${parseFloat(product.product.value).toFixed(2)} - ${product.amount} - R$ ${(parseFloat(product.product.value) * product.amount).toFixed(2)}`;
        }
      });
      doc.fontSize(16).text("MODELO CONTRATO DE LOCAÇÃO", {
        align: 'center'
      });
      doc.fontSize(12).text("                                    ");
      doc.fontSize(12).text(`Pelo presente instrumento as partes abaixo especificadas, de um lado, ${locador}, portadora do CPF ${locadorCpf}, doravante denominada simplesmente LOCADOR, e de outro, ${locatario}, portadora do CPF ${locatarioCpf}, doravante denominado simplesmente como LOCATÁRIO.`, {
        align: 'justify'
      });
      doc.fontSize(12).text("                                    ");
      doc.fontSize(12).text(`O presente instrumento tem por objetivo e prestação de serviços profissionais de decoração para evento, a ser desenvolvido de acordo com as especificações constantes deste contrato, na data de ${dateNow}.`, {
        align: 'justify'
      });
      doc.fontSize(12).text("                                    ");
      doc.fontSize(14).text(`A locação dos itens abaixo descritos.`);
      doc.fontSize(12).text(produtos);
      doc.fontSize(12).text("                                    ");
      doc.fontSize(12).text(`O evento se realizará ${dateRent}, endereço Rua //TODO AINDA VOU COLOCAR, nº ____ Cidade _______________ às ___:00 hrs.`, {
        align: 'justify'
      });
      doc.fontSize(12).text("                                    ");
      doc.fontSize(14).text(`Contratam, sob as condições seguintes:`);
      doc.fontSize(12).text("                                    ");
      doc.fontSize(12).text(`I – O valor do aluguel fica estabelecido em R$ ${valorTotal.toFixed(2)} para a decoração, sendo 30%(R$ ${(valorTotal * 0.3).toFixed(2)}) no ato do contrato e o restante em até 3 (três) dias antes do evento (não aceitamos cheque);`, {
        align: 'justify'
      });
      doc.fontSize(12).text("                                    ");
      doc.fontSize(12).text(`a) O valor da locação deve ser concluído até no máximo 3 (três) dias antes do evento, pois na falta do pagamento,o LOCADOR entenderá se tratar de desistência por parte do LOCATÁRIO;`, {
        align: 'justify'
      });
      doc.fontSize(12).text("                                    ");
      doc.fontSize(14).text(`II – Este Contrato de Locação poderá ser cancelado, desde que o LOCADOR seja avisado por escrito com 15(quinze) dias de antecedência, para que seja feito o processo de CANCELAMENTO, o qual NÃO implicará na devolução do “SINALde RESERVA”;`, {
        align: 'justify'
      });
      doc.fontSize(12).text("                                    ");
      doc.fontSize(12).text(`a) O LOCADOR “NÃO” restituirá nenhuma importância paga, sob qualquer circunstância.`, {
        align: 'justify'
      });
      doc.fontSize(12).text("                                    ");
      doc.fontSize(12).text(`b) Em caso de intenção de mudança na data do evento, a mesma só ocorrerá se houver disponibilidade por parte doCONTRATADO, caso não haja essa disponibilidade o CONTRATADO estará isento de quaisquer responsabilidades epenalidades legais.`, {
        align: 'justify'
      });
      doc.fontSize(12).text("                                    ");
      doc.fontSize(12).text(`c) Em caso de quaisquer alterações no serviço contratado, deverá haver uma notificação por escrito com no mínimo15 (quinze) dias de antecedência à data do evento.`, {
        align: 'justify'
      });
      doc.fontSize(12).text("                                    ");
      doc.fontSize(12).text(`d) Em caso de quaisquer alterações no serviço contratado, cabe ao CONTRATADO avaliar se essas mudançasocasionarão alteração no valor do contrato.`, {
        align: 'justify'
      });
      doc.fontSize(12).text("                                    ");
      doc.fontSize(14).text(`III – Caso a montagem da decoração seja em área aberta, sem cobertura, e no momento da montagem esteja chovendo,cabe ao LOCATÁRIO providenciar uma cobertura, para que seja montado.`, {
        align: 'justify'
      });
      doc.fontSize(12).text("                                    ");
      doc.fontSize(14).text(`IV – O LOCATÁRIO sede todos os direitos de imagem durante o evento ao LOCADOR como: FOTOS.`, {
        align: 'justify'
      });
      doc.fontSize(12).text("                                    ");
      doc.fontSize(12).text(`a) O NÃO ENCERRAMENTO DAS ATIVIDADES, NO HORÁRIO CONSTANTE NO PRESENTE CONTRATO, ACARRETARÁ NA COBRANÇA DE MULTA CORRESPONDENTE A METADE DO VALOR DA LOCAÇÃO;`, {
        align: 'justify'
      });
      doc.fontSize(12).text("                                    ");
      doc.fontSize(14).text(`VI – Toda e qualquer peça do cenário que for danificada durante a festa, será cobrada taxa para reposição da mesma, conforme tabela anexada no contrato.`, {
        align: 'justify'
      });
      doc.fontSize(12).text("                                    ");
      doc.fontSize(12).text(`a) Se houver perda de alguma peça do cenário, será cobrada taxa de reposição da mesma, conforme tabela anexada no contrato.`, {
        align: 'justify'
      });
      doc.fontSize(12).text("                                    ");
      doc.fontSize(12).text(`E por estarem LOCADOR e LOCATÁRIO de pleno acordo com o disposto neste instrumento particular, o assinam abaixo, e em duas vias.`);
      doc.fontSize(12).text("                                    ");
      doc.fontSize(12).text("                                    ");
      doc.fontSize(12).text("                                    ");
      doc.fontSize(12).text(`Piranhas, Alagoas, 25 de Maio de 2020.`, {
        align: 'center'
      });
      doc.fontSize(12).text("                                    ");
      doc.fontSize(12).text(`LOCADOR: ___________________________________`, {
        align: 'center'
      });
      doc.fontSize(12).text("                                    ");
      doc.fontSize(12).text(`LOCATÁRIO: __________________________________`, {
        align: 'center'
      });
      doc.end();
      ws.on('finish', () => {
        resolve();
      });
    }
    catch (e) {
      reject(e);
    }
  });
}
