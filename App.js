import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux';

// Actions
const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
        case 'TOGGLE_TODO':
            if(state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                completed: !state.completed
            };
        default:
            return state;
    }
};

// Reducers
const todos = (
    state = [],
    action
) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ];
            break;
        case 'TOGGLE_TODO':
            return state.map(t =>
                todo(t, action)
            );
            break;
        default:
            return state;
    }
};

const visibilityFilter = (
    state = 'SHOW_ALL',
    action
) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
            break;
        default:
            return state;
    }
};

const todoApp = combineReducers({
    todos,
    visibilityFilter
});
const store = createStore(todoApp);

const FilterLink = ({
    filter,
    currentFilter,
    children,
    onclick
}) => {
    if(filter === currentFilter) {
        return <span>{children}</span>
    }

    return (
        <a href="#"
            onClick={e => {
                e.preventDefault();
                onClick(filter);
            }}>{children}</a>
    );
};

const Footer = ({
    visibilityFilter,
    onFilterClick
}) => (
    <p>Show:
    {' '}
    <FilterLink
        filter='SHOW_ALL'
        currentFilter={visibilityFilter}
        onClick={onFilterClick}>All</FilterLink>
    {', '}
    <FilterLink
        filter='SHOW_ACTIVE'
        currentFilter={visibilityFilter}
        onClick={onFilterClick}
        >Active</FilterLink>
    {', '}
    <FilterLink
        filter='SHOW_COMPLETED'
        currentFilter={visibilityFilter}
        onClick={onFilterClick}
        >Completed</FilterLink>
    </p>
);

const Todo = ({
    onClick,
    completed,
    text
}) => (
    <li onClick={onClick}
        style={{
            textDecoration:
                todo.completed ? 'line-through' : 'none'
        }}>{text}</li>
);

const TodoList = ({
    todos,
    onTodoClick
}) => (
    <ul>
        {todos.map(todo =>
            <Todo
                key={todo.id}
                {...todo}
                onClick={() => onTodoClick(todo.id)}
                />
        )}
    </ul>
);

const AddTodo = ({
    onAddClick
}) => {
    let input;
    return (
        <div>
            <input type="text" ref={node => {
                input = node;
            }} />
            <button onClick={() => {
                onAddClick(input.value);
                input.value = '';
            }}>Add todo</button>
        </div>
    );
};

const getVisibleTodos = (
    todos,
    filter
) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
            break;
        case 'SHOW_ACTIVE':
            return todos.filter(t => !t.completed);
            break;
        case 'SHOW_COMPLETED':
            return todos.filter(t => t.completed);
            break;
    }
};


let todoId = 0;
export class App extends React.Component {
    render() {
        const {
            todos,
            visibilityFilter
        } = this.props;
        const visibleTodos = getVisibleTodos(
            this.props.todos,
            this.props.visibilityFilter
        );
        return (
            <div>
                <AddTodo
                    onAddClick={text => {
                        store.dispatch({
                            type: 'ADD_TODO',
                            id: todoId++,
                            text
                        })
                    }}
                />
                <TodoList
                    todos={visibleTodos}
                    onTodoClick={id =>
                        store.dispatch({
                            type: 'TOGGLE_TODO',
                            id
                        })
                    } />
                <Footer
                    visibilityFilter={visibilityFilter}
                    onFilterClick={filter => {
                        store.dispatch({
                            type: 'SET_VISIBILITY_FILTER',
                            filter
                        })
                    }} />
            </div>
        );
    };
}

const render = () => {
    ReactDOM.render(
        <App {...store.getState()} />,
        document.getElementById('root')
    );
};

store.subscribe(render);
render();
