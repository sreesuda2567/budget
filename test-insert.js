const { PDFDocument } = require('pdf-lib');
(async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    try {
        pdfDoc.insertPage(0, [210, 297]);
        console.log("insertPage with array worked!");
    } catch(e) {
        console.error("Error with array:", e.message);
    }
})();
