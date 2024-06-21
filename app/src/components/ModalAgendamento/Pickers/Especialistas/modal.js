import React from 'react';
import {ScrollView, Dimensions} from 'react-native';
import Modal from 'react-native-simple-modal';
import {useDispatch} from 'react-redux';
import {
  updateForm,
  updateAgendamento,
} from '../../../../store/modules/salao/actions';
import {Text, Box, Touchable, Cover} from '../../../../styles';
import theme from '../../../../styles/theme.json';
import moment from 'moment/min/moment-with-locales';
moment.locale('pt-br');

const EspecialistasModal = ({
  form,
  colaboradores,
  agendamento,
  servicos,
  colaboradoresDia,
  horaSelecionada,
}) => {
  const dispatch = useDispatch();

  const colaboradoresDisponiveis = colaboradores.filter((c) =>
    Object.entries(colaboradoresDia).some(
      ([colaboradorId, horarios]) =>
        colaboradorId === c._id && horarios.flat(2).includes(horaSelecionada),
    ),
  );

  const servicoSelecionado = servicos.find(
    (s) => s._id === agendamento.servicoId,
  );

  const handleSelectColaborador = (colaboradorId) => {
    dispatch(updateAgendamento('colaboradorId', colaboradorId));
    dispatch(updateForm('modalEspecialista', false));
  };

  return (
    <Modal
      open={form.modalEspecialista}
      modalDidClose={() => dispatch(updateForm('modalEspecialista', false))}
      modalStyle={{padding: 0, borderRadius: 7, overflow: 'hidden'}}>
      <ScrollView>
        <Box hasPadding direction="column">
          <Text bold color="dark">
            {servicoSelecionado?.titulo}{' '}
          </Text>
          <Text small composed>
            disponíveis em{' '}
            <Text small underline composed>
              {moment(agendamento.data).format('DD/MM/YYYY (ddd) [às] HH:mm')}
            </Text>
          </Text>
          <Box wrap="wrap" height="auto" spacing="10px 0 0">
            {colaboradoresDisponiveis.map((colaborador) => (
              <Touchable
                key={colaborador._id}
                width={(Dimensions.get('screen').width - 80) / 4}
                height="70px"
                spacing="10px 0px 0px 0px"
                direction="column"
                align="center"
                onPress={() => handleSelectColaborador(colaborador._id)}>
                <Cover
                  height="45px"
                  width="45px"
                  circle
                  border={
                    colaborador._id === agendamento.colaboradorId
                      ? `2px solid ${theme.colors.primary}`
                      : 'none'
                  }
                  spacing="0px 0px 5px 0px"
                  image={colaborador.foto}
                />
                <Text
                  small
                  bold={colaborador._id === agendamento.colaboradorId}>
                  {colaborador.nome}
                </Text>
              </Touchable>
            ))}
          </Box>
        </Box>
      </ScrollView>
    </Modal>
  );
};

export default EspecialistasModal;
