import { Component } from 'react';
import { Form, Row, Col, Input, Button, Modal, Select, Table } from 'antd';
import styles from './style.less'
import Company from '@/api/companyServer'

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                Company.save({
                    cid: this.props.data.id,
                    company: values.company,
                    address: values.address,
                    brn: values.brn,
                    invoices: values.invoices,
                    bank: values.bank,
                    bank_card: values.bank_card,
                    finance: values.finance,
                    phone: values.phone,
                    post_addr: values.post_addr,
                    recipients: values.recipients,
                    rphone: values.rphone,
                    mark: values.mark
                }).then(res => {
                    if (!this.props.handEide) {
                        this.props.handAddSave(this.state.visible)
                    } else {
                        this.props.handEide(this.state.visible);
                    }
                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { TextArea } = Input;
        const data = this.props.data;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const formBlockLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        }
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 20,
                    offset: 4,
                },
            },
        };
        return (
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={24}>
                        <FormItem label='公司名称' {...formBlockLayout}>
                            {getFieldDecorator('company', {
                                rules: [{ required: true, message: '公司名称必填' }],
                                initialValue: data.company || ''
                            })(
                                <Input placeholder="请输入公司名称" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row span={24}>
                    <FormItem label='注册地址' {...formBlockLayout} style={{ display: 'block' }}>
                        {getFieldDecorator('address', {
                            rules: [{ message: 'address' }],
                            initialValue: data.address || ''
                        })(
                            <Input placeholder="请输入注册地址" />
                        )}
                    </FormItem>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label='工商登记号' {...formItemLayout}>
                            {getFieldDecorator('brn', {
                                rules: [{ required: true,message: '请输入工商登记号' ,min:15,whitespace:true}],
                                initialValue: data.brn || ''
                            })(
                                <Input placeholder="请输入工商登记号" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label='开票要求' {...formItemLayout}>
                            {getFieldDecorator('invoices', {
                                rules: [{ message: 'invoices' }],
                                initialValue: data.invoices || ''
                            })(
                                <Input placeholder="请输入开票要求" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label='开户银行' {...formItemLayout}>
                            {getFieldDecorator('bank', {
                                rules: [{ message: 'bank' }],
                                initialValue: data.bank || ''
                            })(
                                <Input placeholder="请输入开户银行" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label='开户行账号' {...formItemLayout}>
                            {getFieldDecorator('bank_card', {
                                rules: [{ message: 'bank_card' }],
                                initialValue: data.bank_card || ''
                            })(
                                <Input placeholder="请输入开户银行账号" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label='财务联系人' {...formItemLayout}>
                            {getFieldDecorator('finance', {
                                rules: [{ message: 'finance' }],
                                initialValue: data.finance || ''
                            })(
                                <Input placeholder="请输入财务联系人" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label='财务电话' {...formItemLayout}>
                            {getFieldDecorator('phone', {
                                rules: [{ message: 'phone' }],
                                initialValue: data.phone || ''
                            })(
                                <Input placeholder="请输入财务联系电话" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label='发票收件人' {...formItemLayout}>
                            {getFieldDecorator('recipients', {
                                rules: [{ message: 'recipients' }],
                                initialValue: data.recipients || ''
                            })(
                                <Input placeholder="请输入发票收件人" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label='收件人电话' {...formItemLayout}>
                            {getFieldDecorator('rphone', {
                                rules: [{ message: 'rphone' }],
                                initialValue: data.rphone || ''
                            })(
                                <Input placeholder="请输入发票收件人联系电话" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <FormItem label='邮寄地址' {...formBlockLayout}>
                            {getFieldDecorator('post_addr', {
                                rules: [{ message: 'post_addr' }],
                                initialValue: data.post_addr || ''
                            })(
                                <Input placeholder="请输入邮寄地址" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <FormItem label='备注' {...formBlockLayout}>
                            {getFieldDecorator('mark', {
                                rules: [{ message: 'mark' }],
                                initialValue: data.mark || ''
                            })(
                                <TextArea rows={4} placeholder="有何建议" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <FormItem style={{ textAlign: 'center', width: '100%' }}>
                    <Button size="large" type="primary" htmlType="submit">保存</Button>
                </FormItem>
            </Form>
        );
    }
}
const WrappedNormalLoginForm = Form.create()(NormalLoginForm);


class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isRequired: true
        };
    }

    addSave = () => {
        this.setState({
            visible: true
        })
    }

    handAddSave(val) {
        this.setState({
            visible: val
        }, () => {
            this.props.handState();
        })
    }

    hideModal = () => {
        this.setState({
            visible: false,
        });
    }

    render() {
        return (
            <div>
                <Button className={styles.baseRow} type="primary" onClick={this.addSave}>
                    添加公司信息
                </Button>
                <Modal
                    title='添加'
                    footer={null}
                    width='660px'
                    destroyOnClose
                    onOk={this.hideModal}
                    onCancel={this.hideModal}
                    visible={this.state.visible}>
                    <WrappedNormalLoginForm data={{}} isRequired={this.state.isRequired} handAddSave={val => this.handAddSave(val)} />
                </Modal>
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
        this.state = { visible: false, info: '' };
        this.columns = [
            {
                title: '公司名称',
                dataIndex: 'company',
                align: 'center'
            },
            {
                title: '开票要求',
                dataIndex: 'invoices',
                align: 'center',
                render: (text, record) => {
                    return (
                        <div>{record.invoices || '-'}</div>
                    )
                }
            },
            {
                title: '收件人',
                dataIndex: 'recipients',
                align: 'center',
                render: (text, record) => {
                    return (
                        <div>{record.recipients || '-'}</div>
                    )
                }
            },
            {
                title: '收件人联系电话',
                dataIndex: 'rphone',
                align: 'center',
                render: (text, record) => {
                    return (
                        <div>{record.rphone || '-'}</div>
                    )
                }
            },
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


    onChange = (pagination) => {
        this.props.changePage(pagination)
    }

    edit(record) {
        Company.view({ cid: record.id }).then(res => {
            this.setState({
                visible: true,
                info: res.data
            })
        })


    }

    handEide(val) {
        this.setState({ visible: val }, () => {
            this.props.handEditSave();
        });
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
                    width='660px'
                    destroyOnClose
                    onOk={this.hideModal}
                    onCancel={this.hideModal}
                    visible={this.state.visible}>
                    <WrappedNormalLoginForm data={this.state.info} handEide={val => this.handEide(val)} />
                </Modal>
            </div>
        );
    }
}


class cpCompany extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            name: '',
            page: 1,
            total: '',
            pagesize: '',
            loading: true
        }
    };

    request() {
        Company.companyList({
            name: this.state.name,
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

    handState() {
        this.request();
    }

    handEditSave() {
        this.request();
    }

    changePage(val) {
        this.setState({
            page: parseInt(val.current)
        }, () => {
            this.request();
        })
    }

    render() {
        return (
            <div>
                <WrappedHorizontalLoginForm handState={val => this.handState()} />
                <EditableTable loading={this.state.loading} data={this.state.data} total={this.state.total} pagesize={this.state.pagesize} handEditSave={val => this.handEditSave()} changePage={val => this.changePage(val)} />
            </div>
        )
    }
}

export default cpCompany;