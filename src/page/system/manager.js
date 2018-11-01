import React from 'react';
import { Modal, Spin, Table, Form, Input, Button, Switch, Popconfirm, Select } from 'antd';
import SearchForm from './search'
import router from 'umi/router';
import systemApi from '@/api/system';
import styles from './style.less';
import { __values } from 'tslib';
import { Record } from 'immutable';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

//编辑的
class NormalEditForm extends React.Component {
    state = {
        status: 1,
    }
    handleAdd = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.status = this.state.status;
                this.props.onOk(values);
            }
        });
    }
    changeStatus(val) {
        if (val) {
            this.setState({
                status: 1
            })
        } else {
            this.setState({
                status: 2
            })
        }
    }
    handleCancel() {
        this.props.onCancel();
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
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
                    offset: 4,
                },
            },
        };
        const { getFieldDecorator } = this.props.form;
        const data = this.props.initData;
        const otherList = this.props.otherData;
        return (
            <Form onSubmit={this.handleAdd} className={styles.searchForm}>
                <FormItem  {...formItemLayout} label="用户名">
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '用户名必填!' }],
                        initialValue: data.name || ''
                    })(
                        <Input placeholder="请输入用户名" />
                    )}
                </FormItem>
                {/* <FormItem  {...formItemLayout} label="密码">
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '密码必填!' }],
                        initialValue: data.password || ''
                    })(
                        <Input type="password" placeholder="请输入密码" />
                    )}
                </FormItem> */}
                <FormItem
                    {...formItemLayout}
                    label="角色"
                >
                    {getFieldDecorator('group_id', {
                        rules: [{ required: true, message: '角色!' }],
                        initialValue: data.group_id || ''
                    })(
                        <Select placeholder="请选择角色">
                        {
                            otherList.map((item, i) => {
                                return (
                                    <Option key={item.id} value={item.id}>{item.group_name}</Option>
                                )
                            })
                        }
                        </Select>
                    )}
                </FormItem>
                
                <FormItem  {...formItemLayout} label="备注">
                    {getFieldDecorator('remark', {
                        initialValue: data.remark || ''
                    })(
                        <TextArea placeholder="请输入备注" autosize={{ minRows: 2, maxRows: 6 }} />
                    )}
                </FormItem>
                <FormItem  {...formItemLayout} label="状态">
                    {
                        <Switch checkedChildren="正常" defaultChecked={data.status == 1?true:false} onChange={this.changeStatus.bind(this)} unCheckedChildren="禁用" />
                    }
                    
                </FormItem>
                <div className={styles.baseFormItem}>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" className="login-form-button">保存</Button>
                        <Button onClick={this.handleCancel.bind(this)} className="login-form-button">取消</Button>
                    </FormItem>
                </div>
            </Form>
        )
    }
}
class NormalAddForm extends React.Component{
    state = {
        status: 1,
    }
    handleAdd = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.status = this.state.status;
                this.props.onOk(values);
            }
        });
    }
    changeStatus(val) {
        if (val) {
            this.setState({
                status: 1
            })
        } else {
            this.setState({
                status: 2
            })
        }
    }
    handleCancel() {
        this.props.onCancel();
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
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
                    offset: 4,
                },
            },
        };
        const { getFieldDecorator } = this.props.form;
        const data = this.props.initData;
        const otherList = this.props.otherData;
        return (
            <Form onSubmit={this.handleAdd} className={styles.searchForm}>
                <FormItem  {...formItemLayout} label="用户名">
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '用户名必填!' }],
                    })(
                        <Input placeholder="请输入用户名" />
                    )}
                </FormItem>
                <FormItem  {...formItemLayout} label="密码">
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '密码必填!' }],
                    })(
                        <Input type="password" placeholder="请输入密码" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="角色"
                >
                    {getFieldDecorator('group_id', {
                        rules: [{ required: true, message: '角色!' }]
                    })(
                        <Select placeholder="请选择角色">
                            {
                                otherList.map((item, i) => {
                                    return (
                                        <Option key={item.id} value={item.id}>{item.group_name}</Option>
                                    )
                                })
                            }
                        </Select>
                    )}
                </FormItem>

                <FormItem  {...formItemLayout} label="备注">
                    {getFieldDecorator('remark', {
                    })(
                        <TextArea placeholder="请输入备注" autosize={{ minRows: 2, maxRows: 6 }} />
                    )}
                </FormItem>
                <FormItem  {...formItemLayout} label="状态">
                    {
                        <Switch checkedChildren="正常" defaultChecked={data.status == 1 ? true : false} onChange={this.changeStatus.bind(this)} unCheckedChildren="禁用" />
                    }

                </FormItem>
                <div className={styles.baseFormItem}>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" className="login-form-button">保存</Button>
                        <Button onClick={this.handleCancel.bind(this)} className="login-form-button">取消</Button>
                    </FormItem>
                </div>
            </Form>
        )
    }
}

