import { createContext } from 'react'

const defaultFn = () => {
    throw new Error('Selection Context has not been initialized')
}

const SelectionContext = createContext({
    workflow: {},
    period: {},
    orgUnit: {},
    filter: '',
    selectWorkflow: defaultFn,
    selectPeriod: defaultFn,
    selectOrgUnit: defaultFn,
    clearAll: defaultFn,
    setOpenedSelect: defaultFn,
})

export { SelectionContext }
