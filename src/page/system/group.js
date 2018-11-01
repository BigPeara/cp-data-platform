import React from 'react';
import { Modal, Spin, Table, Form, Input, Button, Switch } from 'antd';
import SearchForm from './search'
import MenuTree from './menuTree'
import router from 'umi/router';
import systemApi from '@/api/system';
import styles from './style.less';
import { __values } from 'tslib';

const FormItem = Form.Item;
const { TextArea } = Input;

//编辑的
class NormalEditForm extends React.Component{
    state = {
        status: 1,
    }
    handleAdd = (e) => {
        e.preventDefault();
        const type = this.props.type || 1;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (type == 1) {  //添加
                    systemApi.addgroupinfo({
                        group_name: values.group_name,
                        remark: values.remark,
                        status: this.state.status
                    }).then(res => {
                        this.props.resetData();
                        this.props.form.resetFields();
                    })
                } else {  //编辑
                    systemApi.savegroupinfo({
                        groupid: this.props.initData.id,
                        group_name: values.group_name,
                        remark: values.remark,
                        status: this.state.status
                    }).then(res => {
                        this.props.resetData();
                        // this.props.form.resetFields();
                    })
                }
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
    handleCancel(){
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
                <FormItem  {...formItemLayout}  label="角色名">
                    {getFieldDecorator('group_name',{
                        rules: [{ required: true, message: '角色名称必填!' }],
                        initialValue: data.group_name || ''
                    })(
                        <Input placeholder="请输入角色名称" />
                    )}
                </FormItem>
                <FormItem  {...formItemLayout}  label="备注">
                    {getFieldDecorator('remark', {
                        initialValue: data.remark || ''
                    })(
                        <TextArea placeholder="请输入备注" autosize={{ minRows: 2, maxRows: 6 }} />
                    )}
                </FormItem>
                <FormItem  {...formItemLayout}  label="状态">
                    {getFieldDecorator('name',{
                        initialValue: data.status == 1 ? true : false
                    })(
                        <Switch checkedChildren="正常" defaultChecked={data.status == 1 ? true : false} onChange={this.changeStatus.bind(this)} unCheckedChildren="禁用" />
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
        formType: 1,
        editVisible: false,
        addVisible: false,
        loading: false,
        eidtId: '',
        menuVisible: false,
        menuData: [],
        checkIds: [],
        groupid: '',
        groupInfo: {},
        total: 0,
        pageSize: 10,
    }
    componentDidMount() {
        this.getData()
    }
    getData(search = {}) {
        this.setState({
            loading: true
        })
        systemApi.group(search).then(res => {
            this.setState({
                list: res.data.list,
                loading: false,
                total: res.data.total,
                pageSize: res.data.pagesize
            })
        })
    }
    handleSearch(val){
        this.getData(val);
    }
    editShow(val){
        systemApi.viewgroupmenu({ groupid: val.id }).then(res => {
            this.setState({
                formType: 2,
                editVisible: true,
                groupInfo: res.data.groupInfo
            })
        })
    }
    resetData() {
        this.setState({
            groupInfo: {},
            editVisible: false
        })
        this.refs.editForm.resetFields();
        this.getData();
    }
    menuShow(val){
        systemApi.viewgroupmenu({groupid: val.id}).then(res=>{
            this.setState({
                groupid: val.id,
                menuVisible: true,
                menuData: res.data.allMenu
            })
        })
    }
    addShow() {
        this.setState({
            groupInfo: {},
            formType: 1,
            editVisible: true
        })
    }

    handleMenuOk() {
        let checkIds = this.state.checkIds;
        let menu = '';
        checkIds.forEach((item, index) => {
            if (index == checkIds.length - 1) {
                menu += item
            } else {
                menu += item + ','
            }
        })
        let data = {
            groupid: this.state.groupid,
            menu: menu
        }

        systemApi.savegroupmenu(data).then(res => {
            this.setState({
                menuVisible: false
            })
            this.getData();
        })
    }
    handleCheckIds(val) {
        this.setState({
            checkIds: val
        })
    }
    handleMenuCancel() {
        this.setState({
            menuVisible: false
        })
    }
    handleCancel(){
        this.setState({
            groupInfo: {},
            editVisible: false
        })
    }
    handleAddCancel() {
        this.setState({
            addVisible: false
        })
    }
    render() {
        const columns = [
            { title: 'Id', align: 'center', dataIndex: 'id' },
            { title: '名字', dataIndex: 'group_name' },
            {
                title: '状态', align: 'center',dataIndex: 'status', render: (text, record) => {
                    if(record.status == 1){
                        return (<div>正常</div>)
                    }
                    return (<div>禁用</div>)
                }
            },
            { title: '描述', dataIndex: 'remark' },
            { title: '日期', dataIndex: 'ctime' },
            {
                title: '操作', dataIndex: 'action',align: 'center', render: (text, record) => (
                    <div className={styles.tableMenu}>
                        <a href="javascript:;" onClick={this.editShow.bind(this, record)}>编辑</a>
                        <a href="javascript:;" onClick={this.menuShow.bind(this, record)}>菜单</a>
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
                            rowKey={record=> record.id}
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
                {/* 编辑 */}
                <Modal
                    title={this.state.formType == 1 ? '添加':'修改'}
                    visible={this.state.editVisible}
                    footer={null}
                    onCancel={this.handleCancel.bind(this)}
                >
                    <EditForm ref="editForm" resetData={this.resetData.bind(this)} type={this.state.formType} onCancel={this.handleCancel.bind(this)} initData={this.state.groupInfo} />
                </Modal>
                
                {/* 菜单权限的 */}
                <Modal
                    title="角色菜单权限"
                    visible={this.state.menuVisible}
                    footer={null}
                    onOk={this.handleMenuOk.bind(this)}
                    cancelText="取消"
                    okText="保存"
                    onCancel={this.handleMenuCancel.bind(this)}
                >
                    <MenuTree handleCheck={this.handleCheckIds.bind(this)} data={this.state.menuData} />
                    <div className={styles.baseFormItem} style={{marginTop: '20px'}}>
                        <Button type="primary" onClick={this.handleMenuOk.bind(this)} className="login-form-button">保存</Button>
                        <Button onClick={this.handleMenuCancel.bind(this)} className="login-form-button">取消</Button>
                    </div>
                </Modal>
            </div>
        )
   } 
}  
