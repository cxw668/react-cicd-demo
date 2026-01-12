import { Provider as ReduxProvider } from "react-redux"
import { RecoilRoot } from "recoil"
import { useState } from "react"
import store from './store/redux'
import { UseReducerTemplate } from "./components/stores/templates/useReducerTemplate"
import { ReduxTemplate } from "./components/stores/templates/reduxTemplate"
import { ZustandTemplate } from "./components/stores/templates/zustandTemplate"
import { JotaiTemplate } from "./components/stores/templates/jotaiTemplate"
import { MobxTemplate } from "./components/stores/templates/mobxTemplate"
import { RecoilTemplate } from "./components/stores/templates/recoilTemplate"

type StoreType = 'useReducer' | 'Redux' | 'Zustand' | 'Jotai' | 'MobX' | 'Recoil'

function App() {
  const [activeStore, setActiveStore] = useState<StoreType>('Redux')

  const stores = [
    { id: 'useReducer', name: 'useReducer', component: <UseReducerTemplate />, color: 'gray' },
    { id: 'Redux', name: 'Redux', component: <ReduxTemplate />, color: 'blue' },
    { id: 'Zustand', name: 'Zustand', component: <ZustandTemplate />, color: 'amber' },
    { id: 'Jotai', name: 'Jotai', component: <JotaiTemplate />, color: 'indigo' },
    { id: 'MobX', name: 'MobX', component: <MobxTemplate />, color: 'orange' },
  ]

  return (
    <RecoilRoot>
      <ReduxProvider store={store}>
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-64 bg-white border-r border-gray-200   p-6 flex flex-col space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Store Lab</h1>
              <p className="text-sm text-gray-500 mt-1">State Management Comparison</p>
            </div>
            
            <nav className="flex-1 space-y-1">
              {stores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => setActiveStore(store.id as StoreType)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                    activeStore === store.id
                      ? `bg-${store.color}-50 text-${store.color}-700 border-2 border-${store.color}-200`
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {store.name}
                </button>
              ))}
            </nav>

            <div className="pt-6 border-t border-gray-100 text-xs text-gray-400">
              React CICD Demo v1.0
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-10 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  {stores.find(s => s.id === activeStore)?.name} Example
                </h2>
                <p className="text-gray-500 mt-2">
                  Exploring the implementation of {activeStore} in a React application.
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[600px]">
                {stores.find(s => s.id === activeStore)?.component}
              </div>
            </div>
          </main>
        </div>
      </ReduxProvider>
    </RecoilRoot>
  )
}

export default App
