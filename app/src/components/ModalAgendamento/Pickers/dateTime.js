import React from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {Box, Title, Text, Touchable} from '../../../styles';
import util from '../../../util';
import theme from '../../../styles/theme.json';
import {useDispatch} from 'react-redux';
import {updateAgendamento} from '../../../store/modules/salao/actions';
import moment from 'moment/min/moment-with-locales';
moment.locale('pt-br');

const DateTimePicker = ({
  agendamento,
  agenda,
  dataSelecionada,
  horaSelecionada,
  horariosDisponiveis,
}) => {
  const dispatch = useDispatch();

  const handleDateSelection = (date, isTime = false) => {
    const formattedDate = isTime
      ? `${dataSelecionada}T${date}`
      : `${date}T${horariosDisponiveis[0][0]}`;
    dispatch(updateAgendamento('data', moment(formattedDate).format()));
  };

  const renderDateItem = ({item}) => {
    const date = moment(Object.keys(item)[0]);
    const dateISO = date.format('YYYY-MM-DD');
    const isSelected = dateISO === dataSelecionada;

    return (
      <Touchable
        key={dateISO}
        width="70px"
        height="80px"
        spacing="0 10px 0 0"
        background={isSelected ? 'primary' : 'light'}
        rounded="10px"
        direction="column"
        justify="center"
        align="center"
        border={`1px solid ${util.toAlpha(theme.colors.muted, 20)}`}
        onPress={() => handleDateSelection(dateISO)}>
        <Text small color={isSelected ? 'light' : 'dark'}>
          {util.diasSemana[date.day()]}
        </Text>
        <Title small color={isSelected ? 'light' : 'dark'}>
          {date.format('DD')}
        </Title>
        <Text small color={isSelected ? 'light' : 'dark'}>
          {date.format('MMMM')}
        </Text>
      </Touchable>
    );
  };

  const renderTimeItem = ({item}) =>
    item.map((time) => {
      const isSelected = time === horaSelecionada;
      return (
        <Touchable
          key={time}
          width="100px"
          height="35px"
          spacing="0 0 5px 0"
          background={isSelected ? 'primary' : 'light'}
          rounded="7px"
          direction="column"
          justify="center"
          align="center"
          border={`1px solid ${util.toAlpha(theme.colors.muted, 20)}`}
          onPress={() => handleDateSelection(time, true)}>
          <Text color={isSelected ? 'light' : 'dark'}>{time}</Text>
        </Touchable>
      );
    });

  return (
    <>
      <Text bold color="dark" hasPadding>
        Pra quando você gostaria de agendar?
      </Text>
      <FlatList
        data={agenda}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{flexGrow: 0}}
        contentContainerStyle={{paddingLeft: 20, height: 85}}
        renderItem={renderDateItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <Box hasPadding direction="column" height="60px">
        <Text bold color="dark">
          Que horas?{' '}
          <Text small composed>
            Duração aprox.{' '}
            <Text small underline composed>
              {moment
                .duration(
                  horariosDisponiveis.length
                    ? horariosDisponiveis[0].length
                    : 0,
                  'minutes',
                )
                .humanize()}
            </Text>
          </Text>
        </Text>
      </Box>
      <FlatList
        data={horariosDisponiveis}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{flexGrow: 0}}
        contentContainerStyle={{paddingLeft: 20, height: 80}}
        renderItem={renderTimeItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </>
  );
};

export default DateTimePicker;
