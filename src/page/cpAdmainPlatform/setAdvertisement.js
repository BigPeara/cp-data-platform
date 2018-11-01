import { Component } from 'react';
import { DatePicker ,Form, Row, Col, Input, Button, Modal,Select,Table} from 'antd';
import Divide from '@/api/divideServer'
import moment from 'moment';
import styles from './style.less';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;

const Option = Select.Option;

const { RangePicker } = DatePicker;

let startTime='';
let endTime='';

function onChange(data,dataString){
    startTime=dataString[0];
    endTime=dataString[1];
}

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
            Divide.savead({
                aid:this.props.info.id,
                mmoney:values.mmoney
            }).then(res=>{
                this.props.handState(this.state.visible)
            })
        }
      });
    }

    render() {
        const formTailLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        const { getFieldDecorator } = this.props.form;
        const info = this.props.info;
      return (
        <Form
            className="ant-advanced-search-form"
            onSubmit={this.handleSubmit }>
            <FormItem label='广告分成金额' {...formTailLayout}>
                {getFieldDecorator('mmoney', {
                      rules: [{ required: true, message: '广告分成金额必填' }],
                      initialValue: info && info.mmoney || ''
                })(
                    <Input placeholder="请输入广告分成金额"/>
                )}
            </FormItem>
            <FormItem style={{ textAlign: 'center',width:'100%'}}>
                <Button  onClick={this.handModal} size="large" type="primary" htmlType="submit">保存</Button>
            </FormItem>
        </Form>
      );
    }
}
const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

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
                        <RangePicker onChange={onChange} placeholder={['开始时间', '结束时间']}/>
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
    this.state = { data:[],visible:false,info:{}};
    this.columns = [
      {
        title: '日期',
        dataIndex: 'cdate',
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
        title: '广告分成金额',
        dataIndex: 'mmoney',
        editable: true,
        align:'center'
      },
      {
        title: '广告阅读总数量',
        dataIndex: 'total',
        editable: true,
        align:'center'
      },
      {
        title: '上次计算时间',
        dataIndex: 'ftime',
        editable: true,
        align:'center'
      },
      {
        title: '是否发布',
        dataIndex: 'is_push',
        editable: true,
          align: 'center',
          render: (text, record) => {
              return (
                  <div>{record.is_push == 1 ? '未发' : '已发'}</div>
              )
          }
      },
      {
        title: '折扣后广告订阅数量',
        dataIndex: 'off_total',
        editable: true,
        align:'center'
      },
      {
        title: '折扣后广告分成金额',
        dataIndex: 'off_mmoney',
        editable: true,
        align:'center'
      },
      {
        title: '操作',
        dataIndex: '操作',
        align:'center',
        render:(text,record)=>{
            return(
                <a onClick={() => this.edit(record)}>编辑</a>
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

  edit(record) {
    //   debugger
    Divide.viewad({aid:record.id}).then(res=>{
        this.setState({
            visible:true,
            info:res.data
        })
    })

  }

  hideModal = () => {
    this.setState({visible: false});
  }

  onChange =(pagination)=>{
    this.props.changePage(pagination)
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
                    <WrappedNormalLoginForm info={this.state.info} handState={val=>this.handState(val)}/>
            </Modal>
        </div>
    );
  }
}


class setWorks extends Component{
    constructor(props){
        super(props);
        this.state={
            data:[],
            mindate:'',
            maxdate:'',
            type:0,
            page:1,
            total:'',
            pagesize:'',
            loading:true
        }
    };

    request(){
        Divide.adList({
            mindate:this.state.mindate,
            maxdate:this.state.maxdate,
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

     handSave(){
         this.request();
     }

     handQuery(val){
        this.setState({
            mindate:startTime,
            maxdate:endTime,
            type:val.type
        },()=>{
            this.request();
        })
     }

     changePage(val){
        this.setState({
            page:parseInt(val.current)
        }, ()=> {
            this.request();
        })
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

export default setWorks;