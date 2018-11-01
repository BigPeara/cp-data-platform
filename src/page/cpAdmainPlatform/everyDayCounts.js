import { Component } from 'react';
import { DatePicker, Form, Input, Button, Select, Table, Popconfirm, Alert, Skeleton, Modal } from 'antd';
import countServer from '@/api/countServer'
import styles from './style.less'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;

const Option = Select.Option;

const { RangePicker } = DatePicker;

class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            result:[]
        };
    }

    componentDidMount() {
        countServer.selectList().then(res => {
            this.setState({
                result: res.data
            })
        })
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.props.handState(values);
        });
    }

    rest = (e) => {
        e.preventDefault();
        this.setState({
            clear:true
        })
        this.props.form.resetFields();
    }

    Submit = (e) => {
        e.preventDefault();

        countServer.dailySave({
            did: this.props.saveData.id,
            off_rtotal: this.props.saveData.off_rtotal,
            off_mtotal: this.props.saveData.off_mtotal,
            off_atotal: this.props.saveData.off_atotal
        }).then(res => {
        })
    }
    SubmitPush = (e) => {
        countServer.dailyPush().then(res => {
            this.props.handState({});
        })
    }
    render() {
        const options = this.state.result.map(d => <Option key={d.id}>{d.title}</Option>);
        const { result } = this.state;
        const { getFieldDecorator } = this.props.form;
        const push = this.props.push;
        const beforeTime=moment().subtract(1,'day').format('YYYY-MM-DD');

        return (
            <div>
                <Form layout="inline"
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSearch}>
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
                        {getFieldDecorator('Complete')(
                            <Select showSearch
                                style={{ width: 200 }}
                                placeholder="请选择cp"
                                optionFilterProp="children"
                                notFoundContent="无法找到"
                                searchPlaceholder="输入关键词"
                                >
                                {options}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('picker',{
                            initialValue: [moment(beforeTime, 'YYYY/MM/DD'), moment(beforeTime, 'YYYY/MM/DD')]
                        })(
                            <RangePicker placeholder={['开始时间', '结束时间']} format='YYYY-MM-DD'/>
                        )}
                    </FormItem>
                    <FormItem>
                        <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
                            查询
                        </Button>
                    </FormItem>
                    <FormItem>
                        <Button style={{ marginLeft: 8 }} type="primary" onClick={this.rest}>
                            重置
                        </Button>
                    </FormItem>
                    <FormItem>
                        <Popconfirm title="您确定要使用一键审核吗?" onConfirm={this.SubmitPush} okText="确定" cancelText="取消">
                            <Button style={{ marginLeft: 8 }} type="primary" disabled={push == 2}>
                                {push == 2 ? '已审核' : '一键审核'}
                            </Button>
                        </Popconfirm>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

const WrappedSearchForm = Form.create()(SearchForm);

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
                countServer.dailySave({
                    did: this.props.initData.id,
                    off_rtotal: values.off_rtotal,
                    off_mtotal: values.off_mtotal
                }).then(res => {
                    this.props.handState(false)
                })
            }
        });
    }
    handleCancel = (e) => {
        this.props.onCancel();
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
                    span: 18,
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
                <FormItem label='折扣后订阅数量' {...formItemLayout}>
                    {getFieldDecorator('off_rtotal', {
                        initialValue: data && data.off_rtotal || 0
                    })(
                        <Input placeholder="请输入折扣后订阅数量" />
                    )}
                </FormItem>
                <FormItem label='折扣后包月数量' {...formItemLayout}>
                    {getFieldDecorator('off_mtotal', {
                        initialValue: data && data.off_mtotal || 0
                    })(
                        <Input placeholder="请输入折扣后包月数量" />
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


const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false
        }
    }

    componentDidMount() {

        if (this.props.editable) {
            document.addEventListener('click', this.handleClickOutside, true);
        }
    }

    componentWillUnmount() {
        if (this.props.editable) {
            document.removeEventListener('click', this.handleClickOutside, true);
        }
    }

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    }

    handleClickOutside = (e) => {
        const { editing } = this.state;
        if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
            this.save();
        }
    }

    save = () => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (record.is_push == 2) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    }

    render() {
        const { editing } = this.state;
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            ...restProps
        } = this.props;
        return (
            <td ref={node => (this.cell = node)} {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                editing ? (
                                    <FormItem style={{ margin: 0 }}>
                                        {form.getFieldDecorator(dataIndex, {
                                            rules: [{
                                                required: true
                                            }],
                                            initialValue: record[dataIndex],
                                        })(
                                            <Input
                                                ref={node => (this.input = node)}
                                                onPressEnter={this.save}
                                            />
                                        )}
                                    </FormItem>
                                ) : (
                                        <div
                                            className="editable-cell-value-wrap"
                                            style={{ paddingRight: 24 }}
                                            onClick={this.toggleEdit}
                                        >
                                            {restProps.children}
                                        </div>
                                    )
                            );
                        }}
                    </EditableContext.Consumer>
                ) : restProps.children}
            </td>
        );
    }
}

