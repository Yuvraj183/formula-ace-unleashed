
import { useState, useEffect } from "react";
import { format, addDays, subDays, startOfWeek, parseISO, isToday } from "date-fns";
import { Calendar as CalendarIcon, Trash2, Check, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TodoTask } from "@/lib/data";
import { addTodo, deleteTodo, getTodosForDate, toggleTodoCompletion, saveTodos, getTodos } from "@/lib/storage";
import FlipClock from "./FlipClock";

const TodoList = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [todos, setTodos] = useState<TodoTask[]>([]);
  const [newTodoText, setNewTodoText] = useState("");

  // Format the date to YYYY-MM-DD for storage
  const formattedDate = selectedDate.toISOString().split("T")[0];

  useEffect(() => {
    // Load todos for the selected date
    const loadedTodos = getTodosForDate(formattedDate);
    setTodos(loadedTodos);
  }, [selectedDate, formattedDate]);

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;
    
    const newTodo = {
      text: newTodoText,
      completed: false,
      date: formattedDate
    };
    
    addTodo(newTodo);
    setNewTodoText("");
    
    // Refresh todos
    setTodos(getTodosForDate(formattedDate));
  };
  
  const handleToggleTodo = (id: string) => {
    toggleTodoCompletion(id);
    // Refresh todos
    setTodos(getTodosForDate(formattedDate));
  };
  
  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
    // Refresh todos
    setTodos(getTodosForDate(formattedDate));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h3 className="font-semibold text-lg mb-3">Select Date</h3>
            <div className="flex flex-col space-y-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(subDays(selectedDate, 1))}
                >
                  Previous Day
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                >
                  Next Day
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(new Date())}
              >
                Today
              </Button>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-2xl shadow-lg p-6 border border-primary/20">
            <h3 className="font-bold text-xl mb-4 text-primary text-center">Current Time</h3>
            <div className="py-4">
              <FlipClock />
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-bold text-2xl mb-6 text-primary">
              Tasks for {format(selectedDate, "MMMM d, yyyy")}
            </h2>
            
            <div className="flex gap-3 mb-6">
              <Input
                placeholder="Add a new task..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
              />
              <Button onClick={handleAddTodo} disabled={!newTodoText.trim()}>
                Add Task
              </Button>
            </div>
            
            <div className="space-y-3">
              {todos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No tasks for this day</p>
                  <p className="text-sm">Add a task to get started</p>
                </div>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      todo.completed ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleTodo(todo.id)}
                        className={`h-5 w-5 rounded border flex items-center justify-center ${
                          todo.completed
                            ? "bg-green-500 border-green-600 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {todo.completed && <Check className="h-4 w-4" />}
                      </button>
                      <span
                        className={`${
                          todo.completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;

