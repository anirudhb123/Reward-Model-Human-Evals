import React from 'react';
import { Card } from 'react-bootstrap';

const Checkbox = (props) => {
   const changeFunction = (event) => {
       const { checked, value } = event.target;
       const newState = {
           ...props.state,
       };
       const currentSelection = new Set(newState[props.toChange] || []);
      
       if (checked) {
           currentSelection.add(value);
       } else {
           currentSelection.delete(value);
       }
      
       newState[props.toChange] = Array.from(currentSelection);
       props.setState(newState);

       // Call the handleCheckboxChange function passed as a prop
       if (props.handleCheckboxChange) {
           props.handleCheckboxChange(props.toChange, Array.from(currentSelection));
       }
   };

   const options = props.options?.map(option => {
       const parts = option.split(':');
       const labelContent = parts.length > 1
           ? <><strong>{parts[0]}:</strong>{parts.slice(1).join(':')}</>
           : option;

       return (
           <div key={option}>
               <form>
                   <input
                       type="checkbox"
                       value={option}
                       id={option}
                       name='option'
                       checked={(props.state[props.toChange] || []).includes(option)}
                       onChange={changeFunction}
                   />
                   <label htmlFor={option} style={{ marginLeft: '10px' }}>
                       {labelContent}
                   </label>
                   <br />
               </form>
           </div>
       );
   });

   return (
       <Card style={{ width: '70%', marginTop: '20px', textAlign: 'left', fontSize: 18}}>
           <Card.Body>
               <Card.Text>
                   <form>
                       <fieldset id={props.title}>
                           {options}
                       </fieldset>
                   </form>
               </Card.Text>
           </Card.Body>
       </Card>
   );
}

export default Checkbox;
