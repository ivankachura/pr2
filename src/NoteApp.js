import React, { useState, useEffect } from 'react'; // Импортируем useEffect из react
import axios from 'axios'; // Импортируем Axios
import './index.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NoteApp() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [assignees, setAssignees] = useState([]); // Добавьте новое состояние для исполнителей
  const [newAssignee, setNewAssignee] = useState(''); // Добавьте состояние для нового исполнителя

  const handleNoteChange = (e) => {
    setNewNote(e.target.value);
  };

  const handleAssigneeChange = (e) => {
    setNewAssignee(e.target.value);
  };

  useEffect(() => {
    // Выполняем GET-запрос к серверу, чтобы получить список задач
    axios
      .get('/api/tasks')
      .then((response) => {
        setNotes(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при получении данных с сервера:', error);
      });
  }, []);

  const addNote = () => {
    if (newNote.trim() !== '') {
      const newTask = {
        text: newNote,
        assignee: newAssignee, // Добавьте информацию об исполнителе
      };
      setNotes([...notes, newTask]);
      setNewNote('');
      setNewAssignee('');
      toast.success('Задача успешно добавлена', {
        className: 'toast-success',
      });
    } else {
      toast.error('Введите текст задачи', { className: 'toast-error' });
    }
  };

  const editNote = (index) => {
    setEditingIndex(index);
    setNewNote(notes[index].text);
    setNewAssignee(notes[index].assignee); // Установите текущего исполнителя для редактирования
  };

  const updateNote = () => {
    if (newNote.trim() !== '') {
      const updatedNotes = [...notes];
      updatedNotes[editingIndex] = {
        text: newNote,
        assignee: newAssignee, // Обновите информацию об исполнителе
      };
      setNotes(updatedNotes);
      setNewNote('');
      setNewAssignee('');
      setEditingIndex(null);
      toast.success('Задача успешно обновлена', {
        className: 'toast-success',
      });
    } else {
      toast.error('Введите текст задачи', { className: 'toast-error' });
    }
  };

  const deleteNote = (index) => {
    const confirmation = window.confirm('Вы уверены, что хотите удалить эту задачу?');
    if (confirmation) {
      const updatedNotes = [...notes];
      updatedNotes.splice(index, 1);
      setNotes(updatedNotes);
      toast.success('Задача успешно удалена', {
        className: 'toast-success',
      });
    }
  };

  return (
    <div className="container">
      <h1>Создание задач</h1>
      <div className="note-input">
        <input
          type="text"
          placeholder="Добавить задачу"
          value={newNote}
          onChange={handleNoteChange}
        />
        <input
          type="text"
          placeholder="Исполнитель"
          value={newAssignee}
          onChange={handleAssigneeChange}
        />
        {editingIndex !== null ? (
          <button className="update-button" onClick={updateNote}>
            Сохранить
          </button>
        ) : (
          <button className="add-button" onClick={addNote}>
            Создать
          </button>
        )}
      </div>
      <ul>
        {notes.map((note, index) => (
          <li key={index}>
            <div>
              <strong>Задача:</strong> {note.text}
            </div>
            <div>
              <strong>Исполнитель:</strong> {note.assignee}
            </div>
            <div>
              {editingIndex !== index && (
                <button className="edit-button" onClick={() => editNote(index)}>
                  Редактировать
                </button>
              )}
              <button className="delete-button" onClick={() => deleteNote(index)}>
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default NoteApp;
