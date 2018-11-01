import { Component } from 'react';
import { Form, Row, Col, Input, Button, Modal, Select, Table, Radio } from 'antd';
import styles from './style.less'
import Divide from '@/api/divideServer'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class NormalLoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            type: 1
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                Divide.bookSave({
                    bid: this.props.initData.bid,
                    rerate: values.rerate,
                    morate: values.morate,
                    adrate: values.adrate,
                    type: this.props.viewType
                }).then(res => {
                    this.props.handState(this.state.visible)
                })
            }
        });
    }
    handleCancel() {
        this.props.handleCancel();
    }
    setType = (e) => {
        this.setType({
            type: e.target.value
        })
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 20,
                    offset: 6,
                },
            },
        };
        const { getFieldDecorator } = this.props.form;
        const data = this.props.initData;
        return (
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSubmit}>
                <FormItem label='订阅比例设置' {...formItemLayout}>
                    {getFieldDecorator('rerate', {
                        rules: [{ required: true, message: '请输入订阅比例设置' }],
                        initialValue: data.rerate || ''
                    })(
                        <Input placeholder="请输入订阅比例设置" addonAfter="%" />
                    )}
                </FormItem>
                <FormItem label='包月比例设置' {...formItemLayout}>
                    {getFieldDecorator('morate', {
                        rules: [{ required: true, message: '请输入包月比例设置' }],
                        initialValue: data.morate || ''
                    })(
                        <Input placeholder="请输入包月比例设置" addonAfter="%"/>
                    )}
                </FormItem>
                {/* <FormItem label='广告比例设置' {...formItemLayout}>
                    {getFieldDecorator('adrate', {
                        rules: [{ required: true, message: '请输入广告比例设置' }],
                        initialValue: data.adrate || ''
                    })(
                        <Input placeholder="请输入广告比例设置" addonAfter="%" />
                    )}
                </FormItem> */}
                <FormItem label='业务类型' {...formItemLayout}>
                    {getFieldDecorator('type_name', {
                        rules: [{ required: true, message: '请输入广告比例设置' }],
                        initialValue: data.type_name|| '小说'
                    })(
                        <Input disabled={true}/>
                    )}
                </FormItem>
                <div className={styles.baseFormItem}>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" className="login-form-button">保存</Button>
                        <Button onClick={this.handleCancel.bind(this)} className="login-form-button">取消</Button>
                    </FormItem>
                </div>
            </Form>
        );
    }
}
const WrappedNormalLoginForm = Form.create()(NormalLoginForm);


class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.props.handQuery(values);
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form layout="inline"
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSearch}>
                    <FormItem>
                        {getFieldDecorator('bid', {
                            rules: [{ message: 'bid' }],
                        })(
                            <Input placeholder="请输入作品ID" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('name', {
                            rules: [{ message: 'name' }],
                        })(
                            <Input placeholder="请输入作品名称" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('type', {
                            rules: [{ message: 'type' }],
                        })(
                            <Select placeholder="请选择业务"
                                style={{ width: '180px' }}>
                                <Option value="1">小说</Option>
                                <Option value="2">漫画</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem>
                        <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
                            查询
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

const WrappedHorizontalLoginForm = Form.create()(LoginForm);

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
    getInput = () => {
        return <Input />;
    };

    render() {
        const {
            dataIndex,
            title,
            record,
            index,
            inputType,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    return (
                        <td {...restProps}></td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}

class EditableTable extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [], visible: false, id: '',info: {},viewType:'' };
        this.columns = [
            {
                title: '业务',
                dataIndex: 'type_name',
                editable: true,
                align: 'center'
            },
            {
                title: '作品ID',
                dataIndex: 'bid',
                editable: true,
                align: 'center'
            },
            {
                title: '作品名称',
                dataIndex: 'title',
                editable: true,
                align: 'left'
            },
            {
                title: '订阅比例设置',
                dataIndex: 'rerate',
                editable: true,
                align: 'center',
                render: (text, record) => {
                    return (
                        <div>{record.rerate}%</div>
                    )
                }
            },
            {
                title: '包月比例设置',
                dataIndex: 'morate',
                editable: true,
                align: 'center',
                render: (text, record) => {
                    return (
                        <div>{record.morate}%</div>
                    )
                }
            },
            // {
            //     title: '广告比例设置',
            //     dataIndex: 'adrate',
            //     editable: true,
            //     align: 'center',
            //     render: (text, record) => {
            //         return (
            //             <div>{record.adrate}%</div>
            //         )
            //     }
            // },
            {
                title: '操作',
                dataIndex: '操作',
                align: 'center',
                render: (text, record) => {
                    return (
                        <a onClick={() => this.edit(record)}>编辑</a>
                    )
                }
            },
        ];
    }

    handState(val) {
        this.setState({
            visible: val
        }, () => {
            this.props.handSave();
        })
    }

    edit(record) {
        // debugger
        Divide.bookView({ bid: record.bid, type: record.type }).then(res => {
            this.setState({
                info: res.data,
                visible: true,
                id: res.data.bid,
                viewType:res.data.type
            })

        })

    }

    onChange = (pagination) => {
        this.props.changePage(pagination)
    }


    hideModal = () => {
        this.setState({ visible: false });
    }


    render() {
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: record => ({
                    record,
                    dataIndex: col.dataIndex,
                    align: col.align,
                    title: col.title
                }),
            };
        });


        return (
            <div>
                <Table
                    loading={this.props.loading}
                    pagination={{ total: this.props.total, pageSize: this.props.pagesize }}
                    onChange={this.onChange}
                    rowKey={record => record.id}
                    components={components}
                    bordered
                    dataSource={this.props.data}
                    columns={columns}
                    rowClassName="editable-row">
                </Table>
                <Modal
                    title='编辑'
                    footer={null}
                    destroyOnClose
                    onOk={this.hideModal}
                    onCancel={this.hideModal}
                    visible={this.state.visible}>
                    <WrappedNormalLoginForm viewType={this.state.viewType} id={this.state.id} handleCancel = {this.hideModal} initData={this.state.info} handState={val => this.handState(val)} />
                </Modal>
            </div>
        );
    }
}


class setWorks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            type: 0,
            page: 1,
            total: '',
            pagesize: '',
            bid: 0,
            name: '',
            loading: true
        }
    };

    request() {
        Divide.bookList({
            bid: this.state.bid,
            name: this.state.name,
            type: this.state.type,
            page: this.state.page
        }).then(res => {
            this.setState({
                data: res.data.list,
                total: res.data.total,
                pagesize: res.data.pagesize,
                loading: false
            })
        })
    }

    componentDidMount() {
        this.request();
    }

    handSave() {
        this.request();
    }

    changePage(val) {
        this.setState({
            page: parseInt(val.current)
        }, () => {
            this.request();
        })
    }

    handQuery(val) {
        this.setState({
            type: val.type,
            name: val.name,
            bid: val.bid
        }, () => {
            this.request();
        })
    }

    render() {
        return (
            <div>
                <WrappedHorizontalLoginForm handQuery={val => this.handQuery(val)} />
                <EditableTable loading={this.state.loading} data={this.state.data} total={this.state.total} pagesize={this.state.pagesize} handSave={val => this.handSave()} changePage={val => this.changePage(val)} />
            </div>
        )
    }
}

export default setWorks;