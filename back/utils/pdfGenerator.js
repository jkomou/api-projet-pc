const PDFDocument = require('pdfkit');

async function generatePdfFromConfig(config) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    doc.fontSize(20).text('Configuration PC', { underline: true });
    doc.moveDown();

    // Exemple : afficher le nom ou id de la config
    doc.fontSize(14).text(`Configuration ID: ${config._id}`);
    doc.moveDown();

    // Afficher la liste des composants (si tu as config.composants)
    if (config.composants && config.composants.length) {
      config.composants.forEach((c, i) => {
        doc.text(`${i + 1}. ${c.nom || c.titre || 'Composant'}`);
      });
    }

    doc.end();
  });
}

module.exports = { generatePdfFromConfig };
