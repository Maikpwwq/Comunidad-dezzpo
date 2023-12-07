import { useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'

function ScrollToTopOnMount() {
    const history = useHistory()

    useLayoutEffect(() => {
        const unlisten = history.listen(() => {
            window.scrollTo(0, 0)
        })
        return unlisten
    }, [history])
}

export default ScrollToTopOnMount