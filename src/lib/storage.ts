
import { Chapter, ChatThread, INITIAL_CHAPTERS, INITIAL_TODOS, SAMPLE_CHAT_THREAD, TodoTask } from "./data";

// Local storage keys
const CHAPTERS_KEY = 'formula-ace-chapters';
const CHAT_THREADS_KEY = 'formula-ace-chat-threads';
const TODOS_KEY = 'formula-ace-todos';
const ACTIVE_THREAD_KEY = 'formula-ace-active-thread';

// Get chapters from local storage or use initial data
export const getChapters = (): Chapter[] => {
  const storedChapters = localStorage.getItem(CHAPTERS_KEY);
  if (!storedChapters) {
    localStorage.setItem(CHAPTERS_KEY, JSON.stringify(INITIAL_CHAPTERS));
    return INITIAL_CHAPTERS;
  }
  return JSON.parse(storedChapters);
};

// Save chapters to local storage
export const saveChapters = (chapters: Chapter[]): void => {
  localStorage.setItem(CHAPTERS_KEY, JSON.stringify(chapters));
};

// Add a new chapter
export const addChapter = (chapter: Chapter): void => {
  const chapters = getChapters();
  chapters.push(chapter);
  saveChapters(chapters);
};

// Update an existing chapter
export const updateChapter = (updatedChapter: Chapter): void => {
  const chapters = getChapters();
  const index = chapters.findIndex((chapter) => chapter.id === updatedChapter.id);
  
  if (index !== -1) {
    chapters[index] = updatedChapter;
    saveChapters(chapters);
  }
};

// Delete a chapter
export const deleteChapter = (chapterId: string): void => {
  const chapters = getChapters();
  const filteredChapters = chapters.filter((chapter) => chapter.id !== chapterId);
  saveChapters(filteredChapters);
};

// Get chat threads from local storage or use sample data
export const getChatThreads = (): ChatThread[] => {
  const storedThreads = localStorage.getItem(CHAT_THREADS_KEY);
  if (!storedThreads) {
    localStorage.setItem(CHAT_THREADS_KEY, JSON.stringify([SAMPLE_CHAT_THREAD]));
    return [SAMPLE_CHAT_THREAD];
  }
  return JSON.parse(storedThreads);
};

// Save chat threads to local storage
export const saveChatThreads = (threads: ChatThread[]): void => {
  localStorage.setItem(CHAT_THREADS_KEY, JSON.stringify(threads));
};

// Get active chat thread ID
export const getActiveThreadId = (): string | null => {
  return localStorage.getItem(ACTIVE_THREAD_KEY);
};

// Set active chat thread ID
export const setActiveThreadId = (threadId: string): void => {
  localStorage.setItem(ACTIVE_THREAD_KEY, threadId);
};

// Add a message to a chat thread
export const addMessageToThread = (threadId: string, message: { content: string; isUser: boolean }): void => {
  const threads = getChatThreads();
  const threadIndex = threads.findIndex((thread) => thread.id === threadId);
  
  if (threadIndex !== -1) {
    const newMessage = {
      id: `msg-${Date.now()}`,
      content: message.content,
      isUser: message.isUser,
      timestamp: Date.now()
    };
    
    threads[threadIndex].messages.push(newMessage);
    threads[threadIndex].updatedAt = Date.now();
    
    saveChatThreads(threads);
  }
};

// Create a new chat thread
export const createChatThread = (title: string, initialMessage: string): string => {
  const threads = getChatThreads();
  
  const newThread: ChatThread = {
    id: `thread-${Date.now()}`,
    title,
    messages: [
      {
        id: `msg-${Date.now()}`,
        content: initialMessage,
        isUser: true,
        timestamp: Date.now()
      }
    ],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  
  threads.push(newThread);
  saveChatThreads(threads);
  
  return newThread.id;
};

// Get todos from local storage or use initial data
export const getTodos = (): TodoTask[] => {
  const storedTodos = localStorage.getItem(TODOS_KEY);
  if (!storedTodos) {
    localStorage.setItem(TODOS_KEY, JSON.stringify(INITIAL_TODOS));
    return INITIAL_TODOS;
  }
  return JSON.parse(storedTodos);
};

// Save todos to local storage
export const saveTodos = (todos: TodoTask[]): void => {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
};

// Add a new todo
export const addTodo = (todo: Omit<TodoTask, 'id'>): void => {
  const todos = getTodos();
  const newTodo = {
    ...todo,
    id: `todo-${Date.now()}`
  };
  todos.push(newTodo);
  saveTodos(todos);
};

// Toggle todo completion
export const toggleTodoCompletion = (todoId: string): void => {
  const todos = getTodos();
  const todoIndex = todos.findIndex((todo) => todo.id === todoId);
  
  if (todoIndex !== -1) {
    todos[todoIndex].completed = !todos[todoIndex].completed;
    saveTodos(todos);
  }
};

// Delete a todo
export const deleteTodo = (todoId: string): void => {
  const todos = getTodos();
  const filteredTodos = todos.filter((todo) => todo.id !== todoId);
  saveTodos(filteredTodos);
};

// Get todos for a specific date
export const getTodosForDate = (date: string): TodoTask[] => {
  const todos = getTodos();
  return todos.filter((todo) => todo.date === date);
};
