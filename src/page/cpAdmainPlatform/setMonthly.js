import { Component } from 'react';
import { DatePicker ,Form, Row, Col, Input, Button, Modal,Select,Table} from 'antd';
import Divide from '@/api/divideServer'
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from './style.less'
moment.locale('zh-cn');

const FormItem = Form.Item;

const Option = Select.Option;

const { MonthPicker } = DatePicker;


class NormalLoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state={
            visible:false
        }
    }

    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
            Divide.savemonth({
                mid:this.props.id,
                mmoney:values.mmoney
            }).then(res=>{
                this.props.handState(this.state.visible)
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
                onSubmit={this.handleSubmit }>
                <FormItem label='包月分成金额' style={{ display: "block" }} {...formItemLayout}>
                    {getFieldDecorator('mmoney', {
                        rules: [{ required: true, message: '请输入包月分成金额' }],
                        initialValue: data && data.mmoney || ''
                    })(
                        <Input placeholder="请输入包月分成金额"/>
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

let dataTime='';

function change(date, dateString) {
    dataTime=dateString;
}

class LoginForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible:false
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
        return(
            <div>
               <Form layout="inline"
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSearch}>
                    <FormItem>
                        {getFieldDecorator('month', {
                                rules: [],
                            })(
                                <MonthPicker placeholder="请选择月份" onChange={change}/>
                            )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('type', {
                                rules: [{message: 'type' }],
                            })(
                                <Select placeholder="请选择业务"
                                    style={{ width: '180px' }}>
                                    <Option value="1">小说</Option>
                                    <Option value="2">漫画</Option>
                                </Select>
                            )}
                    </FormItem>
                    <FormItem>
                        <Button style={{ marginLeft: 8 }} type="primary"  htmlType="submit">
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

const EditableRow = ({form, index, ...props }) => (
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
    this.state = { data:[],visible:false,id:'',info:{}};
    this.columns = [
      {
        title: '月份',
        dataIndex: 'cmonth',
        editable: true,
        align:'center'
      },
      {
        title: '业务',
        dataIndex: 'type_name',
        editable: true,
        align:'center'
      },
      {
        title: '包月分成金额',
        dataIndex: 'mmoney',
        editable: true,
        align:'center'
      },
      {
        title: '原始包月订阅总数量',
        dataIndex: 'total',
        editable: true,
        align:'center'
      },
      {
        title: '上次计算时间',
        dataIndex: 'ftime',
        editable: true,
        align: 'center',
        render: (text, record) => {
            return (
                <div>{record.ftime || '-'}</div>
            )
        }
      },
      {
        title: '是否发布',
        dataIndex: 'is_push',
        editable: true,
        align: 'center',
        render: (text, record) => {
            return (
                <div>{record.is_push == 1 ? '未发':'已发'}</div>
            )
        }
      },
      {
        title: '折扣后包月订阅数量',
        dataIndex: 'off_total',
        editable: true,
        align:'center'
      },
      {
        title: '折扣后包月分成金额',
        dataIndex: 'off_mmoney',
        editable: true,
        align:'center'
      },
      {
        title: '操作',
        dataIndex: '操作',
        align:'center',
        render:(text,record)=>{
            return (
                <div>
                    <a disabled={record.is_push == 2 ? true: false} onClick={() => this.edit(record)}>编辑</a>
                    <a disabled={record.is_push == 2 ? true : false} onClick={() => this.calculate(record)} style={{ marginLeft: '10px' }}>
                        {record.ftime?'重新计算':'计算'}
                    </a>
                </div>
            )
        }
      },
    ];
  }

  handState(val){
      this.setState({
          visible:val
      },()=>{
        this.props.handSave();
      })
  }

  onChange =(pagination)=>{
    this.props.changePage(pagination)
  }

  edit(record) {
    Divide.viewmonth({mid:record.id}).then(res=>{
        this.setState({
            info: res.data,
            visible:true,
            id:res.data.id
        })
    })

  }
    calculate(record) {
        Divide.calculate({ mid: record.id }).then(res => {
            this.props.handSave();
        })
    }
  hideModal = () => {
    this.setState({visible: false});
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
          align:col.align,
          title: col.title
        }),
      };
    });


    return (
        <div>
            <Table
                loading={this.props.loading}
                pagination={{total:this.props.total,pageSize:this.props.pagesize}}
                onChange={this.onChange}
                rowKey={record=> record.id}
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
                <WrappedNormalLoginForm id={this.state.id} onCancel={this.hideModal} initData={this.state.info} handState={val=>this.handState(val)}/>
            </Modal>
        </div>
    );
  }
}


class setMonthly extends Component{
    constructor(props){
        super(props);
        this.state={
            data:[],
            page:1,
            type:'',
            month:'',
            total:'',
            pagesize:'',
            loading:true
        }
    };

    request(){
        Divide.monthList({
            month:this.state.month,
            type:this.state.type,
            page:this.state.page
        }).then(res=>{
            this.setState({
                data: res.data.list,
                total:res.data.total,
                pagesize:res.data.pagesize,
                loading:false
            })
        })
    }

    componentDidMount() {
        this.request();
     }

     changePage(val){
        this.setState({
            page:parseInt(val.current)
        }, ()=> {
            this.request();
        })
     }

     handQuery(val){
        this.setState({
            month:dataTime,
            type:val.type
        },()=>{
            this.request();
        })
     }

     handSave(){
         this.request();
     }

    render(){
        return(
            <div>
                <WrappedHorizontalLoginForm handQuery={val=>this.handQuery(val)}/>
                <EditableTable loading={this.state.loading} data={this.state.data} total={this.state.total} pagesize={this.state.pagesize} handSave={val=>this.handSave()} changePage={val=>this.changePage(val)}/>
            </div>
        )
    }
}

export default setMonthly;