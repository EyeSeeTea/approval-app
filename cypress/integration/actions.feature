Feature: Users can approve, accept, unapprove, and unaccept data

    Background:
        Given the admin user visits the app
        Then the user has workflow "Mortality < 5 years" preselected
        When the user selects period "Februari 2021"
        When the user selects organisation unit "Badjia"

    # These scenarios need to be executed in sequence, because the current
    # available actions depend on the previous ones.

    # In "Ready for approval" state the "Approve" action becomes available
    Scenario: User approves data
        Then the status tag shows the approval status "Ready for approval"
        When the user clicks the Approve button
        Then a modal confirmation dialog is displayed
        When the confirmation button is clicked
        And a circular loader is rendered
        And the following buttons are available
            | label     | available |
            | Approve   |           |
            | Accept    | yes       |
            | Unapprove | yes       |
            | Unaccept  |           |

    # In "Approved" state the "Accept" action becomes available
    Scenario: User accepts data
        Then the status tag shows the approval status "Approved"
        When the user clicks the Accept button
        Then the Accept button is disabled
        And a circular loader is rendered
        And the status tag shows the approval status "Ready for approval — Accepted"
        And the following buttons are available
            | label     | available |
            | Approve   | yes       |
            | Accept    |           |
            | Unapprove | yes       |
            | Unaccept  | yes       |

    # In "Ready for approval — Accepted" state the "Unaccept" action becomes available
    Scenario: User unaccepts data
        Then the status tag shows the approval status "Ready for approval — Accepted"
        When the user clicks the Unaccept button
        Then the Unaccept button is disabled
        Then a circular loader is rendered
        And the status tag shows the approval status "Approved"
        And the following buttons are available
            | label     | available |
            | Approve   |           |
            | Accept    | yes       |
            | Unapprove | yes       |
            | Unaccept  |           |

    # After unaccepting the state jumps back to "Approved" and the "Unapprove" action becomes available
    Scenario: User unapproves data
        Then the status tag shows the approval status "Approved"
        When the user clicks the Unapprove button
        Then the Unapprove button is disabled
        Then a circular loader is rendered
        And the status tag shows the approval status "Ready for approval"
        And the following buttons are available
            | label     | available |
            | Approve   | yes       |
            | Accept    |           |
            | Unapprove |           |
            | Unaccept  |           |