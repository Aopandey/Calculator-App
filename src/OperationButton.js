// Importing the 'actions' object from App.js to use the action types defined there
import {actions} from "./App"

// Defines the OperationButton component, which is used for all operation buttons (like +, -, *, /) in the calculator.
export default function OperationButton({dispatch, operation}){
    return(
        <button onClick={() => dispatch({type: actions.choose_operand, payload: {operation}})}>
            {operation}
        </button>
    )
}