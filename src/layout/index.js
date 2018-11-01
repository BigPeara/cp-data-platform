import { Component } from 'react';
import { Layout, Menu, Icon, LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
const { Header, Footer, Sider, Content } = Layout;
import store from '../store/index';
import SliderMenu from '../components/SliderMenu';
import TopNavHeader from '../components/TopNavHeader';
import layoutStyle from './layout.less';

// 引入子菜单组件
const SubMenu = Menu.SubMenu;

export default class BasicLayout extends Component {

    constructor(props) {
        super(props);
        document.title = "CP ADMIN";
        this.state = {
            collapsed: store.getState(),
        }
    }
    componentDidMount() {
        store.subscribe(() =>
            this.setState({
                collapsed: store.getState()
            })
        );
    }

    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        return (
            <LocaleProvider locale={zhCN}>
                <Layout>
                    <Sider width={256} style={{ minHeight: '100vh' }} trigger={null}
                        collapsible
                        collapsed={this.state.collapsed}>
                        <SliderMenu />
                    </Sider>
                    <Layout >
                        {/* <Header style={{ background: '#fff', textAlign: 'center', padding: 0 }}></Header> */}
                        <Header style={{ background: '#fff', padding: 0 }}>
                            <TopNavHeader />
                        </Header>
                        <Content style={{ margin: '24px 16px 24px' }}>
                            <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
                                {this.props.children}
                            </div>
                        </Content>
                        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
                    </Layout>
                </Layout>
            </LocaleProvider>
        
        )
    }
}