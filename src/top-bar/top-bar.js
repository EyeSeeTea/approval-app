import React from 'react'
import { ClearAllButton } from './clear-all-button/index.js'
import { ApprovalStatusesProvider } from './org-unit-select/approval-statuses.js'
import { OrgUnitSelect } from './org-unit-select/index.js'
import { PeriodSelect } from './period-select/index.js'
import { WorkflowSelect } from './workflow-select/index.js'
import { useSelectionContext } from '../selection-context/use-selection-context.js'

const TopBar = () => {
    const selection = useSelectionContext();
    if (selection.hideSelectors) return null;

    return <>
        <WorkflowSelect />
        <PeriodSelect />
        <ApprovalStatusesProvider>
            <OrgUnitSelect />
        </ApprovalStatusesProvider>
        <ClearAllButton />
    </>
}

export { TopBar }
