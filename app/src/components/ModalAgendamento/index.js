import React, {useEffect, useRef} from 'react';
import {Dimensions, ScrollView, ActivityIndicator} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';

import ModalResume from './resume';
import ModalHeader from './header';
import DateTimePicker from './Pickers/dateTime';
import EspecialistasPicker from './Pickers/Especialistas';
import EspecialistasModal from './Pickers/Especialistas/modal';
import PaymentPicker from './Pickers/payment';

import {useSelector, useDispatch} from 'react-redux';
import {updateForm, saveAgendamento} from '../../store/modules/salao/actions';

import {Button, Box, Title, Text, Spacer} from '../../styles';
import theme from '../../styles/theme.json';

import moment from 'moment';
import util from '../../util';

const ModalAgendamento = () => {
  const dispatch = useDispatch();
  const {form, servicos, agendamento, agenda, colaboradores} = useSelector(
    (state) => state.salao,
  );

  const servico = servicos.find((s) => s._id === agendamento.servicoId);
  const dataSelecionada = moment(agendamento.data).format('YYYY-MM-DD');
  const horaSelecionada = moment(agendamento.data).format('HH:mm');
  const {horariosDisponiveis, colaboradoresDia} = util.selectAgendamento(
    agenda,
    dataSelecionada,
    agendamento.colaboradorId,
  );

  const sheetRef = useRef(null);

  useEffect(() => {
    sheetRef.current.snapTo(form.inputFiltroFoco ? 0 : form.modalAgendamento);
  }, [form.modalAgendamento, form.inputFiltroFoco]);

  const renderAgendaContent = () => (
    <>
      {agenda.length > 0 ? (
        <>
          <DateTimePicker
            {...{
              servico,
              agendamento,
              agenda,
              dataSelecionada,
              horaSelecionada,
              horariosDisponiveis,
            }}
          />
          <EspecialistasPicker {...{colaboradores, agendamento}} />
          <PaymentPicker />
          <Box hasPadding>
            <Button
              icon="check"
              background="primary"
              mode="contained"
              block
              disabled={form.agendamentoLoading}
              loading={form.agendamentoLoading}
              uppercase={false}
              onPress={() => dispatch(saveAgendamento())}>
              Confirmar meu agendamento
            </Button>
          </Box>
        </>
      ) : (
        <Box
          background="light"
          direction="column"
          height={Dimensions.get('window').height - 200}
          hasPadding
          justify="center"
          align="center">
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Spacer />
          <Title align="center">Só um instante...</Title>
          <Text align="center" small>
            Estamos buscando o melhor horário pra você...
          </Text>
        </Box>
      )}
    </>
  );

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={[0, 70, Dimensions.get('window').height - 30]}
      borderRadius={10}
      enabledBottomClamp
      enabledContentTapInteraction={false}
      onCloseEnd={() =>
        dispatch(
          updateForm(
            'modalAgendamento',
            form.modalAgendamento !== 0 ? form.modalAgendamento : 0,
          ),
        )
      }
      renderContent={() => (
        <ScrollView
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
          style={{backgroundColor: '#fff'}}>
          <ModalHeader
            form={form}
            onPress={() =>
              dispatch(
                updateForm(
                  'modalAgendamento',
                  form.modalAgendamento === 1 ? 2 : 1,
                ),
              )
            }
          />
          <ModalResume servicos={servicos} agendamento={agendamento} />
          {renderAgendaContent()}
          <EspecialistasModal
            {...{
              form,
              colaboradores,
              agendamento,
              servicos,
              horaSelecionada,
              colaboradoresDia,
            }}
          />
        </ScrollView>
      )}
    />
  );
};

export default ModalAgendamento;
