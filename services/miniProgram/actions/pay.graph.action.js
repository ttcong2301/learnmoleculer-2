const { MoleculerError } = require('moleculer').Errors;

module.exports = async function (ctx) {
  try {

  } catch (err) {
    if (err.name === 'MoleculerError') throw err;
    throw new MoleculerError(`[MiniProgram] Pay: ${err.message}`);
  }
};
