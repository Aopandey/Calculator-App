// Import React hooks and components
import { useReducer } from "react"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import "./styles.css" // importing CSS for styling

// Actions that can happen in the app
export const actions = {
  add_digit: 'add_digit',
  choose_operand: 'choose_operand',
  clear: 'clear',
  delete: 'delete',
  evaluate: 'evaluate'
}
// Reducer function to handle state changes based on actions
function reducer(state, {type, payload }) {
  switch(type){
    case actions.add_digit:
      // Prevents adding more digits if overwrite flag is set or handles leading zeros and decimal points
      if(state.overwrite){
        return{
          ...state, // Spreads the current state to maintain other state properties
          currentOperand: payload.digit,
          overwrite: false, // Resets overwrite flag if previously set
        }
      }
      if(payload.digit === "0" && state.currentOperand === "0"){
         return state
      }
      if(payload.digit === "." && state.currentOperand.includes(".")){
         return state
      }

      return{
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
    case actions.choose_operand:
      // Handles operation selection and prepares operands for calculation
      if(state.currentOperand == null && state.oldOperand != null)  {
        return { 
          ...state, operation: payload.operation 
        };
      }

      if(state.oldOperand == null){
        return{
          ...state,
          operation: payload.operation,
          oldOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return{
        ...state,
        oldOperand: calculate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case actions.clear:
      // Resets the calculator to its initial state
      return {}
    case actions.delete_digit:
      // Removes the last digit from the currentOperand
      // Resets currentOperand if it's the only digit
      if(state.overwrite){
        return{
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }  
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1){
        return {
          ...state,
          currentOperand: null
        };
      }

      return{
        ...state,
        currentOperand: state.currentOperand.slice(0,-1),
      };  
  
    case actions.evaluate:
      // Calculates the current expression and updates the state accordingly
      if(state.operation == null || state.currentOperand == null || state.oldOperand == null) {
        return state;
      }
      return{
        ...state,
        overwrite: true,
        oldOperand: null,
        operation: null,
        currentOperand: calculate(state),
      };
  }
}

// Calculates the result of the current expression
function calculate({ currentOperand, oldOperand, operation}) {
   // Convert string operands to numbers
  const old = parseFloat(oldOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(old) || isNaN(current)) return ""

  // Perform calculation based on the operation
  let computation = ""
  switch(operation){
    case"+":
      computation = old + current
      break
    case"-":
      computation = old - current
      break
    case"x":
      computation = old * current
      break  
    case"÷":
      computation = old / current
      break  
  }
  return computation.toString() // Return result as a string
}

// Formats operand for display (e.g., adds commas for thousands)
const integer_formatter = new Intl.NumberFormat("en-us",{ maximumFractionDigits: 0,});
function formatOperand(operand){
  if(operand == null) return 
  const [integer, decimal] = operand.split('.')
  if(decimal == null) return integer_formatter.format(integer)
  return `${integer_formatter.format(integer)}.${decimal}`
}

// Main App component that renders the calculator UI
function App(){
  // Initialize state with useReducer
  const [{ currentOperand, oldOperand, operation}, dispatch] = useReducer(reducer,{
    currentOperand: null,
    oldOperand: null,
    operation: null,
  })
  // Render calculator grid and buttons
  return (
      <div className="calculator_grid">
          <div className="output">
              <div className="old_operand">{formatOperand(oldOperand)} {operation}</div>
              <div className="current_operand">{formatOperand(currentOperand)}</div>
          </div>
          <button className="two_col" onClick={() => dispatch({ type: actions.delete_digit})}>Clear</button>
          <button onClick={() => dispatch({ type: actions.clear})}>Delete</button>
          <OperationButton operation="÷" dispatch={dispatch} /> 
          <DigitButton digit="1" dispatch={dispatch} /> 
          <DigitButton digit="2" dispatch={dispatch} /> 
          <DigitButton digit="3" dispatch={dispatch} /> 
          <OperationButton operation="x" dispatch={dispatch} />
          <DigitButton digit="4" dispatch={dispatch} /> 
          <DigitButton digit="5" dispatch={dispatch} /> 
          <DigitButton digit="6" dispatch={dispatch} /> 
          <OperationButton operation="+" dispatch={dispatch} />
          <DigitButton digit="7" dispatch={dispatch} /> 
          <DigitButton digit="8" dispatch={dispatch} /> 
          <DigitButton digit="9" dispatch={dispatch} /> 
          <OperationButton operation="-" dispatch={dispatch} />
          <DigitButton digit="." dispatch={dispatch} /> 
          <DigitButton digit="0" dispatch={dispatch} /> 
          <button className="two_col" onClick={() => dispatch({ type: actions.evaluate})}>=</button>
      </div>
  )
}

export default App