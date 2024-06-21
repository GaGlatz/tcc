import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "rsuite/dist/styles/rsuite-default.css";
import util from "../../services/util";
import colors from "../../data/colors.json";
import {
  TagPicker,
  Drawer,
  Modal,
  Icon,
  Checkbox,
  DatePicker,
  Button,
  Notification,
} from "rsuite";
import {
  allHorarios,
  addHorario,
  removeHorario,
  updateHorario,
  allServicos,
  filterColaboradores,
  saveHorario,
} from "../../store/modules/horario/actions";

moment.locale("pt-br");
const localizer = momentLocalizer(moment);

const TagPickerComponent = ({ label, value, data, onChange, disabled }) => (
  <div className="col-12 mt-3">
    <b>{label}</b>
    <TagPicker size="lg" block value={value} data={data} onChange={onChange} />
    <Checkbox
      disabled={value.length === data.length}
      checked={value.length === data.length}
      onChange={(v, selected) => {
        if (selected) {
          onChange(data.map((s) => s.value));
        } else {
          onChange([]);
        }
      }}
    >
      Selecionar Todos
    </Checkbox>
  </div>
);

const DatePickerComponent = ({ label, value, onChange }) => (
  <div className="col-6 mt-3">
    <b className="d-block">{label}</b>
    <DatePicker
      block
      format="HH:mm"
      hideMinutes={(min) => ![0, 30].includes(min)}
      value={value}
      onChange={onChange}
    />
  </div>
);

const ConfirmDeleteModal = ({ show, saving, onConfirm, onCancel }) => (
  <Modal show={show} onHide={onCancel} size="xs">
    <Modal.Body>
      <Icon
        icon="remind"
        style={{
          color: "#ffb300",
          fontSize: 24,
        }}
      />
      Tem certeza que deseja excluir? Essa ação será irreversível!
    </Modal.Body>
    <Modal.Footer>
      <Button loading={saving} onClick={onConfirm} color="red">
        Sim, tenho certeza!
      </Button>
      <Button onClick={onCancel} appearance="subtle">
        Cancelar
      </Button>
    </Modal.Footer>
  </Modal>
);

const CustomCalendar = ({
  onEventSelect,
  onSlotSelect,
  events,
  date,
  view,
}) => (
  <Calendar
    localizer={localizer}
    onSelectEvent={onEventSelect}
    onSelectSlot={onSlotSelect}
    formats={{
      dateFormat: "dd",
      dayFormat: (date, culture, localizer) =>
        localizer.format(date, "dddd", culture),
    }}
    events={events}
    eventPropGetter={(event, start, end, isSelected) => {
      return {
        style: {
          backgroundColor: event.resource.backgroundColor,
          borderColor: event.resource.backgroundColor,
        },
      };
    }}
    date={date}
    view={view}
    selectable={true}
    popup={true}
    toolbar={false}
    style={{ height: 600 }}
  />
);

