import { sequelize, Alumno, Contacto, Administrador, Grupo, TestPersonalidad, TestVark } from './models/database.js';

async function testConnection() {
  try {
    console.log('🔌 Iniciando prueba de conexión...\n');
    
    // 1. Probar conexión a la BD
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa');
    
    // 2. Sincronizar modelos (solo crea tablas si no existen)
    await sequelize.sync({ force: false });
    console.log('✅ Modelos sincronizados correctamente');
    
    // 3. Verificar que las tablas existen y pueden consultarse
    console.log('\n📊 Verificando tablas:');
    
    const alumnosCount = await Alumno.count();
    console.log(`   Tabla 'alumnos': ✅ (${alumnosCount} registros)`);
    
    const contactoCount = await Contacto.count();
    console.log(`   Tabla 'contacto': ✅ (${contactoCount} registros)`);
    
    const administradorCount = await Administrador.count();
    console.log(`   Tabla 'administrador': ✅ (${administradorCount} registros)`);
    
    const gruposCount = await Grupo.count();
    console.log(`   Tabla 'grupos': ✅ (${gruposCount} registros)`);
    
    const testPersonalidadCount = await TestPersonalidad.count();
    console.log(`   Tabla 'test_personalidad': ✅ (${testPersonalidadCount} registros)`);
    
    const testVarkCount = await TestVark.count();
    console.log(`   Tabla 'test_vark': ✅ (${testVarkCount} registros)`);
    
    // 4. Probar estructura de modelos
    console.log('\n🔍 Probando consultas básicas:');
    
    const alumnos = await Alumno.findAll({ 
      limit: 3
    });
    console.log('   Alumnos encontrados:', alumnos.length);
    
    const grupos = await Grupo.findAll({
      limit: 3
    });
    console.log('   Grupos encontrados:', grupos.length);
    
    console.log('\n🎉 ¡Todas las pruebas pasaron correctamente!');
    console.log('✅ La base de datos está lista para usar');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    console.error('Detalles:', error);
  } finally {
    // Cerrar conexión
    await sequelize.close();
    console.log('\n🔒 Conexión cerrada');
  }
}

// Ejecutar la prueba
testConnection();