class EditableTable extends React.Component {
    constructor(props) {

        super(props);
        this.state = {
            info: {},
            visible: false
        }
        this.columns = [
            {
                title: '日期',
                dataIndex: 'cdate',
                align: 'center'
            }, {
                title: '业务',
                dataIndex: 'type_name',
                align: 'center'
            }, {
                title: '作品名称',
                dataIndex: 'title',
                align: 'left'
            },
            {
                title: '作品ID',
                dataIndex: 'bid',
                align: 'center'
            }, {
                title: '所属cp',
                dataIndex: 'cptitle',
                align: 'left'
            }, {
                title: '审核日期',
                dataIndex: 'ptime',
                align: 'left'
            }, {
                title: '原始订阅数量',
                dataIndex: 'rtotal',
                align: 'center'
            }, {
                title: '折扣后订阅数量',
                dataIndex: 'off_rtotal',
                align: 'center',
                render: (text, record) => {
                    let status = record.sign_status.toString().split('')[0];
                    return (
                        <div style={status == 1 ? { color: '#52C41A' } : { color: '#f5222d' }}>
                            {record.off_rtotal}
                        </div>
                    )
                }
            }, {
                title: '原始订阅总额',
                dataIndex: 'rmoney',
                align: 'center'
            }, {
                title: '折扣后订阅总额',
                dataIndex: 'off_rmoney',
                align: 'center'
            }, {
                title: '原始包月数量',
                dataIndex: 'mtotal',
                align: 'center'
            }, {
                title: '折扣后包月数量',
                dataIndex: 'off_mtotal',
                align: 'center',
                render: (text, record) => {
                    let status = record.sign_status.toString().split('')[1];
                    return (
                        <div style={status == 1 ? { color: '#52C41A' } : { color: '#f5222d' }}>
                            {record.off_mtotal}
                        </div>
                    )
                }
            }, {
                title: '操作',
                dataIndex: 'action',
                align: 'center',
                render: (text, record) => {
                    return (
                        (
                            <a href="javascript:;" disabled={record.is_push == 2 ? true: false} onClick={this.editShow.bind(this, record)}>编辑</a>
                        )
                    )
                }
            }
            //   {
            //       title: '原始阅读数量',
            //       dataIndex: 'atotal',
            //       align:'left'
            //   },{
            //       title: '折扣后阅读数量',
            //       dataIndex: 'off_atotal',
            //       editable:true,
            //       align:'center'
            //   },{
            //       title: '原始广告收入',
            //       dataIndex: 'amoney',
            //       align:'center'
            //   },{
            //       title: '折扣后广告收入',
            //       dataIndex: 'off_amoney',
            //       align:'center'
            //   }
        ];
    }
    editShow(record) {
        this.setState({
            info: record,
            visible: true
        })
    }
    onChange = (pagination) => {
        this.props.changePage(pagination)
    }

