import React, { useState } from 'react';
import Header from '../telaHome/header';

const Agendamentos = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [appointments, setAppointments] = useState([]); // Para armazenar os agendamentos do dia selecionado

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

    let daysArray = [];
    for (let i = 0; i < firstDay; i++) {
      daysArray.push('');
    }

    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(day);
    }

    return daysArray;
  };

  const handleDayClick = (day) => {
    // Aqui você pode buscar os agendamentos do dia específico
    // Simulando a busca de agendamentos
    const fakeAppointments = [
      { time: "10:00 AM", description: "Consulta com o médico" },
      { time: "2:00 PM", description: "Reunião" }
    ];
    
    // Definindo o dia selecionado e os agendamentos
    setSelectedDay(day);
    setAppointments(fakeAppointments); // Substitua por uma chamada real para buscar agendamentos
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedDay(null);
    setAppointments([]);
  };

  const renderCalendarDays = () => {
    const daysArray = generateCalendarDays();

    return daysArray.map((day, index) => (
      <div
        key={index}
        className={`calendar-day ${day ? 'filled' : 'empty'}`}
        onClick={() => day && handleDayClick(day)} // Apenas adiciona o evento se o dia não estiver vazio
      >
        {day}
      </div>
    ));
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
        
        <p className="no-appointments">Você não tem agendamentos marcados para esse mês</p>
      </div>

      {popupVisible && (
        <div className="popup">
          <div className="popup-content">
            <h3>Agendamentos para {selectedDay}/{currentDate.getMonth() + 1}/{currentDate.getFullYear()}</h3>
            {appointments.length > 0 ? (
              <ul>
                {appointments.map((appt, index) => (
                  <li key={index}>{appt.time} - {appt.description}</li>
                ))}
              </ul>
            ) : (
              <p>Não há agendamentos para este dia.</p>
            )}
            <button onClick={closePopup}>Criar Agendamento</button>
            <button onClick={closePopup}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agendamentos;
