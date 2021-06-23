import {
    IconChevronDown24,
    IconChevronUp24,
    Popover,
    Tooltip,
    Layer,
} from '@dhis2/ui'
import { shallow } from 'enzyme'
import React from 'react'
import { ContextSelect } from './context-select.js'

describe('<ContextSelect>', () => {
    const baseProps = {
        label: 'label',
        value: 'value',
        onClose: () => {},
        onOpen: () => {},
    }
    describe('base state - not open or disabled', () => {
        const onOpen = jest.fn()

        const wrapper = shallow(
            <ContextSelect {...baseProps} onOpen={onOpen}>
                children
            </ContextSelect>
        )

        it('renders the label in a span', () => {
            expect(
                wrapper.find('span.prefix').containsMatchingElement('label')
            ).toBe(true)
        })

        it('renders the value in a span', () => {
            expect(
                wrapper.find('span.value').containsMatchingElement('value')
            ).toBe(true)
        })

        it('does not render children in a popup', () => {
            const popover = wrapper.find(Popover)

            expect(popover).toHaveLength(0)
            expect(popover.containsMatchingElement('children')).toBe(false)
        })

        it('shows an icon pointing downwards', () => {
            expect(wrapper.find(IconChevronDown24)).toHaveLength(1)
        })

        it('does not have a tooltip', () => {
            expect(wrapper.find(Tooltip)).toHaveLength(0)
        })

        it('calls onOpen when the button is clicked', () => {
            wrapper.find('button').simulate('click')
            expect(onOpen).toHaveBeenCalledTimes(1)
        })
    })
    describe('opened state', () => {
        const onClose = jest.fn()

        const wrapper = shallow(
            <ContextSelect {...baseProps} open onClose={onClose}>
                children
            </ContextSelect>
        )

        it('renders children in a popover', () => {
            const popover = wrapper.find(Popover)

            expect(popover).toHaveLength(1)
            expect(popover.containsMatchingElement('children')).toBe(true)
        })

        it('shows an icon pointing upwards', () => {
            expect(wrapper.find(IconChevronUp24)).toHaveLength(1)
        })

        it('calls onClose when the backdrop layer is clicked', () => {
            wrapper.find(Popover).dive().find(Layer).simulate('click')

            expect(onClose).toHaveBeenCalledTimes(1)
        })
    })

    describe('disabled state', () => {
        const wrapper = shallow(
            <ContextSelect
                {...baseProps}
                disabled
                tooltipContent="tooltipcontent"
            >
                children
            </ContextSelect>
        )

        it('has a tooltip', () => {
            const tooltip = wrapper.find(Tooltip)

            expect(tooltip).toHaveLength(1)
            expect(tooltip.prop('content')).toBe('tooltipcontent')
        })

        it('does not render the span containing the value', () => {
            expect(wrapper.find('span.value')).toHaveLength(0)
        })
    })
})