const EditForm = Form.create()(NormalEditForm);
const AddForm = Form.create()(NormalAddForm);

export default class Group extends React.Component {
    state = {
        list: [],
        groupList: [],
        modalTitle: '',
        editVisible: false,
        addVisible: false,
        editId: '',
        loading: false,
        groupid: '',
        info: {},
        total: 0,
        pageSize: 10,
    }
    componentWillMount() {
        this.getData();
        this.getGroupData();
    }
    getData(search = {}) {
        this.setState({
            loading: true
        })
        systemApi.manager(search).then(res => {
            this.setState({
                list: res.data.list,
                loading: false,
                total: res.data.total,
                pageSize: res.data.pagesize
            })
        })
    }
    getGroupData() {
        systemApi.group().then(res => {
            this.setState({
                groupList: res.data.list,
            })
        })
    }
    handleSearch(val) {
        this.getData(val);
    }
    editShow(val) {
        systemApi.viewmanager({ managerid: val.id }).then(res => {
            this.setState({
                modalTitle: '编辑',
                editVisible: true,
                info: res.data,
                editId: res.data.id
            })
        })
    }
    addShow() {
        this.setState({
            modalTitle: '添加',
            addVisible: true,
            groupInfo: {}
        })
    }
    handleOk(val) {
        // console.log(this.refs.editFormDom.initForm);
        val.managerid = this.state.editId;
        systemApi.savemanager(val).then(res => {
            this.setState({
                editVisible: false
            })
            this.refs.editFormDom.resetFields();
            this.getData();
        })
    }
    handleAddOk(val){
        systemApi.savemanager(val).then(res => {
            this.setState({
                addVisible: false
            })
            this.refs.addFormDom.resetFields();
            this.getData();
        })
    }
    handleCancel() {
        this.setState({
            editVisible: false
        })
    }
    handleAddCancel(){
        this.setState({
            info: {},
            addVisible: false
        })
    }
    confirmDelete(record) {
        systemApi.delmanager({ managerid: record.id }).then(res => {
            this.getData();
        })
    }
    render() {
        const columns = [
            { title: 'Id',align: 'center', dataIndex: 'id' },
            { title: '名字', dataIndex: 'name' },
            { title: '最后登录时间', dataIndex: 'last_login_time' },
            { title: '最后登录IP', dataIndex: 'last_login_ip' },
            {
                title: '状态', align: 'center', dataIndex: 'status', render: (text, record) => {
                    if (record.status == 1) {
                        return (<div>正常</div>)
                    }
                    return (<div>禁用</div>)
                }
            },
            { title: '创建时间', dataIndex: 'ctime' },
            { title: '角色', dataIndex: 'group_name' },
            {
                title: '操作', align: 'center', dataIndex: 'action', render: (text, record) => (
                    <div className={styles.tableMenu}>
                        <a href="javascript:;" onClick={this.editShow.bind(this, record)}>编辑</a>
                        <Popconfirm title="确认删除么?" onConfirm={this.confirmDelete.bind(this,record)} onCancel={this.cancelDelete} okText="删除" cancelText="取消">
                            <a href="javascript:;">删除</a>
                        </Popconfirm>,
                        
                    </div>
                )
            }
        ]
        const total = this.state.total;
        const pageSize = this.state.pageSize;
        return (
            <div className={styles.searchIndex}>
                <div className={styles.search}>
                    <SearchForm handleSearch={this.handleSearch.bind(this)} handleAdd={this.addShow.bind(this)}></SearchForm>
                </div>
                <div className="myTable" >
                    <Spin spinning={this.state.loading}>
                        <Table
                            rowKey={record => record.id}
                            bordered
                            dataSource={this.state.list}
                            columns={columns}
                            pagination={{
                                pageSize: pageSize,
                                total: total,
                                onChange: (page) => {
                                    this.getData({ page })
                                }
                            }}>

                        </Table>
                    </Spin>
                </div>
                {/* 保存编辑 */}
                <Modal
                    title={this.state.modalTitle}
                    visible={this.state.editVisible}
                    footer={null}
                    onCancel={this.handleCancel.bind(this)}
                >
                    <EditForm onOk={this.handleOk.bind(this)} ref="editFormDom" otherData={this.state.groupList} onCancel={this.handleCancel.bind(this)} initData={this.state.info} />
                </Modal>
                
                <Modal
                    title="添加"
                    visible={this.state.addVisible}
                    footer={null}
                    onCancel={this.handleAddCancel.bind(this)}
                >
                    <AddForm onOk={this.handleAddOk.bind(this)} ref="addFormDom" otherData={this.state.groupList} onCancel={this.handleAddCancel.bind(this)} initData={this.state.info} />
                </Modal>
                
            </div>
        )
    }
}  
