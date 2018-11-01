import React from 'react';

import { Form, Input, Button } from 'antd';
import styles from './style.less';

const FormItem = Form.Item;

class NormalSearchForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.keywords === undefined){
                    this.props.handleSearch({name:''});  
                }
                this.props.handleSearch({name: values.keywords});
            }
        });
    }
    handleAdd(){
        this.props.handleAdd()
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" onSubmit={this.handleSubmit} className={styles.searchForm}>
                <FormItem>
                    {getFieldDecorator('keywords')(
                        <Input placeholder="请输入搜索名称" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button">搜索</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={this.handleAdd.bind(this)} className="login-form-button">添加</Button>
                </FormItem>
            </Form>
        );
    }
}

const searhForm = Form.create()(NormalSearchForm);

export default searhForm;