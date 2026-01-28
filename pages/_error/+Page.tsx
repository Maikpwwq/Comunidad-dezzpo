// /pages/_error/+Page.js

export { Page }

import { usePageContext } from '@hooks/usePageContext'

function Page() {
    const pageContext = usePageContext()

    let msg // Message shown to the user
    const { abortReason, abortStatusCode } = pageContext
    // @ts-ignore - Handle un-typed abort reasons safely
    if (typeof abortReason === 'object' && abortReason?.notAdmin) {
        // Handle `throw render(403, { notAdmin: true })`
        msg = "You cannot access this page because you aren't an administrator."
    } else if (typeof abortReason === 'string') {
        // Handle `throw render(abortStatusCode, `You cannot access ${someCustomMessage}`)`
        msg = abortReason
    } else if (abortStatusCode === 403) {
        // Handle `throw render(403)`
        msg = "You cannot access this page because you don't have enough privileges."
    } else if (abortStatusCode === 401) {
        // Handle `throw render(401)`
        msg = "You cannot access this page because you aren't logged in. Please log in."
    } else {
        // Fallback error message
        msg = pageContext.is404
            ? "This page doesn't exist."
            : 'Something went wrong. Try again (later).'
    }

    return <p>{msg}</p>
}