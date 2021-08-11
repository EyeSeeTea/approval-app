import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useSelectionContext } from '../../selection-context/index.js'
import { getFixedPeriodsForTypeAndDateRange } from '../../shared/index.js'
import styles from './display.module.css'
import { Table } from './table.js'

const query = {
    dataSetReport: {
        resource: 'dataSetReport',
        params: ({ dataSetId, periodIds, orgUnit }) => ({
            // arrays are being handled by the app runtime
            pe: periodIds,
            ds: dataSetId,
            ou: orgUnit.id,
        }),
    },
}

const Display = ({ dataSetId }) => {
    const selection = useSelectionContext()
    const { orgUnit, workflow, period } = selection
    const { dataSets } = workflow
    const selectedDataSet = dataSets.find(({ id }) => id === dataSetId)
    const periodIds = selectedDataSet
        ? getFixedPeriodsForTypeAndDateRange(
              selectedDataSet.periodType,
              period.startDate,
              period.endDate
          ).map(({ id }) => id)
        : []

    const { called, loading, data, error, refetch } = useDataQuery(query, {
        lazy: true,
    })
    const tables = data?.dataSetReport
    const fetchDataSet = () => refetch({ periodIds, dataSetId, orgUnit })

    useEffect(
        () => {
            if (periodIds.length && dataSetId) {
                fetchDataSet()
            }
        },
        // joining so this produces a primitive value
        [periodIds.join(','), dataSetId]
    )

    if (!dataSetId) {
        return (
            <div className={styles.chooseDataSet}>
                <h2>{i18n.t('Choose a data set to review')}</h2>
                <p>
                    {i18n.t(
                        '{{- workflowName}} has multiple data sets. Choose a data set from the tabs above.',
                        { workflowName: workflow.displayName }
                    )}
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles.display}>
                <NoticeBox
                    error
                    title={i18n.t(
                        'There was a problem displaying this data set'
                    )}
                >
                    <p>
                        {i18n.t(
                            `This data set couldn't be loaded or displayed. Try again, or contact your system administrator.`
                        )}
                    </p>
                    <button
                        className={styles.retryButton}
                        onClick={fetchDataSet}
                    >
                        {i18n.t('Retry loading data set')}
                    </button>
                </NoticeBox>
            </div>
        )
    }

    if ((!called && periodIds.length) || loading) {
        return (
            <div className={styles.display}>
                <div className={styles.loadingWrapper}>
                    <CircularLoader small />
                    {i18n.t('Loading data set')}
                </div>
            </div>
        )
    }

    if (!periodIds.length || !tables.length) {
        return (
            <div className={styles.noData}>
                <p>
                    {i18n.t(
                        `This data set doesn't have any data for {{- period}} in {{- orgUnit}}.`,
                        {
                            period: period.displayName,
                            orgUnit: orgUnit.displayName,
                        }
                    )}
                </p>
            </div>
        )
    }

    return (
        <div className={styles.display}>
            {tables.map(table => (
                <Table
                    key={table.title}
                    title={table.title}
                    columns={table.headers.map(h => h.name)}
                    rows={table.rows}
                />
            ))}
        </div>
    )
}

Display.propTypes = {
    dataSetId: PropTypes.string,
}

export { Display }
