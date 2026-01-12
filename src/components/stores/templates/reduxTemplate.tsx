
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, reset, incrementByAmount } from '../../../features/counter/counterSlice'
import CounterReducer from '../../../features/counter/counterSlice'
import { useReducer, useState } from 'react'

export function ReduxTemplate() {
  // Redux state
  const count = useSelector((state: { counter: { value: number } }) => state.counter.value)
  const dispatch = useDispatch()

  // Local state using the same reducer logic
  const [localState, localDispatch] = useReducer(CounterReducer, { value: 0 })
  const [amount, setAmount] = useState(5)

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-2xl shadow-xl space-y-8 border border-gray-100">
      {/* Redux Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-600">Redux Global Counter</h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">Store State</span>
        </div>
        
        <div className="flex items-center justify-center space-x-6 py-6 bg-gray-50 rounded-xl">
          <button
            className="w-12 h-12 flex items-center justify-center bg-white border-2 border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all font-bold text-xl shadow-sm"
            onClick={() => dispatch(decrement())}
            aria-label="Decrement"
          >
            -
          </button>
          <span className="text-5xl font-mono font-bold text-gray-800 min-w-[80px] text-center">{count}</span>
          <button
            className="w-12 h-12 flex items-center justify-center bg-white border-2 border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all font-bold text-xl shadow-sm"
            onClick={() => dispatch(increment())}
            aria-label="Increment"
          >
            +
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex space-x-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none transition-colors"
              placeholder="Amount"
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
              onClick={() => dispatch(incrementByAmount(amount))}
            >
              Add {amount}
            </button>
          </div>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            onClick={() => dispatch(reset())}
          >
            Reset Store
          </button>
        </div>
      </section>

      <div className="border-t border-gray-100"></div>

      {/* useReducer Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-purple-600">Local useReducer Counter</h2>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">Local State</span>
        </div>
        <p className="text-gray-500 text-sm italic">
          Supplement: This section uses the same <code className="bg-gray-100 px-1 rounded text-purple-600">CounterReducer</code> logic but manages state locally with <code className="bg-gray-100 px-1 rounded text-purple-600">useReducer</code>.
        </p>

        <div className="flex items-center justify-center space-x-6 py-6 bg-purple-50 rounded-xl border border-purple-100">
          <button
            className="w-10 h-10 flex items-center justify-center bg-white border-2 border-purple-500 text-purple-500 rounded-full hover:bg-purple-500 hover:text-white transition-all font-bold text-lg"
            onClick={() => localDispatch(decrement())}
          >
            -
          </button>
          <span className="text-4xl font-mono font-bold text-gray-800 min-w-[60px] text-center">{localState.value}</span>
          <button
            className="w-10 h-10 flex items-center justify-center bg-white border-2 border-purple-500 text-purple-500 rounded-full hover:bg-purple-500 hover:text-white transition-all font-bold text-lg"
            onClick={() => localDispatch(increment())}
          >
            +
          </button>
        </div>
        
        <div className="text-center">
          <button
            className="text-purple-600 hover:underline text-sm font-medium"
            onClick={() => localDispatch(reset())}
          >
            Reset Local State
          </button>
        </div>
      </section>
    </div>
  )
}