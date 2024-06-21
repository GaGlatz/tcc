import React from 'react';
import {useDispatch} from 'react-redux';
import {Text, Box, Button, Cover, Spacer, Touchable} from '../../styles';
import moment from 'moment';
import util from '../../util';
import {
  updateAgendamento,
  filterAgenda,
  resetAgendamento,
} from '../../store/modules/salao/actions';

const Servico = ({item}) => {
  const dispatch = useDispatch();

  const handlePress = () => {
    dispatch(resetAgendamento());
    dispatch(updateAgendamento('servicoId', item?._id));
    dispatch(filterAgenda());
  };

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2)}`;
  };

  const formatDuration = (duration) => {
    return (
      moment(duration)
        .format('H:mm')
        .replace(/^(?:0:)?0?/, '') + ' mins'
    );
  };

  return (
    <Touchable
      align="center"
      hasPadding
      height="100px"
      background="light"
      onPress={handlePress}>
      <Cover
        image={
          item?.arquivos && item.arquivos.length > 0
            ? `${util.AWS.bucketURL}/${item.arquivos[0].arquivo}`
            : ''
        }
      />
      <Box direction="column">
        <Text bold color="dark">
          {item?.titulo}
        </Text>
        <Spacer />
        <Text small>
          {formatPrice(item?.preco)} • {formatDuration(item?.duracao)}
        </Text>
      </Box>
      <Box direction="column" align="flex-end">
        <Button
          icon="clock-check-outline"
          background="success"
          textColor="light"
          mode="contained">
          AGENDAR
        </Button>
      </Box>
    </Touchable>
  );
};

export default Servico;
