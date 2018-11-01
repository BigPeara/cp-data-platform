import React from 'react';
import './layout.less';

export default class LcPanel extends React.Component{
    render() {
        return (
            <div className="lc-panel">
                {this.props.children}
            </div>
        )
    }
}