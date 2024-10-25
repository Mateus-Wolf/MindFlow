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
  const [time, setTime] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const usuarioId = localStorage.getItem('usuarioId');
      try {
        const response = await axios.get(`http://localhost:3000/api/pacientes?usuario_id=${usuarioId}`);
        setPatients(response.data);
      } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
      }
    };

    const fetchTotalAppointments = async () => {
      const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      try {
        const response = await axios.get(`http://localhost:3000/api/agendamentos/mensal?mes=${formattedDate}`);

        // Filtrar apenas agendamentos a partir da data atual
        const today = new Date();
        const filteredAppointments = response.data.filter(appt => {
          const appointmentDate = new Date(appt.data);
          return appointmentDate >= today; // Apenas agendamentos de hoje em diante
        });

        setTotalAppointments(filteredAppointments.length);
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
      }
    };

    const fetchRecentPatients = async () => {
      const usuarioId = localStorage.getItem('usuarioId');
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const formattedDate = `${threeMonthsAgo.getFullYear()}-${String(threeMonthsAgo.getMonth() + 1).padStart(2, '0')}-${String(threeMonthsAgo.getDate()).padStart(2, '0')}`;

      try {
        const response = await axios.get(`http://localhost:3000/api/agendamentos/recent-patients?usuario_id=${usuarioId}&from_date=${formattedDate}`);
        setRecentPatients(response.data.slice(0, 5)); // Pegando os últimos 5 pacientes
      } catch (error) {
        console.error('Erro ao carregar pacientes recentes:', error);
      }
    };

    fetchPatients();
    fetchTotalAppointments();
    fetchRecentPatients();
  }, [currentDate]);

  const isBeforeToday = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return day && new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < today;
  };

  const isPastTime = (selectedTime) => {
    const now = new Date();
    const selectedDateTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay, selectedTime.split(':')[0], selectedTime.split(':')[1]);
    return selectedDateTime < now && selectedDay === now.getDate();
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
      const response = await axios.get(`http://localhost:3000/api/agendamentos?data=${formattedDate}&usuario_id=${usuarioId}`);
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
    setTime('');
  };

  const openCreateForm = () => {
    setShowCreateForm(true);
  };

  const renderCalendarDays = () => {
    return generateCalendarDays().map((day, index) => {
      const isDisabled = day && isBeforeToday(day);

      return (
        <div
          key={index}
          className={`calendar-day ${day ? (isDisabled ? 'filled before-today' : 'filled') : 'empty'}`}
          onClick={() => handleDayClick(day)} // Permite clicar em dias antigos
        >
          {day}
        </div>
      );
    });
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  return (
    <div className="app-container">
      <Header />
      <div className="calendar-container">
        <p className="no-appointments">
          {totalAppointments > 0 ? `Você tem ${totalAppointments} agendamentos marcados para este mês.` : 'Você não tem agendamentos marcados para esse mês.'}
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
                    disabled={isBeforeToday(selectedDay)} // Desabilita o botão se o dia selecionado estiver antes de hoje
                  >
                    Criar Agendamento
                  </button>
                  <button className="btn btnCancelar" onClick={closePopup}>Fechar</button>
                </>
              ) : (
                <form id='form-Agendamento-PopUp'>
                  {/* Formulário para criação de agendamento */}
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
