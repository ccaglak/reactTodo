import { useEffect, useReducer, useRef, useState } from 'react';

const initialTodos = JSON.parse(localStorage.getItem('todos')) || [];

const reducer = (state, action) => {
   switch (action.type) {
      case 'ADD_TODO':
         return [
            { id: state.length + 1, title: action.title, complete: false },
            ...state,
         ];

      case 'COMPLETE':
         return state.map((todo) => {
            if (todo.id === action.id) {
               return { ...todo, complete: !todo.complete };
            } else {
               return todo;
            }
         });
      case 'CLEAR':
         return state.filter((todo) => todo.id !== action.id);

      case 'CLEAR_COMPLETED':
         return state.filter((todo) => !todo.complete);

      case 'DELETE_ALL':
         return [];
      default:
         return state;
   }
};

function App() {
   const unfocus = useRef();
   const [todoInput, setTodoInput] = useState('');

   const [todos, dispatch] = useReducer(reducer, initialTodos);
   useEffect(() => {
      localStorage.setItem('todos', JSON.stringify(todos));
   }, [todos]);

   const addTodo = (e) => {
      e.preventDefault();
      if (!todoInput.trim().length) {
         return;
      }
      dispatch({ type: 'ADD_TODO', title: todoInput });
      setTodoInput('');
      unfocus.current.blur();
   };

   const handleComplete = (todo) => {
      dispatch({ type: 'COMPLETE', id: todo.id });
   };
   const clearTodo = (todo) => {
      dispatch({ type: 'CLEAR', id: todo.id });
   };
   const clearCompleted = () => {
      dispatch({ type: 'CLEAR_COMPLETED' });
   };
   const deleteAll = () => {
      dispatch({ type: 'DELETE_ALL' });
   };

   return (
      <div className='flex flex-col mx-auto'>
         <form onSubmit={(e) => addTodo(e)}>
            <input
               ref={unfocus}
               className='border m-5 rounded text-lg'
               onChange={(e) => setTodoInput(e.target.value)}
               type='text'
               value={todoInput}
               placeholder='Whats in your mind?'
            />
         </form>
         <div className='m-3'>
            Todos Completed: {todos.filter((todo) => todo.complete).length}
         </div>
         <ul className='flex flex-col'>
            {todos.map((todo) => (
               <li key={todo.id} className='border-2 p-4'>
                  <div>
                     <label className='flex space-x-2'>
                        <input
                           className='p-5'
                           type='checkbox'
                           checked={todo.complete}
                           onChange={() => handleComplete(todo)}
                        />
                        <span className={todo.complete ? 'line-through' : ''}>
                           {todo.title}
                        </span>
                     </label>
                  </div>
                  <button
                     className='border ml-5 bg-blue-300 rounded p-1'
                     onClick={() => clearTodo(todo)}>
                     Clear
                  </button>
               </li>
            ))}
         </ul>
         <div className='flex space-x-2 mt-5'>
            {todos.some((todo) => todo.complete) && (
               <button
                  className='border rounded bg-blue-400 p-2'
                  onClick={clearCompleted}>
                  Clear Completed
               </button>
            )}
            <button
               className='border rounded bg-blue-400 p-2'
               onClick={deleteAll}>
               Delete All
            </button>
         </div>
      </div>
   );
}

export default App;