    handleSave = (row) => {
        const newData = this.props.data;
        const index = newData.findIndex(item => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.props.handSave({ data: newData, rows: row });
    }

    hideModal() {
        this.setState({
            visible: false
        })
    }
    handleOk() {
        this.hideModal();
        this.props.init();
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
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    align: col.align,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div>
                <Table
                    scroll={{ x: 1200}}
                    loading={this.props.loading}
                    pagination={{ total: this.props.total, pageSize: this.props.pagesize }}
                    onChange={this.onChange}
                    rowKey={record => record.id}
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={this.props.data}
                    columns={columns}
                />
                <Modal
                    title = "编辑"
                    footer={null}
                    destroyOnClose
                    onOk={this.hideModal.bind(this)}
                    onCancel={this.hideModal.bind(this)}
                    visible={this.state.visible}>
                    <WrappedNormalLoginForm onCancel={this.hideModal.bind(this)} handState={this.handleOk.bind(this)} initData={this.state.info}></WrappedNormalLoginForm>
                </Modal>
            </div>
        );
    }
}


class everyDayCounts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            saveData: {},
            is_push: 1,
            total: '',
            pagesize: '',
            bid: 0,
            cpid: 0,
            type: 0,
            name: '',
            page: 1,
            sum: {},
            monthSum: {},
            loading: false
        }
    };

    request() {
        this.setState({
            loading: true
        })
        countServer.dailyList({
            bid: this.state.bid,
            cpid: this.state.cpid,
            type: this.state.type,
            name: this.state.name,
            mindate: this.state.mindate,
            maxdate: this.state.maxdate,
            loading: true,
            page:this.state.page
        }).then(res => {
            this.setState({
                data: res.data.list,
                total: res.data.total,
                is_push: res.data.is_push,
                pagesize: res.data.pagesize,
                sum: res.data.sum,
                monthSum: res.data.sum_month,
                loading: false
            })
        })
    }

    componentDidMount() {
        this.request();
    }

    handSave(val) {
        this.setState({
            data: val.data,
            saveData: val.rows
        })
    }

    handState(val) {
        this.setState({
            bid: val.bid,
            type: val.type,
            name: val.name,
            mindate:val.picker==undefined ? '':val.picker[0].format('YYYY-MM-DD'),
            maxdate: val.picker==undefined ? '':val.picker[1].format('YYYY-MM-DD'),
            cpid:  val.Complete
        }, () => {
            this.request();
        })
    }

    changePage(val) {
        this.setState({
            page: parseInt(val.current)
        }, () => {
            this.request();
        })
    }

    render() {
        const sum = this.state.sum;
        const monthSum = this.state.monthSum;
        return (
            <div>
                <WrappedSearchForm saveData={this.state.saveData} push={this.state.is_push} handState={val => this.handState(val)} />
                <Skeleton loading={this.state.loading}>
                    <div className={styles.baseRow}>
                        <Alert message={`原始：累计订阅数量${sum.sum_rtotal || 0}；累计订阅总额${sum.sum_rmoney || 0}；累计包月订阅数量${sum.sum_mtotal || 0}。`} type="success" />
                    </div>
                    <div className={styles.baseRow}>
                        <Alert message={`折扣后：累计订阅数量${sum.sum_off_rtotal || 0}；累计订阅总额${sum.sum_off_rmoney || 0}；累计包月订阅数量${sum.sum_off_mtotal || 0}。`} type="error" />
                    </div>
                    <div className={styles.baseRow}>
                        <Alert message={`当月折扣后：累计订阅总额${monthSum.sum_off_rmoney || 0}；日均订阅总额${monthSum.day_off_rmoney || 0}；预计订阅总额${monthSum.month_off_rmoney || 0}。`} type="info" />
                    </div>
                </Skeleton>
                <EditableTable loading={this.state.loading} init={this.request.bind(this)} data={this.state.data} total={this.state.total} pagesize={this.state.pagesize} handSave={val => this.handSave(val)} changePage={val => this.changePage(val)} />
            </div>
        )
    }
}

export default everyDayCounts;