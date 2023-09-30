// ApiRequests.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ApiRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/requests') 
      .then((response) => {
        setRequests(response.data); 
      })
      .catch((error) => {
        console.error('Ошибка при получении данных:', error);
      });
  }, []);

  return (
    <div>
      <h2>Список API запросов</h2>
      <ul>
        {requests.map((request, index) => (
          <li key={index}>
            <strong>Метод:</strong> {request.method}<br />
            <strong>URL:</strong> {request.url}<br />
            <strong>Дата:</strong> {request.date}<br />
            {/* Другие поля из вашего API запроса */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ApiRequests;