const HorariosAtendimento = () => {
  const dispatch = useDispatch();
  const {
    horario,
    horarios,
    form,
    components,
    behavior,
    servicos,
    colaboradores,
  } = useSelector((state) => state.horario);

  const diasDaSemana = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ];

  const diasSemanaData = [
    new Date(2024, 6, 14, 0, 0, 0, 0),
    new Date(2024, 6, 15, 0, 0, 0, 0),
    new Date(2024, 6, 16, 0, 0, 0, 0),
    new Date(2024, 6, 17, 0, 0, 0, 0),
    new Date(2024, 6, 18, 0, 0, 0, 0),
    new Date(2024, 6, 19, 0, 0, 0, 0),
    new Date(2024, 6, 20, 0, 0, 0, 0),
  ];

  const setHorario = useCallback(
    (key, value) => {
      dispatch(updateHorario({ horario: { ...horario, [key]: value } }));
    },
    [dispatch, horario]
  );

  const setComponents = useCallback(
    (component, state) => {
      dispatch(
        updateHorario({ components: { ...components, [component]: state } })
      );
    },
    [dispatch, components]
  );

  const onHorarioClick = useCallback(
    (horario) => {
      dispatch(updateHorario({ horario, behavior: "update" }));
      setComponents("drawer", true);
    },
    [dispatch, setComponents]
  );

  const save = useCallback(() => {
    if (
      !util.allFields(horario, [
        "dias",
        "inicio",
        "fim",
        "especialidades",
        "colaboradores",
      ])
    ) {
      Notification.error({
        placement: "topStart",
        title: "Calma lá!",
        description: "Antes de prosseguir, preencha todos os campos!",
      });
      return false;
    }

    if (behavior === "create") {
      dispatch(addHorario());
    } else {
      dispatch(saveHorario());
    }
  }, [dispatch, horario, behavior]);

  const remove = useCallback(() => {
    dispatch(removeHorario());
  }, [dispatch]);

  const formatEventos = useCallback(() => {
    let listaEventos = [];

    horarios.forEach((hor, index) => {
      hor.dias.forEach((dia) => {
        listaEventos.push({
          resource: { horario: hor, backgroundColor: colors[index] },
          title: `${hor.especialidades.length} espec. e ${hor.colaboradores.length} colab. disponíveis`,
          start: new Date(
            diasSemanaData[dia].setHours(
              parseInt(moment(hor.inicio).format("HH")),
              parseInt(moment(hor.inicio).format("mm"))
            )
          ),
          end: new Date(
            diasSemanaData[dia].setHours(
              parseInt(moment(hor.fim).format("HH")),
              parseInt(moment(hor.fim).format("mm"))
            )
          ),
        });
      });
    });

    return listaEventos;
  }, [horarios]);

  useEffect(() => {
    dispatch(allHorarios());
    dispatch(allServicos());
  }, [dispatch]);

  useEffect(() => {
    if (horario.especialidades) {
      dispatch(filterColaboradores());
    }
  }, [dispatch, horario.especialidades]);

  return (
    <div className="col p-5 overflow-auto h-100">
      <Drawer
        show={components.drawer}
        size="sm"
        onHide={() => setComponents("drawer", false)}
      >
        <Drawer.Body>
          <h3>Criar novo horario de atendimento</h3>
          <div className="row mt-3">
            <TagPickerComponent
              label="Dias da semana"
              value={horario.dias}
              data={diasDaSemana.map((label, value) => ({ label, value }))}
              onChange={(value) => {
                setHorario("dias", value);
              }}
            />
            <DatePickerComponent
              label="Horário Inicial"
              value={horario.inicio}
              onChange={(e) => {
                setHorario("inicio", e);
              }}
            />
            <DatePickerComponent
              label="Horário Final"
              value={horario.fim}
              onChange={(e) => {
                setHorario("fim", e);
              }}
            />
            <TagPickerComponent
              label="Especialidades disponíveis"
              value={horario.especialidades}
              data={servicos}
              onChange={(e) => {
                setHorario("especialidades", e);
              }}
            />
            <TagPickerComponent
              label="Colaboradores disponíveis"
              value={horario.colaboradores}
              data={colaboradores}
              disabled={horario.especialidades.length === 0}
              onChange={(e) => {
                setHorario("colaboradores", e);
              }}
            />
          </div>
          <Button
            loading={form.saving}
            color={behavior === "create" ? "green" : "primary"}
            size="lg"
            block
            onClick={() => save()}
            className="mt-3"
          >
            Salvar Horário de Atendimento
          </Button>
          {behavior === "update" && (
            <Button
              loading={form.saving}
              color="red"
              size="lg"
              block
              onClick={() => setComponents("confirmDelete", true)}
              className="mt-1"
            >
              Remover Horário de Atendimento
            </Button>
          )}
        </Drawer.Body>
      </Drawer>
      <ConfirmDeleteModal
        show={components.confirmDelete}
        saving={form.saving}
        onConfirm={() => remove()}
        onCancel={() => setComponents("confirmDelete", false)}
      />
      <div className="row">
        <div className="col-12">
          <div className="w-100 d-flex justify-content-between">
            <h2 className="mb-4 mt-0">Horarios de Atendimento</h2>
            <div>
              <button
                onClick={() => setComponents("drawer", true)}
                className="btn btn-primary btn-lg"
              >
                <span className="mdi mdi-plus"></span> Novo Horario
              </button>
            </div>
          </div>
          <CustomCalendar
            onEventSelect={(e) => {
              const { horario } = e.resource;
              onHorarioClick(horario);
            }}
            onSlotSelect={(slotInfo) => {
              const { start, end } = slotInfo;
              dispatch(
                updateHorario({
                  horario: {
                    ...horario,
                    dias: [moment(start).day()],
                    inicio: start,
                    fim: end,
                  },
                })
              );
              setComponents("drawer", true);
            }}
            events={formatEventos()}
            date={diasSemanaData[moment().day()]}
            view={components.view}
          />
        </div>
      </div>
    </div>
  );
};

export default HorariosAtendimento;
