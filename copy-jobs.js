const fs = require('fs');
const path = require('path');

// Función para copiar archivos JSON de empleos
function copyJobFiles() {
  const sourceDir = path.join(__dirname, '..', 'scraping_empleos');
  const targetDir = path.join(__dirname, 'public', 'jobs');
  
  // Crear directorio de destino si no existe
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log('✅ Directorio public/jobs creado');
  }
  
  // Lista de archivos JSON de empleos
  const jobFiles = [
    'vacantes-laravel.json',
    'vacantes-javascript.json',
    'vacantes-php.json',
    'vacantes-VueJS.json',
    'vacantes-desarrollador junior.json'
  ];
  
  let copiedCount = 0;
  
  jobFiles.forEach(filename => {
    const sourcePath = path.join(sourceDir, filename);
    const targetPath = path.join(targetDir, filename);
    
    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`✅ Copiado: ${filename}`);
        copiedCount++;
      } catch (error) {
        console.error(`❌ Error copiando ${filename}:`, error.message);
      }
    } else {
      console.log(`⚠️  No encontrado: ${filename}`);
    }
  });
  
  console.log(`\n📊 Resumen: ${copiedCount} archivos copiados de ${jobFiles.length} archivos`);
  
  if (copiedCount > 0) {
    console.log('🎉 Los archivos de empleos están listos para usar en el frontend');
  }
}

// Ejecutar la función
copyJobFiles(); 