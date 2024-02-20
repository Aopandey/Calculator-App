// Importing the 'actions' object from App.js to use the action types defined there
import {actions} from "./App"

// The DigitButton component is responsible for rendering individual digit buttons in the calculator.
export default function DigitButton({dispatch, digit}){
    return(
        <button onClick={() => dispatch({type: actions.add_digit, payload: {digit}})}>
            {digit}
        </button>
    )
}