import React from 'react';
import Cookies from 'js-cookie';

export default class IndexPage extends React.Component{
    state = {
        name: Cookies.get('mangerName') || 'Admin'
    }
    render() {
        return (
            <div style={{fontSize: '48px',textAlign: 'center'}}>{this.state.name}，欢迎来到CP管理后台</div>
        )
    }
}