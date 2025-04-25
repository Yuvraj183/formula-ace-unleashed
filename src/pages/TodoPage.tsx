
import Header from "@/components/Header";
import TodoList from "@/components/TodoList";

const TodoPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1">
        <TodoList />
      </div>
    </div>
  );
};

export default TodoPage;
