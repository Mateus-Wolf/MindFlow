import React, { useState, useEffect } from 'react';
import Header from '../telaHome/header';
import axios from 'axios';
import Swal from 'sweetalert2';

const Agendamentos = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [description, setDescription] = useState('');
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [time, setTime] = useState('');
  const [openAppointments, setOpenAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const usuarioId = localStorage.getItem('usuarioId');
      const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      
      try {
        // Buscar agendamentos
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/agendamentos/mensal/${usuarioId}`, {
          params: { mes: formattedDate }
        });
  
        // Filtrar os agendamentos para pegar apenas os que têm status_id = 1 (Em Aberto)
        const openAppointments = response.data.filter(appointment => appointment.status_id === 1);
        setOpenAppointments(openAppointments);
        
        // Atualiza a quantidade total de agendamentos em aberto
        setTotalAppointments(openAppointments.length);
  
        // Buscar pacientes
        const patientsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/pacientes`, {
          params: { usuario_id: usuarioId }
        });
        setPatients(patientsResponse.data); // Atualizar o estado com os pacientes
      } catch (error) {
        console.error('Erro ao carregar agendamentos ou pacientes:', error);
      }
    };
  
    fetchAppointments();
  }, [currentDate]);
  

  const isBeforeToday = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate());
    return day && new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < yesterday;
  };

  const isPastTime = (selectedTime) => {
    const now = new Date();
    const selectedDateTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay, selectedTime.split(':')[0], selectedTime.split(':')[1]);
    return selectedDateTime < now && selectedDay === now.getDate(); // Verifica se a hora é no mesmo dia e já passou
  };

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let daysArray = Array(firstDay).fill('');
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(day);
    }

    return daysArray;
  };

  const handleDayClick = async (day) => {
    setSelectedDay(day);
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    try {
      const usuarioId = localStorage.getItem('usuarioId');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/agendamentos?data=${formattedDate}&usuario_id=${usuarioId}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }

    setPopupVisible(true);
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/agendamentos/${appointmentId}/cancelar`);
      Swal.fire('Agendamento cancelado com sucesso!', '', 'success');

      await fetchAppointmentsForSelectedDay(selectedDay);
    } catch (error) {
      console.error('Erro ao cancelar o agendamento:', error);
      Swal.fire('Erro ao cancelar o agendamento. Por favor, tente novamente.', '', 'error');
    }
  };

  const fetchAppointmentsForSelectedDay = async (day) => {
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    try {
      const usuarioId = localStorage.getItem('usuarioId');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/agendamentos?data=${formattedDate}&usuario_id=${usuarioId}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedDay(null);
    setAppointments([]);
    setShowCreateForm(false);
    setSelectedPatient('');
    setDescription('');
    setTime('');
  };

  const openCreateForm = () => {
    setShowCreateForm(true);
  };

  const handleCreateAppointment = async () => {
    if (!selectedPatient || !time || !description) {
      Swal.fire('Erro', 'Por favor, preencha todos os campos antes de salvar o agendamento!', 'error');
      return;
    }

    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    const usuarioId = localStorage.getItem('usuarioId');

    const newAppointment = {
      paciente_id: selectedPatient,
      data: formattedDate,
      hora: time,
      descricao: description,
      usuario_id: usuarioId,
      registro_humor_id: null
    };

    // Validação para impedir agendamento em hora já passada
    if (selectedDay === new Date().getDate() && isPastTime(time)) {
      Swal.fire('Erro', 'Você não pode agendar uma hora que já passou!', 'error');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/agendamentos`, newAppointment);
      Swal.fire('Agendamento criado com sucesso!', '', 'success');
      closePopup();
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      Swal.fire('Erro ao criar agendamento. Por favor, tente novamente.', '', 'error');
    }
  };

  const renderCalendarDays = () => {
    return generateCalendarDays().map((day, index) => {
        const isDisabled = day && isBeforeToday(day);
        const isPast = day && (new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < new Date());
        const hasOpenAppointment = openAppointments.some(appointment => new Date(appointment.data).getDate() === day);

        return (
            <div
                key={index}
                className={`calendar-day ${day ? (isDisabled ? 'filled before-today' : isPast ? 'filled past-day' : 'filled') : 'empty'} ${hasOpenAppointment ? 'open-appointment' : ''}`}
                onClick={() => handleDayClick(day)}
            >
                {day}
            </div>
        );
    });
};



  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="app-container">
      <Header />
      <div className="calendar-container">
        <p className="no-appointments">
          {totalAppointments > 0 ? `Você tem ${totalAppointments} consultas agendadas para este mês.` : 'Você não tem consultas agendadas para esse mês.'}
        </p>
        <div className="calendar-header">
          <button onClick={handlePrevMonth}>&lt;</button>
          <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button onClick={handleNextMonth}>&gt;</button>
        </div>

        <div className="calendar-days-of-week">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="day-of-week">{day}</div>
          ))}
        </div>

        <div className="calendar-days">
          {renderCalendarDays()}
        </div>
      </div>

      {popupVisible && (
        <div className="popup">
          <div className="popup-content">
            <h3>Agendamentos para {selectedDay}/{currentDate.getMonth() + 1}/{currentDate.getFullYear()}</h3>
            <hr />
            {appointments.length > 0 ? (
              <ul>
                {appointments.map((appt, index) => {
                  const patient = patients.find(patient => patient.id === appt.paciente_id);
                  return (
                    <li id='agendamentosDoDia' key={index}>
                      {appt.hora} - {patient ? patient.nome : 'Paciente não encontrado'}
                      {!isBeforeToday(selectedDay) && appt.status_id !== 3 && (
                        <button
                          onClick={() => handleCancelAppointment(appt.id)}
                          className="cancel-button"
                        >
                          X
                        </button>
                      )}
                      <hr />
                    </li>
                  );
                })}

              </ul>
            ) : (
              <p>Não há agendamentos para este dia.</p>
            )}

            <div className="popup-buttons">
              {!showCreateForm ? (
                <>
                  <button
                    className="btn btnCriar"
                    onClick={openCreateForm}
                    disabled={selectedDay && isBeforeToday(selectedDay)} // Desabilitar o botão se o dia estiver antes de hoje - 1
                  >
                    Criar Agendamento
                  </button>
                  <button className="btn btnCancelar" onClick={closePopup}>Fechar</button>
                </>
              ) : (
                <form id='form-Agendamento-PopUp' className="create-form-animate">
                  <div className="form-group">
                    <label>Paciente</label>
                    <select
                      className="form-control"
                      value={selectedPatient}
                      onChange={(e) => setSelectedPatient(e.target.value)}
                    >
                      <option value="">Selecione o paciente</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Data</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`${selectedDay}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label>Hora</label>
                    <input
                      type='time'
                      className="form-control"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Descrição</label>
                    <textarea
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="popup-buttons">
                    <button
                      type="button"
                      className="btn btnCriar"
                      onClick={handleCreateAppointment}
                    >
                      Salvar Agendamento
                    </button>
                    <button className="btn btnCancelar" onClick={closePopup}>Cancelar</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agendamentos;
