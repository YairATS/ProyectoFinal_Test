import { TestVark, Alumno } from './models/database.js';

// En test.js o en una ruta de prueba
const test = await TestVark.findByPk(1, {
  include: [{
    model: Alumno,
    as: 'alumno'
  }]
});

console.log(test.alumno.nombre); // Debería funcionar