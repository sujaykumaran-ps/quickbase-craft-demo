import React, { useState } from 'react'
import axios from 'axios'
import { validate } from '../form-validations.js'
import './Form.scss';

const Form = () => {

    const [field, setField] = useState({
        label: '',
        default: '',
        choices: '',
        displayAlpha: false,
        required: false
    })
    const [notifications, setNotifications] = useState({
        duplicatesError: '',
        choicesError: ''
    })
    const [created, setCreated] = useState('')

    // Split up Choice Values
    const getChoices = (choices) => {
    let choicesArray = choices.split('\n')

    choicesArray = choicesArray.map(x => x)
    choicesArray = choicesArray.filter(element => element !== '')

    return choicesArray
    }

    // Add Default Value to Choices if not done already
    const addDefault = (defaultChoice, choicesArray) => {
        if (!defaultChoice) {
        return choicesArray
        }
    const defaultLowerCase = defaultChoice.toLowerCase()
    const choicesArrayLowerCase = choicesArray.map(choice => choice.toLowerCase())
        if (!choicesArrayLowerCase.includes(defaultLowerCase)) {
        choicesArray.unshift(defaultChoice)
        }
    return choicesArray
    }

    const handleChange = event => {
        event.persist()
        setField(field => ({ ...field, [event.target.name]: event.target.value }))
    }

    const handleCheck = event => {
        event.persist()
        setField(field => ({ ...field, [event.target.name]: !field[event.target.name] }))
    }
    // Sort Choices
    const alphaSort = (choicesArray, displayAlpha) => {
        if (displayAlpha) {
        choicesArray = choicesArray.sort()
        return choicesArray
        }
        return choicesArray
    }
    // Sort Default value at first
    const defFirst = (defaultChoice, choicesArray, displayAlpha) => {
        if (displayAlpha) {
        return choicesArray
        }

        if (choicesArray.indexOf(defaultChoice) <= 0) {
        return choicesArray
        }
        choicesArray = choicesArray.filter(element => (element !== defaultChoice))
        choicesArray = [defaultChoice, ...choicesArray]
        return choicesArray
  }

  const handleSubmit = event => {
    event.preventDefault()
    let choicesArray = getChoices(field.choices, field.displayAlpha)
    choicesArray = addDefault(field.default, choicesArray)
    const errors = validate(choicesArray)
    choicesArray = alphaSort(choicesArray, field.displayAlpha)
    choicesArray = defFirst(field.default, choicesArray, field.displayAlpha)
    const choicesString = choicesArray.join('\n')
    setField({ ...field, default: field.default, choices: choicesString })
    setNotifications({ ...errors })
    setCreated('')
    if (Object.values(errors).every(x => x === '')) {
       submit(choicesArray)
    }
  }

  const submit = (choicesArray) => {
    const data = {
      label: field.label,
      default: field.default,
      choices: choicesArray,
      displayAlpha: field.displayAlpha,
      required: field.required
    }
    // POST method to the URL
    axios.post('http://www.mocky.io/v2/566061f21200008e3aabd919', data)
        .then(() => setCreated('Field Created successfully !!!'))
        .catch(error => {
            this.setState({ errorMessage: error.message });
            console.error('There was an error!', error);
        });
        
        console.log('Field data', data)
    }

  const clearState = () => {
    setField({
      label: '',
      default: '',
      choices: '',
      displayAlpha: false,
      required: false
    })

    setNotifications({
      duplicatesError: '',
      choicesError: ''
    })

    setCreated('')
  }

  const handleClear = e => {
    e.preventDefault()
    clearState()
  }

  return (
    <div className='div-styles'>
        <h2 className='header-style'>Field Builder</h2>
        <form id="builder_form"  onSubmit={handleSubmit}>
            <input
                name ="label"
                type="text"
                placeholder="Enter Label Text" 
                value={field.label}
                onChange={handleChange} required 
            /> 
            <br/>
            <input
                type="checkbox"
                name="required"
                onChange={handleCheck}
                checked={field.required}
            /> A value is required
            <br/>
            <input 
                name = "default"
                type = "text"
                placeholder='Enter Default Choice' 
                value={field.default} 
                onChange={handleChange} 
            /> 
            <br/>
            <textarea
                name="choices"
                placeholder="Add Choices"
                onChange={handleChange}
                value={field.choices}
            />
            <br/>
            <div style={{ fontSize: 14, color: 'red', marginLeft: '2px' }}>
                {notifications.duplicatesError}
            </div>
            <div style={{ fontSize: 14, color: 'red' }}>
                {notifications.choicesError}
            </div>
            <input
                type="checkbox"
                name="displayAlpha"
                onChange={handleCheck}
                checked={field.displayAlpha}
            /> Display Alphabetically
            <br/>
            <button type="submit">Save changes</button>
            <button type="submit" onClick={handleClear}>Clear</button>
            <div style={{ fontSize: 18, color: 'green' }}>
                {created}
            </div>
        </form>
    </div>
  )
}

export default Form