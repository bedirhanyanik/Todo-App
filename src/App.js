import React, { useState, useEffect } from 'react';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(todo.id, editText.trim());
    setIsEditing(false);
  };

  return (
    <li className={`${todo.done ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
        />
        <label onDoubleClick={() => setIsEditing(true)}>{todo.text}</label>
        <button className="destroy" onClick={() => onDelete(todo.id)}></button>
      </div>
      {isEditing && (
        <form onSubmit={handleSubmit}>
          <input
            className="edit"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSubmit}
            autoFocus
          />
        </form>
      )}
    </li>
  );
};

const TodoMVC = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    setTodos(storedTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text) => {
    if (text.trim()) {
      setTodos([...todos, { id: Date.now(), text, done: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id, newText) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.done));
  };

  const toggleAll = () => {
    const areAllMarked = todos.every(todo => todo.done);
    setTodos(todos.map(todo => ({ ...todo, done: !areAllMarked })));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.done;
    if (filter === 'completed') return todo.done;
    return true;
  });

  const activeTodoCount = todos.filter(todo => !todo.done).length;

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <form onSubmit={(e) => { e.preventDefault(); addTodo(newTodo); }}>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            autoFocus
          />
        </form>
      </header>
      {todos.length > 0 && (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={toggleAll}
            checked={activeTodoCount === 0}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleAll}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
          </ul>
        </section>
      )}
      {todos.length > 0 && (
        <footer className="footer">
          <span className="todo-count">
            <strong>{activeTodoCount}</strong> {activeTodoCount === 1 ? 'item' : 'items'} left
          </span>
          <ul className="filters">
            <li>
              <a
                className={filter === 'all' ? 'selected' : ''}
                onClick={() => setFilter('all')}
              >
                All
              </a>
            </li>
            <li>
              <a
                className={filter === 'active' ? 'selected' : ''}
                onClick={() => setFilter('active')}
              >
                Active
              </a>
            </li>
            <li>
              <a
                className={filter === 'completed' ? 'selected' : ''}
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </li>
          </ul>
          {todos.some(todo => todo.done) && (
            <button className="clear-completed" onClick={clearCompleted}>
              Clear completed
            </button>
          )}
        </footer>
      )}
    </section>
  );
};

export default TodoMVC;