import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const { toast } = useToast();

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
      toast({
        title: "Task added!",
        description: "Your new task has been added to the list.",
      });
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
          Todo List
        </h1>
        <p className="text-muted-foreground">
          Stay organized and get things done
        </p>
        {totalCount > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            {completedCount} of {totalCount} tasks completed
          </div>
        )}
      </div>

      {/* Add Todo Form */}
      <Card className="p-4 mb-6 shadow-soft">
        <div className="flex gap-2">
          <Input
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={addTodo}
            className="px-4"
            disabled={!newTodo.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Todo List */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              <div className="text-4xl mb-2">✨</div>
              <p>No tasks yet. Add one above to get started!</p>
            </div>
          </Card>
        ) : (
          todos.map((todo) => (
            <Card 
              key={todo.id} 
              className="p-4 transition-all duration-200 hover:shadow-soft"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                />
                <span 
                  className={`flex-1 transition-all duration-200 ${
                    todo.completed 
                      ? 'line-through text-muted-foreground' 
                      : 'text-foreground'
                  }`}
                >
                  {todo.text}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Stats */}
      {totalCount > 0 && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-4 text-sm text-muted-foreground">
            <span>Total: {totalCount}</span>
            <span>•</span>
            <span>Completed: {completedCount}</span>
            <span>•</span>
            <span>Remaining: {totalCount - completedCount}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;