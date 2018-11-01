import React from 'react';
import { Modal, Spin, Table, Form, Input, Button, Switch,Icon } from 'antd';
import SearchForm from './search'
import MenuTree from './menuTree'
import router from 'umi/router';
import systemApi from '@/api/system';
import styles from './style.less';
import { __values } from 'tslib';

const FormItem = Form.Item;
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
                values.state = this.state.status;
                values.parent_id = this.props.initData.parent_id || 0;
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
        return (
            <Form onSubmit={this.handleAdd} className={styles.searchForm}>
                <FormItem  {...formItemLayout} label="菜单名称">
                    {getFieldDecorator('menu_name', {
                        rules: [{ required: true, message: '菜单名称必填!' }],
                        initialValue: data.menu_name || ''
                    })(
                        <Input placeholder="请输入菜单名称" />
                    )}
                </FormItem>
                <FormItem  {...formItemLayout} label="菜单链接">
                    {getFieldDecorator('menu_url', {
                        rules: [{ required: true, message: '菜单链接必填!' }],
                        initialValue: data.menu_url || ''
                    })(
                        <Input placeholder="请输入菜单URL" />
                    )}
                </FormItem>
                <FormItem  {...formItemLayout} label="Icon">
                    {getFieldDecorator('icon', {
                        initialValue: data.icon || ''
                    })(
                        <Input placeholder="请输入图标" />
                    )}
                </FormItem>
                <FormItem  {...formItemLayout} label="排序">
                    {getFieldDecorator('sort', {
                        initialValue: data.sort || ''
                    })(
                        <Input placeholder="请输入排序" />
                    )}
                </FormItem>
                <FormItem  {...formItemLayout} label="模块名称">
                    {getFieldDecorator('app', {
                        rules: [{ required: true, message: '模块名称必填!' }],
                        initialValue: data.app || ''
                    })(
                        <Input placeholder="请输入模块名称" />
                    )}
                </FormItem>
                <FormItem  {...formItemLayout} label="控制器名称">
                    {getFieldDecorator('controller', {
                        rules: [{ required: true, message: '控制器名称必填!' }],
                        initialValue: data.controller || ''
                    })(
                        <Input placeholder="请输入控制器名称" />
                    )}
                </FormItem>
                <FormItem  {...formItemLayout} label="方法名称">
                    {getFieldDecorator('action', {
                        rules: [{ required: true, message: '方法名称必填!' }],
                        initialValue: data.action || ''
                    })(
                        <Input placeholder="请输入方法名称" />
                    )}
                </FormItem>
                <FormItem  {...formItemLayout} label="状态">
                    {getFieldDecorator('status', {
                        // initialValue: data.state == 1 ? true : false
                    })(
                        <Switch checkedChildren="显示" defaultChecked={data.state == 1 ? true : false} onChange={this.changeStatus.bind(this)} unCheckedChildren="隐藏" />
                    )}
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

export default class Group extends React.Component {
    state = {
        list: [],
        modalTitle: '',
        editVisible: false,
        loading: false,
        editId: '',
        checkIds: [],
        groupid: '',
        info: {},
        total: 0,
        pageSize: 10,
    }
    componentWillMount() {
        this.getData()
    }
    getData(search = {}) {
        this.setState({
            loading: true
        })
        systemApi.menu(search).then(res => {
            this.setState({
                list: res.data,
                loading: false,
                total: res.data.total,
                pageSize: res.data.pagesize
            })
        })
    }
    handleSearch(val) {
        this.getData(val);
    }
    editShow(val) {
        systemApi.viewmenu({menuid: val.id }).then(res => {
            this.setState({
                modalTitle: '编辑',
                editVisible: true,
                editId: res.data.id,
                info: res.data
            })
        })
    }
    editNextShow(record) {
        this.setState({
            modalTitle: '添加下级',
            editVisible: true,
            info: { parent_id: record.id}
        })
    }
    addShow() {
        this.setState({
            info: {},
            modalTitle: '添加',
            editVisible: true,
        })
    }
    handleOk(val) {
        let title = this.state.modalTitle;
        if (title == '编辑') {
            val.menuid = this.state.editId;
        }
        systemApi.savemenu(val).then(res => {
            this.setState({
                editVisible: false
            })

            this.refs.editForm.resetFields();
            this.getData();
        })

    }
    handleCheckIds(val) {
        this.setState({
            checkIds: val
        })
    }
    handleCancel() {
        this.setState({
            info: {},
            editVisible: false
        })
    }
    render() {
        const columns = [
            {
                title: 'Id',align: 'center', dataIndex: 'id', render: (text, record) => {
                    return (
                        <div>{record.id}:{record.parent_id}</div>
                    )
            }},
            { title: '名称', dataIndex: 'menu_name' },
            { title: '菜单链接', dataIndex: 'menu_url' },
            {
                title: '菜单级别', align: 'center', dataIndex: 'menu_type', render: (text, record) => {
                    if (record.menu_type == 1) {
                        return (<div>一级菜单</div>)
                    }
                    return (<div>二级菜单</div>)
                }
            },
            {
                title: '图标', align: 'center', dataIndex: 'icon', render: (text, record) => {
                    if (record.icon == '' || record.icon == null || record.icon == undefined) {
                        return (<div>-</div>) 
                    }
                    return (<div><Icon type={record.icon} /></div>) 
                }
            },
,
            // { title: '父菜单Id', dataIndex: 'parent_id' },
            { title: '创建时间', dataIndex: 'ctime' },
            {
                title: '操作', align: 'center', dataIndex: 'action', render: (text, record) => (
                    <div className={styles.tableMenu}>
                        {
                            record.menu_type == 1 ? (
                                <a href="javascript:;" onClick={this.editNextShow.bind(this,record)}>添加下级菜单</a>
                            ):''
                        }
                        <a href="javascript:;" onClick={this.editShow.bind(this, record)}>编辑</a>
                    </div>
                )
            }
        ]
        const total = this.state.total;
        const pageSize = this.state.pageSize;
        return (
            <div className={styles.searchIndex}>
                <div className={styles.search}>
                    {/* <SearchForm handleSearch={this.handleSearch.bind(this)} handleAdd={}></SearchForm> */}
                    <div className={styles.searchForm}>
                        <Button type="primary" onClick={this.addShow.bind(this)}>添加</Button>
                    </div>
                    
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
                    <EditForm onOk={this.handleOk.bind(this)} ref="editForm" onCancel={this.handleCancel.bind(this)} initData={this.state.info} />
                </Modal>
            </div>
        )
    }
}  
