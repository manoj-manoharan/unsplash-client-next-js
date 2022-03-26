import PropTypes from "prop-types"
import React from "react"
import styles from '../../styles/Masonary.module.css';

class Masonry extends React.Component {
    getColumns() {
        const {children, columnsCount} = this.props
        const columns = Array.from({length: columnsCount}, () => [])

        React.Children.forEach(children, (child, index) => {
            if (child && React.isValidElement(child)) {
                columns[index % columnsCount].push(child)
            }
        })

        return columns
    }

    renderColumns() {
        const {gutter} = this.props
        return this.getColumns().map((column, i) => (
            <div
                key={i}
                className={styles.column}
            >
                {column.map((item) => item)}
            </div>
        ))
    }

    render() {
        const {gutter, className, style} = this.props
        return (
            <div
                className={className + " " + styles.container}
            >
                {this.renderColumns()}
            </div>
        )
    }
}

Masonry.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
    columnsCount: PropTypes.number,
    gutter: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
}

Masonry.defaultProps = {
    columnsCount: 3,
    gutter: "0",
    className: null,
    style: {},
}

export default Masonry