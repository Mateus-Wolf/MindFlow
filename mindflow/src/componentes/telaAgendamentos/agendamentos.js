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

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/pacientes');
        setPatients(response.data);
      } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
      }
    };

    const fetchTotalAppointments = async () => {
      const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      try {
        const response = await axios.get(`http://localhost:3000/api/agendamentos/mensal?mes=${formattedDate}`);
        setTotalAppointments(response.data.length);
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
      }
    };

    fetchPatients();
    fetchTotalAppointments();
  }, [currentDate]);

  const isBeforeToday = (day) => {
    return day && new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < new Date();
  };

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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
      const response = await axios.get(`http://localhost:3000/api/agendamentos?data=${formattedDate}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }

    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedDay(null);
    setAppointments([]);
    setShowCreateForm(false);
    setSelectedPatient('');
    setDescription('');
  };

  const openCreateForm = () => {
    setShowCreateForm(true);
  };

  const handleCreateAppointment = async () => {
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    const newAppointment = {
      paciente_id: selectedPatient,
      data: formattedDate,
      descricao: description,
      usuario_id: 1,
      registro_humor_id: null
    };

    try {
      await axios.post('http://localhost:3000/api/agendamentos', newAppointment);
      Swal.fire('Agendamento criado com sucesso!', '', 'success');
      closePopup();
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      Swal.fire('Erro ao criar agendamento. Por favor, tente novamente.', '', 'error');
    }
  };

  const renderCalendarDays = () => {
    const today = new Date();

    return generateCalendarDays().map((day, index) => {
      const isBeforeToday = day && new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < today;

      return (
        <div
          key={index}
          className={`calendar-day ${day ? (isBeforeToday ? 'filled before-today' : 'filled') : 'empty'}`}
          onClick={() => day && handleDayClick(day)}
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

        <p className="no-appointments">
          {totalAppointments > 0 ? `Você tem ${totalAppointments} agendamentos marcados para este mês.` : 'Você não tem agendamentos marcados para esse mês.'}
        </p>
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
                      {appt.time} {patient ? patient.nome : 'Paciente não encontrado'}
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
                    disabled={selectedDay && new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay) < new Date()}
                  >
                    Criar Agendamento
                  </button>
                  <button className="btn btnCancelar" onClick={closePopup}>Fechar</button>
                </>
              ) : (
                <form id='form-Agendamento-PopUp'>
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
                      type='time'>
                    </input>
                  </div>
                  <div className="form-group">
                    <label>Descrição</label>
                    <textarea
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder='Adicione uma descrição para este agendamento'
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
