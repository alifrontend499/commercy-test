import React, { useState, useEffect } from 'react'

// redux
import { connect } from 'react-redux'

// bootstrap
import {
    Container
} from 'react-bootstrap'

// emails styles
import "./styles/emails-styles.scss"

// email table
import EmailsTableTopBar from './includes/EmailsTable/EmailsTableTopBar'
import EmailsTable from './includes/EmailsTable/EmailsTable'

// react toastify
import { toast } from 'react-toastify';

// APIs
import { getEmails } from 'utlis/Apis/Emails_API'

function Emails(props) {
    // messages
    const ERROR_WHILE_FETCHING_EMAILS = "Unable to load Email Templates. please try again."

    // consts
    const loadingCount = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const editColumnsType = "dropdown"  // dropdown or modal

    // refs

    // states
    const [emails, setEmails] = useState([])
    const [loading, setLoading] = useState(false)

    const [allEmailsSelected, setAllEmailsSelected] = useState(false)

    const [column__TemplateName, setColumn__TemplateName] = useState(true)
    const [column__Subject, setColumn__Subject] = useState(true)
    const [column__DateAdded, setColumn__DateAdded] = useState(true)
    const [column__to, setColumn__to] = useState(true)

    // useEffect: temprory filling email data
    useEffect(() => {
        setLoading(true)

        getEmails(props.currentUser.userToken, "").then(res => {
            // disabling loading
            setLoading(false)

            const loadedEmails = res
            console.log(loadedEmails)

        }).catch(err => {
            // console.log('err ', err)
            console.log('err ', err.message)

            // dismissing all the previous toasts first
            toast.dismiss();

            // showing the error message
            toast.error(ERROR_WHILE_FETCHING_EMAILS, {
                autoClose: 3000,
                onClose: () => {
                    // disabling loading
                    setLoading(false)
                }
            })
        })

    }, [])

    // selecting all the columns
    const handleSelectAllChange = (ev) => {
        const checkboxes = document.getElementsByClassName('email-selector-checkbox')

        // checking the checkbox and selecting all emails
        setAllEmailsSelected(!allEmailsSelected)
        setTimeout(() => {
            if (ev.target.checked) {
                // all emails selected
                checkboxes.length && Array.from(checkboxes).forEach(checkbox => {
                    checkbox.checked = true
                });
            } else {
                // all emails not selected
                checkboxes.length && Array.from(checkboxes).forEach(checkbox => {
                    checkbox.checked = false
                });
            }
        }, 50);

    };

    const handleDeleteEmail = (ev, emailId) => {
        ev.preventDefault()

        var confirmation = window.confirm('Are you sure you want to delete this email?')

        if (confirmation) {
            alert('email width the id' + emailId + ' is delete now')
        } else {

        }
    }

    return (
        <section id="app-emails" className="st-def-mar-TB">
            <Container fluid className="st-container">
                <div className="app-emails">
                    {/* HEADING WRAPPER */}
                    <div className="app-header-wrapper d-flex mb-2">
                        {/* heading */}
                        <p className="app-heading text-capitalize">email templates</p>
                    </div>

                    {/* CONTENT WRAPPER */}
                    <div className="app-content-container">
                        {/* app card */}
                        <div className="app-card">
                            <div className="app-card-content bg-white border st-border-light st-default-rounded-block">
                                {/* top bar */}
                                <div className="acc_top-bar border-bottom st-border-light">
                                    <EmailsTableTopBar
                                        editColumnsType={editColumnsType}

                                        column__TemplateName={column__TemplateName}
                                        column__Subject={column__Subject}
                                        column__to={column__to}
                                        column__DateAdded={column__DateAdded}

                                        setColumn__TemplateName={bool => setColumn__TemplateName(bool)}
                                        setColumn__Subject={bool => setColumn__Subject(bool)}
                                        setColumn__to={bool => setColumn__to(bool)}
                                        setColumn__DateAdded={bool => setColumn__DateAdded(bool)}
                                    />
                                </div>

                                {/* table */}
                                <div className="st-listing-table emails-table">
                                    <EmailsTable
                                        allEmailsSelected={allEmailsSelected}
                                        handleSelectAllChange={ev => handleSelectAllChange(ev)}

                                        column__TemplateName={column__TemplateName}
                                        column__Subject={column__Subject}
                                        column__to={column__to}
                                        column__DateAdded={column__DateAdded}

                                        loadingCount={loadingCount}
                                        loading={loading}

                                        emails={emails}

                                        handleDeleteEmail={(ev, emailId) => handleDeleteEmail(ev, emailId)}

                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </Container>
        </section>
    )
}


const getDataFromStore = state => {
    return {
        currentUser: state.auth.currentUser
    };
}

// const dispatchActionsToProps = dispatch => {
//     return {
//         setGlobalLoading: bool => dispatch(setGlobalLoading(bool)),
//     }
// }

export default connect(getDataFromStore, null)(Emails)