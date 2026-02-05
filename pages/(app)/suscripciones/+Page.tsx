/**
 * Suscripciones Page - SSR DEBUG MODE
 * 
 * Reverted to simple HTML to isolate 500 error cause.
 * Original content backed up in history.
 */

export default function Page() {
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>SSR Debug Mode</h1>
            <p>Testing if simple content loads without 500 error.</p>
        </div>
    )
}
