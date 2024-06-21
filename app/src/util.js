import moment from 'moment';

const util = {
  diasSemana: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],

  toAlpha: (hex, alpha) => {
    const alphaHex = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();
    return `${hex}${alphaHex}`;
  },

  selectAgendamento: (agenda, data = null, colaboradorId = null) => {
    let horariosDisponiveis = [];
    let colaboradoresDia = [];

    if (agenda.length > 0) {
      data = data || Object.keys(agenda[0])[0];
      const dia = agenda.find((a) => Object.keys(a)[0] === data);
      const diaObject = dia?.[data];
      if (diaObject) {
        colaboradorId = colaboradorId || Object.keys(diaObject)[0];
        colaboradoresDia = Object.keys(diaObject);
        horariosDisponiveis = diaObject[colaboradorId] || [];
      }
    }

    return {horariosDisponiveis, data, colaboradorId, colaboradoresDia};
  },

  AWS: {
    bucketURL: 'https://tcc-bucket-13.s3.sa-east-1.amazonaws.com',
  },
};

export default util;
