import { Component } from 'react';
import { Form, Row, Col, Input, Button, Modal, Select, Table, DatePicker, Checkbox } from 'antd';
import Lists from '@/api/listServer'
import moment from 'moment';
import styles from './style.less'

import 'moment/locale/zh-cn';

moment.locale('zh-cn');


const FormItem = Form.Item;

const CheckboxGroup = Checkbox.Group;

const Option = Select.Option;

const { RangePicker } = DatePicker;

let thisVal='';

function selectOPtions(value,option){
    thisVal=value;
}


class NormalLoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            data: []
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            debugger
            if (!err) {
                let coops = '';
                let len = values.cooperate.length;
                for (let i = 0; i < len; i++){
                    if (i == len - 1) {
                        coops += values.cooperate[i]
                    } else {
                        coops += values.cooperate[i] + ','
                    }

                }
                Lists.save({
                    cid: this.props.id,
                    title: values.title,
                    password: values.password,
                    company: values.company,
                    rate: values.rate,
                    bank: values.bank,
                    bank_card: values.bank_card,
                    contact: values.contact,
                    in_company: values.in_company,
                    phone: values.phone,
                    qq: values.qq,
                    sign_company_id : thisVal,
                    sign_num: values.sign_num,
                    sign_time_start: values.picker==undefined ?'':values.picker[0].format('YYYY-MM-DD'),
                    sign_time_end:  values.picker==undefined ?'':values.picker[1].format('YYYY-MM-DD'),
                    type: values.type,
                    cooperate: coops
                }).then(res => {
                    if (!this.props.handSave) {
                        this.props.handAddSave({
                            visible: this.state.visible
                        })
                    } else {
                        this.props.handSave({
                            visible: this.state.visible
                        })
                    }
                })
            }
        });
    }

    handleCancel() {
        this.props.onCancel()
    }

    render() {
        const options = this.props.listData.map(d => <Option key={d.id}>{d.title}</Option>);
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
        let cooperateOptions = [
            { label: '订阅+包月', value: '1' }
            // { label: '广告', value: '2' }
        ]
        const { getFieldDecorator } = this.props.form;
        const data = this.props.data || {};
        const type = this.props.type || 'edit';
        let cooperateStr = data && data.cooperate ||this.props.coopse ;
        let cooperateArr = []
        if (cooperateStr) {
            cooperateArr = cooperateStr.split(',')
        }
        return (
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSubmit}>
                <Row>
                    <Col span="12">
                        <FormItem label='cp名称' {...formItemLayout}>
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: 'cp名称必填!' }],
                                initialValue: data.title || ''
                            })(
                                <Input placeholder="cp名称"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label='登录密码' {...formItemLayout}>
                            {getFieldDecorator('password', {
                                rules: [{ required: this.props.isRequired,message: '登录密码必填!' }],
                            })(
                                <Input type="password" placeholder="请输入登录密码" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label='公司名称' {...formBlockLayout}>
                            {getFieldDecorator('company', {
                                // rules: [{ required: this.props.isRequired, message: '公司名称必填!' }],
                                initialValue: data.company || ''
                            })(
                                <Input placeholder="请输入公司名称" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label='分成比例' {...formItemLayout}>
                            {getFieldDecorator('rate', {
                                rules: [{ required: this.props.isRequired, message: '分成比例必填!' }],
                                initialValue: data.rate || this.props.percent
                            })(
                                <Input placeholder="请输入分成比例" addonAfter="%"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label='签约公司' {...formItemLayout}>
                            {getFieldDecorator('sign_company', {
                                initialValue: data.sign_company || ''
                            })(
                                <Select placeholder="请选择我方签约公司" onSelect={selectOPtions}>
                                    {options}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label='业务' {...formBlockLayout}>
                            {getFieldDecorator('type', {
                                rules: [{ required: this.props.isRequired, message: '业务必选!' }],
                                initialValue: data.type || ''
                            })(
                                <Select placeholder="请选择业务" disabled={type == 'add'?false:true}>
                                    <Option value={1}>小说</Option>
                                    <Option value={2}>漫画</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label='合作方式' {...formBlockLayout}>
                            {getFieldDecorator('cooperate', {
                                initialValue: cooperateArr
                            })(
                                <CheckboxGroup options={cooperateOptions} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label='签约时间' {...formItemLayout} >
                            {getFieldDecorator('picker')(
                                <RangePicker placeholder={['开始时间', '结束时间']} />
                            )}
                        </FormItem>`
                    </Col>
                    <Col span="12">
                        <FormItem label='签约数量' {...formItemLayout} >
                            {getFieldDecorator('sign_num', {
                                rules: [{ required: this.props.isRequired, message: '签约数量必填!' }],
                                initialValue: data.sign_num || ''
                            })(
                                <Input placeholder="请输入签约数量" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label='联系人' {...formItemLayout} >
                            {getFieldDecorator('contact', {
                                rules: [{ required: this.props.isRequired, message: '联系人必填!' }],
                                initialValue: data.contact || ''
                            })(
                                <Input placeholder="请输入联系人" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label='电话' {...formItemLayout} >
                            {getFieldDecorator('phone', {
                                rules: [{ required: this.props.isRequired, message: '电话必填!' }],
                                initialValue: data.phone || ''
                            })(
                                <Input placeholder="请输入电话" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label='QQ' {...formItemLayout} >
                            {getFieldDecorator('qq', {
                                rules: [{ required: this.props.isRequired, message: 'QQ必填!' }],
                                initialValue: data.qq || ''
                            })(
                                <Input placeholder="请输入QQ" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label='收款公司'  {...formItemLayout} >
                            {getFieldDecorator('in_company', {
                                // rules: [{ required: this.props.isRequired, message: '收款公司必填!' }],
                                initialValue: data.in_company || ''
                            })(
                                <Input placeholder="请输入收款公司名称" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label='收款账号'  {...formItemLayout} >
                            {getFieldDecorator('bank_card', {
                                // rules: [{ required: this.props.isRequired, message: '收款账号必填!' }],
                                initialValue: data.bank_card || ''
                            })(
                                <Input placeholder="请输入收款账号" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label='开户银行' {...formItemLayout} >
                            {getFieldDecorator('bank', {
                                initialValue: data.bank || ''
                            })(
                                <Input placeholder="请输入开户银行" />
                            )}
                        </FormItem>
                    </Col>
                </Row>

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
            visible: false,
            isRequired: true,
            percent:50,
            coopse:'1'
        };
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.props.handState(values);
        });
    }

    addSave = () => {
        this.setState({
            visible: true
        })
    }

    handAddSave(val) {
        this.setState({
            visible: val.visible
        }, () => {
            this.props.handAddState();
        })
    }

    hideModal = () => {
        this.setState({
            visible: false
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
                        {getFieldDecorator('id', {
                            rules: [{ message: 'id' }],
                        })(
                            <Input placeholder="请输入ID" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('cptitle', {
                            rules: [{ message: 'cptitle' }],
                        })(
                            <Input placeholder="请输入cp名称" />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit">查询</Button>
                    </FormItem>
                    <FormItem>
                        <Button style={{ marginLeft: 8 }} type="primary" onClick={this.addSave}>
                            添加cp
                        </Button>
                    </FormItem>
                </Form>
                <Modal title='添加' footer={null} width='660px' destroyOnClose onOk={this.hideModal} onCancel={this.hideModal} visible={this.state.visible}>
                    <WrappedNormalLoginForm coopse={this.state.coopse} percent={this.state.percent} type="add" listData={this.props.listData} onCancel={this.hideModal} isRequired={this.state.isRequired} handAddSave={val => this.handAddSave(val)} />
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

  class EditableCell extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            editing: false,
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
        if (error) {
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
      this.state = { visible: false, id: 0, data: {}, listData: [] };
      this.columns = [
        {
            title: '业务',
            dataIndex: 'type_name',
            align: 'center',
            render: (text, record) => {
                return (
                    <div>{record.type_name || '-'}</div>
                )
            }
        },
        {
            title: 'ID',
            dataIndex: 'id',
            align: 'center',
            render: (text, record) => {
                return (
                    <div>{record.id || '-'}</div>
                )
            }
        },
        {
            title: 'cp名称',
            dataIndex: 'title',
            align: 'center',
            render: (text, record) => {
                return (
                    <div>{record.title || '-'}</div>
                )
            }
        },
        {
            title: '公司名称',
            dataIndex: 'company',
            align: 'center',
            render: (text, record) => {
                return (
                    <div>{record.company || '-'}</div>
                )
            }
        },
        {
            title: '分成比例',
            dataIndex: 'rate',
            align: 'center',
            render: (text, record) => {
                return (
                    <div>{record.rate || '-'}</div>
                )
            }
        },
        {
            title: '签约数量',
            dataIndex: 'sign_num',
            editable: true,
            width: '15%',
            align: 'center',
            render: (text, record) => {
                return (
                    <div>{record.sign_num || '-'}</div>
                )
            }
        },
        // {
        //     title: '入库数量',
        //     dataIndex: '入库数量',
        //     width: '10%',
        //     editable: true,
        //     align: 'center'
        // },
        // {
        //     title: '上架数量',
        //     dataIndex: '上架数量',
        //     width: '10%',
        //     editable: true,
        //     align: 'center'
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
        }
    ];
    }

    edit(record) {
        thisVal='';
        Lists.view({ cid: record.id }).then(res => {
            this.setState({
                visible: true,
                id: res.data.id,
                data: res.data
            })
        })
    }

    onChange = (pagination) => {
        this.props.changePage(pagination)
    }

    hideModal = () => {
        this.setState({
            visible: false,
        });
    }

    handSave(val) {
        this.setState({
            visible: val.visible
        }, () => {
            this.props.handEdit()
        })
    }

    handleSave = (row) => {
      const newData = this.props.data;
      const index = newData.findIndex(item => row.key === item.key);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      this.props.handEditSave({ data: newData, rows: row });
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
            handleSave: this.handleSave,
          }),
        };
      });
      return (
        <div>
          <Table
            loading={this.props.loading}
            pagination={{ total: this.props.total, pageSize: this.props.pagesize }}
            components={components}
            rowKey={record => record.id}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={this.props.data}
            columns={columns}
          />
          <Modal
            title='编辑'
            footer={null}
            width='660px'
            destroyOnClose
            onOk={this.hideModal}
            onCancel={this.hideModal}
            visible={this.state.visible}>
            <WrappedNormalLoginForm listData={this.props.listData} onCancel={this.hideModal} data={this.state.data} id={this.state.id} handSave={val => this.handSave(val)} />
        </Modal>
        </div>
      );
    }
  }


class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            total: '',
            pagesize: '',
            page: 1,
            name: '',
            type: '',
            cpid: '',
            listData: [],
            loading: true
        }
    };

    request() {
        Lists.clList({
            page: this.state.page,
            name: this.state.name,
            type: this.state.type,
            cpid: this.state.cpid
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
        this.request()
        Lists.select().then(res => {
            this.setState({
                listData: res.data
            })
        })
    }

    handAddState() {
        this.request()
    }

    handEdit() {
        this.request();
    }

    handEditSave(val){
        Lists.save({
            cid: val.rows.id,
            sign_num:  val.rows.sign_num
        }).then(res => {
            this.request();
        })
    }

    handState(val) {
        this.setState({
            page: 1,
            type: val.type,
            name: val.cptitle,
            cpid: val.id
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
        return (
            <div>
                <WrappedHorizontalLoginForm listData={this.state.listData} handState={val => this.handState(val)} handAddState={val => this.handAddState()} />
                <EditableTable loading={this.state.loading} listData={this.state.listData} data={this.state.data} total={this.state.total} pagesize={this.state.pagesize} handEdit={val => this.handEdit()} changePage={val => this.changePage(val)} handEditSave={val => this.handEditSave(val)}/>
            </div>
        )
    }
}

export default List;