// DOM 요소 가져오기
const todoInput = document.getElementById('todoInput');
const addButton = document.getElementById('addButton');
const pendingList = document.getElementById('pendingList');
const completedList = document.getElementById('completedList');

// localStorage에서 todos 불러오기
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// 페이지 로드 시 저장된 todos 표시
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
});

// 추가 버튼 클릭 이벤트
addButton.addEventListener('click', addTodo);

// Enter 키로도 추가 가능
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Todo 추가 함수
function addTodo() {
    const text = todoInput.value.trim();

    if (text === '') {
        alert('할 일을 입력해주세요!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(todo);
    saveTodos();
    renderTodos();

    // 입력 필드 초기화
    todoInput.value = '';
    todoInput.focus();
}

// Todo 목록 렌더링 함수
function renderTodos() {
    pendingList.innerHTML = '';
    completedList.innerHTML = '';

    // 예정된 할 일과 완료된 할 일 분리
    const pendingTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);

    // 예정 목록 렌더링
    if (pendingTodos.length === 0) {
        pendingList.innerHTML = '<li class="empty-message">예정된 할 일이 없습니다.</li>';
    } else {
        pendingTodos.forEach(todo => {
            const li = createTodoItem(todo);
            pendingList.appendChild(li);
        });
    }

    // 완료 목록 렌더링
    if (completedTodos.length === 0) {
        completedList.innerHTML = '<li class="empty-message">완료된 할 일이 없습니다.</li>';
    } else {
        completedTodos.forEach(todo => {
            const li = createTodoItem(todo);
            completedList.appendChild(li);
        });
    }
}

// Todo 아이템 생성 함수
function createTodoItem(todo) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    if (todo.completed) {
        li.classList.add('completed');
    }

    // 체크박스
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    // 텍스트
    const span = document.createElement('span');
    span.textContent = todo.text;

    // 삭제 버튼
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = '삭제';
    deleteButton.addEventListener('click', () => deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteButton);

    return li;
}

// Todo 완료/미완료 토글 함수
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });

    saveTodos();
    renderTodos();
}

// Todo 삭제 함수
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// localStorage에 저장 함수
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}
