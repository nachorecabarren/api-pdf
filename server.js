const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const PDF_FOLDER = path.join(__dirname, 'pdfs'); // Carpeta donde están los PDFs


app.get('/pdfs', (req, res) => {
    let searchQuery = ''

    const sucursal = req.query.sucursal ;
    const tipo_acuerdo = req.query.tipo;

    if (!sucursal) {
        return res.status(400).json({ error: "Debes ingresar una sucursal." });
    }

    const PDF_FOLDER_2 = PDF_FOLDER + '/' + (sucursal);

    // Leer archivos del directorio
    fs.readdir(PDF_FOLDER_2, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Error al leer la carpeta de PDFs." });
        }

        // Filtrar archivos PDF que contengan el término de búsqueda en el nombre
        const matchingFiles = files.filter(file => 
            file.toLowerCase().includes(searchQuery.toLowerCase()) && file.endsWith('.pdf')
        );

        if (matchingFiles.length === 0) {
            return res.status(404).json({ error: "No se encontraron archivos PDF coincidentes." });
        }

        // Retornar URLs de los archivos encontrados
        const fileUrls = matchingFiles.map(file => ({
            filename: file,
            // url: `http://localhost:${PORT}/pdfs/${encodeURIComponent(file)}`
        }));

        res.json({ files: fileUrls });
    });
});

app.get('/download', (req, res) => {
    const searchQuery = req.query.q; // Exactly filename with .pdf extension
    const sucursal = req.query.sucursal ;

    if (!searchQuery) {
        return res.status(400).json({ error: "Debes proporcionar una busqueda." });
    }

    const PDF_FOLDER_2 = PDF_FOLDER + '/' + (sucursal);


    // Leer archivos en la carpeta de PDFs
    fs.readdir(PDF_FOLDER_2, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Error al leer la carpeta de PDFs." });
        }

        const matchingFile = files.find(file => 
            file.toLowerCase().includes(searchQuery.toLowerCase()) && file.endsWith('.pdf')
        );

        if (!matchingFile) {
            return res.status(404).json({ error: "No se encontró archivo PDF." });
        }

        const filePath = path.join(PDF_FOLDER_2, matchingFile);

        res.sendFile(filePath);
    });
});


// Servir archivos PDF estáticos
app.use('/pdfs', express.static(PDF_FOLDER));

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
