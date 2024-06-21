import React from 'react';
import {useDispatch} from 'react-redux';
import {updateForm} from '../../../../store/modules/salao/actions';
import {Box, Text, Cover, Button} from '../../../../styles';

const EspecialistasPicker = ({colaboradores, agendamento}) => {
  const dispatch = useDispatch();

  const colaboradorSelecionado = colaboradores.find(
    (c) => c._id === agendamento.colaboradorId,
  );

  const abrirModalEspecialista = () =>
    dispatch(updateForm('modalEspecialista', true));

  return (
    <Box hasPadding removePaddingBottom direction="column">
      <Text bold color="dark">
        Gostaria de trocar o(a) especialista?
      </Text>
      <Box spacing="20px 0 0" align="center" height="50px">
        <Box align="center">
          <Cover
            width="45px"
            height="45px"
            circle
            image={colaboradorSelecionado?.foto}
          />
          <Text small>{colaboradorSelecionado?.nome}</Text>
        </Box>
        <Button
          uppercase={false}
          onPress={abrirModalEspecialista}
          textColor="muted"
          background="light"
          mode="contained"
          block>
          Trocar Especialista
        </Button>
      </Box>
    </Box>
  );
};

export default EspecialistasPicker;
