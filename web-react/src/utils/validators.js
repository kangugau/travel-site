import { useState } from 'react'
export function email(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export function required(input) {
  return Boolean(input)
}

export function equal(input, target) {
  return input === target
}

export function useValidator(rules) {
  const [errors, setErrors] = useState(
    Object.keys(rules).reduce((prev, curr) => {
      prev[curr] = []
      return prev
    }, {})
  )
  const validate = (formData, fields) => {
    let newErrors = { ...errors }
    function validateField(field) {
      if (rules[field]) {
        const input = formData[field]
        let fieldErrors = rules[field]
          .map(({ validator, message }) => {
            const pass = validator(input)
            if (!pass) return { validator: validator.name, message }
          })
          .filter(Boolean)
        newErrors[field] = fieldErrors
      }
    }

    if (fields) {
      if (fields instanceof Array)
        fields.forEach((field) => {
          validateField(field)
        })
      else {
        validateField(fields)
      }
    } else {
      for (const field in rules) {
        validateField(field)
      }
    }
    setErrors(newErrors)
    for (const field in newErrors) {
      if (newErrors[field].length) return false
    }
    return true
  }
  const hasErr = () => {
    for (const field in errors) {
      if (errors[field].length) return true
    }
    return false
  }
  return { errors, validate, hasErr }
}
