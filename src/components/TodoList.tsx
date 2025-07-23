import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [celebratingId, setCelebratingId] = useState<string | null>(null);
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
        title: "✨ Task added!",
        description: "Your new task has been added to the list.",
      });
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const updatedTodo = { 
          ...todo, 
          completed: !todo.completed,
          completedAt: !todo.completed ? new Date() : undefined
        };
        
        // Trigger celebration animation if completing
        if (!todo.completed) {
          setCelebratingId(id);
          setTimeout(() => setCelebratingId(null), 800);
          
          toast({
            title: "🎉 Task completed!",
            description: "Great job! Keep up the momentum!",
          });
        }
        
        return updatedTodo;
      }
      return todo;
    }));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: "🗑️ Task deleted",
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
      <div className="text-center mb-8 animate-slide-down">
        <div className="inline-flex items-center gap-2 mb-2">
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 bg-clip-text text-transparent">
            Todo List
          </h1>
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground mb-4">
          Stay organized and get things done ✨
        </p>
        {totalCount > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-glass border border-white/10 shadow-glass">
            <div className="w-2 h-2 rounded-full bg-pastel-green animate-pulse"></div>
            <span className="text-sm text-foreground">
              {completedCount} of {totalCount} tasks completed
            </span>
          </div>
        )}
      </div>

      {/* Add Todo Form */}
      <Card className="p-6 mb-6 bg-white/30 backdrop-blur-glass border border-white/20 shadow-glass animate-slide-down">
        <div className="flex gap-3">
          <Input
            placeholder="✨ What magical task needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-white/50 border-white/30 placeholder:text-foreground/60"
          />
          <Button 
            onClick={addTodo}
            className="px-6 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 shadow-soft"
            disabled={!newTodo.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Todo List */}
      <div className="space-y-3">
        {todos.length === 0 ? (
          <Card className="p-8 text-center bg-white/20 backdrop-blur-glass border border-white/10 shadow-glass animate-slide-down">
            <div className="text-muted-foreground">
              <div className="text-6xl mb-4 animate-pulse">✨</div>
              <p className="text-lg">No tasks yet. Add one above to get started!</p>
              <p className="text-sm mt-2 opacity-70">Your productivity journey begins here</p>
            </div>
          </Card>
        ) : (
          todos.map((todo, index) => (
            <Card 
              key={todo.id} 
              className={`
                p-4 transition-all duration-300 hover:shadow-glass transform hover:scale-[1.02]
                bg-white/25 backdrop-blur-glass border border-white/15 shadow-soft
                ${celebratingId === todo.id ? 'animate-celebration' : ''}
                ${todo.completed ? 'bg-gradient-to-r from-pastel-green/30 to-pastel-blue/30' : ''}
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="transition-all duration-300"
                  />
                  {celebratingId === todo.id && (
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="w-4 h-4 text-pastel-yellow animate-sparkle" />
                    </div>
                  )}
                </div>
                <span 
                  className={`flex-1 transition-all duration-300 ${
                    todo.completed 
                      ? 'line-through text-muted-foreground animate-completion-pulse' 
                      : 'text-foreground'
                  }`}
                >
                  {todo.text}
                </span>
                {todo.completed && (
                  <span className="text-xs px-2 py-1 rounded-full bg-pastel-green/30 text-success border border-pastel-green/50">
                    ✓ Done
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/20 transition-all duration-200 hover:scale-110"
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
        <div className="mt-8 text-center animate-slide-down">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/20 backdrop-blur-glass border border-white/10 shadow-glass">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pastel-blue"></div>
              <span className="text-sm text-foreground">Total: {totalCount}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pastel-green"></div>
              <span className="text-sm text-foreground">Completed: {completedCount}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pastel-purple"></div>
              <span className="text-sm text-foreground">Remaining: {totalCount - completedCount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;