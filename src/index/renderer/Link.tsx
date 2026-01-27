// import PropTypes from 'prop-types'
import { usePageContext } from './usePageContext'

export default Link

function Link(props: {
    href?: string
    className?: string
    children: React.ReactNode
}) {
    const pageContext = usePageContext()
    // console.log('function Link', pageContext.urlPathname, props.href) // .split('/')[3]
    const className = [
        props.className,
        pageContext.urlPathname === props.href && 'is-active',
    ]
        .filter(Boolean)
        .join(' ')
    return <a {...props} className={className} />
}
