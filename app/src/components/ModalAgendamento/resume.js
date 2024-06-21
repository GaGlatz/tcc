import React from 'react';
import {Box, Cover, Spacer, Text, Title} from '../../styles';
import util from '../../util';
import theme from '../../styles/theme.json';

const ModalResume = ({servicos, agendamento}) => {
  const servicoSelecionado = servicos.find(
    (s) => s._id === agendamento.servicoId,
  );

  const formatarPreco = (preco) => `R$ ${preco.toFixed(2)}`;

  return (
    <Box
      justify="flex-start"
      direction="column"
      hasPadding
      background={util.toAlpha(theme.colors.muted, 5)}>
      <Box align="center">
        <Cover
          width="80px"
          height="80px"
          image={
            servicoSelecionado?.arquivos
              ? `${util.AWS.bucketURL}/${servicoSelecionado.arquivos[0].arquivo}`
              : ''
          }
        />
        <Box direction="column" align="center">
          <Title small bold>
            {servicoSelecionado?.titulo}
          </Title>
          <Spacer />
          <Text small>
            Total:{' '}
            <Text color="success" bold underline small>
              {formatarPreco(servicoSelecionado?.preco)}
            </Text>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ModalResume;
