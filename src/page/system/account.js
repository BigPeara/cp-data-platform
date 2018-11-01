import React from 'react';
import systemApi from '@/api/system';
import styles from './style.less';
import { Form, Input, Button, Spin, Select, Switch } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class accountForm extends React.Component {
    state = {
        status: 1,
        info: {},
        groupList: [],
        loading: false
    }
    componentWillMount() {
        this.getData();
        this.getGroupData();
    }
    getData() {
        this.setState({
            loading: true
        })
        systemApi.viewmanager().then(res => {
            this.setState({
                loading: false,
                info: res.data
            })
        }).catch(res => {
            this.setState({
                loading: false
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
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.managerid = this.state.info.id;
                systemApi.savemanager(values).then(res => {
                    this.getData();
                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 4,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        let info = this.state.info;
        const otherList = this.state.groupList;
        return (
            <div className={styles.commonContent}>
                <Spin spinning={this.state.loading}>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem  {...formItemLayout} label="用户名">
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '用户名必填!' }],
                                initialValue: info.name || ''
                            })(
                                <Input placeholder="请输入用户名" disabled/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="角色"
                        >
                            {getFieldDecorator('group_id', {
                                rules: [{ required: true, message: '角色!' }],
                                initialValue: info.group_id || ''
                            })(
                                <Select placeholder="请选择角色" disabled>
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
                                initialValue: info.remark || ''
                            })(
                                <TextArea placeholder="请输入备注" autosize={{ minRows: 2, maxRows: 6 }} />
                            )}
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">更新个人信息</Button>
                        </FormItem>
                    </Form>
                </Spin>
                
            </div>
        );
    }
}

const normalAccountForm = Form.create()(accountForm);

export default normalAccountForm;