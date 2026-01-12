import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

// Types
interface Todo {
  id: number;
  text: string;
  isComplete: boolean;
}

// 1. Text State
export const textState = atom<string>({
  key: 'recoil_textState', // Prefixed to ensure uniqueness
  default: '',
});

// 2. Character Count Selector
export const charCountState = selector<number>({
  key: 'recoil_charCountState',
  get: ({get}) => {
    const text = get(textState);
    return text.length;
  },
});

// 3. Todo List State
export const todoListState = atom<Todo[]>({
  key: 'recoil_todoListState',
  default: [
    { id: 1, text: 'Learn Recoil Atoms', isComplete: true },
    { id: 2, text: 'Master Recoil Selectors', isComplete: false },
    { id: 3, text: 'Implement Multi-state Dashboard', isComplete: false },
  ],
});

// 4. UI Theme State
export const fontSizeState = atom<number>({
  key: 'recoil_fontSizeState',
  default: 16,
});

export function RecoilTemplate() {
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const [text, setText] = useRecoilState(textState);
  const count = useRecoilValue(charCountState);
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);

  const toggleTodo = (id: number) => {
    setTodoList((oldTodoList) => 
      oldTodoList.map(todo => 
        todo.id === id ? { ...todo, isComplete: !todo.isComplete } : todo
      )
    );
  };

  return (
    <div className="p-8 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Text Input Section */}
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-4">
          <h3 className="text-lg font-bold text-blue-700 flex items-center">
            <span className="mr-2">📝</span> Interactive Text
          </h3>
          <div className="space-y-2">
            <input 
              type="text" 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              style={{ fontSize: `${fontSize}px` }}
              className="w-full px-4 py-2 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
              placeholder="Type to see Recoil in action..."
            />
            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-600 font-medium italic">Echo: {text || '...'}</span>
              <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                Length: {count}
              </span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-blue-100">
            <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
              Font Size: {fontSize}px
            </label>
            <input 
              type="range" 
              min="12" 
              max="32" 
              value={fontSize} 
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full h-1.5 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        {/* Todo List Section */}
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-4">
          <h3 className="text-lg font-bold text-emerald-700 flex items-center">
            <span className="mr-2">✅</span> Tasks (Atom Array)
          </h3>
          <ul className="space-y-3">
            {todoList.length > 0 ? (
              todoList.map((todo) => (
                <li 
                  key={todo.id} 
                  className="flex items-center p-3 bg-white rounded-xl shadow-sm border border-emerald-50 hover:border-emerald-200 transition-colors cursor-pointer group"
                  onClick={() => toggleTodo(todo.id)}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-all ${
                    todo.isComplete 
                      ? 'bg-emerald-500 border-emerald-500' 
                      : 'border-gray-300 group-hover:border-emerald-400'
                  }`}>
                    {todo.isComplete && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`flex-1 font-medium transition-all ${
                    todo.isComplete ? 'line-through text-gray-400' : 'text-gray-700'
                  }`}>
                    {todo.text}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-center py-4 text-emerald-400 italic">No tasks found</li>
            )}
          </ul>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-gray-900 text-gray-400 p-4 rounded-xl font-mono text-xs">
        <p>// Recoil State Debugger</p>
        <p className="text-emerald-400">todoListState: {JSON.stringify(todoList)}</p>
        <p className="text-blue-400">textState: "{text}"</p>
      </div>
    </div>
  );
}