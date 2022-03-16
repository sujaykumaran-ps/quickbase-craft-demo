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
    const [errorMessage, setNotifications] = useState({
        duplicateChoice: '',
        maxLimitError: ''
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
    // Form Submit
    const submit = (choicesArray) => {
    const data = {
        label: field.label,
        default: field.default,
        choices: choicesArray,
        displayAlpha: field.displayAlpha,
        required: field.required
    }
    // POST method to the Mocky
    axios.post('http://www.mocky.io/v2/566061f21200008e3aabd919', data)
        .then(() => setCreated('Created successfully !!!'))
        .catch(error => {
            this.setState({ errorMessage: error.message });
            console.error('There was an error!', error);
        });
        
        console.log('Field data', data)
    }
    // Clearing All States
    const clearState = () => {
    setField({
        label: '',
        default: '',
        choices: '',
        displayAlpha: false,
        required: false
    })

    setNotifications({
        duplicateChoice: '',
        maxLimitError: ''
    })

    setCreated('')
    }

    // Clear Inputs
    const handleClear = e => {
        e.preventDefault()
        clearState()
    }

  return (
    <div className='div-styles'>
        <h2 className='header-style'>Field Builder</h2>
        <form id="builder_form"  onSubmit={handleSubmit}>
            <div className='inner-containers'>
            <label className='label-style'>Label</label>
            <input
                className='label-input'
                name ="label"
                type="text"
                placeholder="Enter Label Text" 
                value={field.label}
                onChange={handleChange} required 
            /> 
            </div>
            <div className='inner-containers'>
                <label className='type-label'>Type</label>
                <label className='multiselect'>Multi-select</label>
                <input
                    className='type-input'
                    type="checkbox"
                    name="required"
                    onChange={handleCheck}
                    checked={field.required}
                /> 
                <label className='value-selected'>A value is required</label>
            </div>
            <div className='inner-containers'>
                <label className='default-label'>Default Value</label>
                <input 
                    className='default-input'
                    name = "default"
                    type = "text"
                    placeholder='Enter Default Choice' 
                    value={field.default} 
                    onChange={handleChange} 
                /> 
            </div>
            <div className='inner-containers'>
                <label className='choices-label'>Choices</label>
                <textarea
                    className='choices-input'
                    name="choices"
                    placeholder="Add Choices"
                    onChange={handleChange}
                    value={field.choices}
                />
            </div>
            <div className='error-message'>
                {errorMessage.duplicateChoice}
            </div>
            <div className='error-message'>
                {errorMessage.maxLimitError}
            </div>
            <div className='inner-containers'>
                <label className='order-label'>Order</label>
                <input
                    className='order-input'
                    type="checkbox"
                    name="displayAlpha"
                    onChange={handleCheck}
                    checked={field.displayAlpha}
                /> 
            <label className='alpha-label'>Display Alphabetically</label>
            </div>
            <div className='button-container'>
                <button className='save-button' title='Save' type="submit">Save changes</button>
                <button className='clear-button' title='Clear Contents' type="submit" onClick={handleClear}>Clear</button>
            </div>
            <div className='success-message'>
                {created}
            </div>
        </form>
    </div>
  )
}

export default Form