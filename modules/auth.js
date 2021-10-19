const btoa = require('btoa');

module.exports = (req, res, next) => {
  /**
   * REVIEW:
   * Lo correcto sería devolver 401 Unauthorized.
   * Dado que el header no está presente, no se puede determinar quién es.
   *
   *  - 401 = Unauthorized. No se sabe la identidad.
   *  - 403 = Forbidden. Se conoce quien es pero no tiene acceso.
   */
  if (!req.headers.authorization) {
    return res.status(403).json({ message: 'Not alowed' });
  }
  const token = req.headers.authorization.split(' ')[1];

  // REVIEW:
  // Las peticiones GET también se protegen.
  // Es mejor solo validar en base al token.
  // Luego el controller sabrá si llamar esta función para un POST o un GET, etc.
  // Pero no le corresponde a esta función hacer valdiación basado en el método HTTP,
  // solo en si está el header o no presente.
  if (req.method === 'POST' && token > 0 && token < 11) {
    return next();
  }
  const idParam = req.params.id;
  const payload = btoa(idParam);
  if (payload === token) {
    return next();
  }
  return res.status(403).json({ message: 'Not alowed' });
};
