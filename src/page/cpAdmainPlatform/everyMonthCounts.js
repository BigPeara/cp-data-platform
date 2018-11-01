import { Component } from 'react';
import {DatePicker,Popconfirm,Form, Input, Button, Alert,Select,Table,Skeleton} from 'antd';
import countServer from '@/api/countServer'
import styles from './style.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;

const Option = Select.Option;

const { MonthPicker,RangePicker } = DatePicker;

class SearchForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible:false,
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

    rest = (e) =>{
        e.preventDefault();
        this.props.form.resetFields();
    }

    Submit= (e) =>{
        e.preventDefault();
        countServer.monthlyPush().then(res=>{})
    }
    SubmitPush = (e) => {
        countServer.monthlyPush().then(res => {
            this.props.handState({});
        })
    }

    render() {
        const options = this.state.result.map(d => <Option key={d.id}>{d.title}</Option>);
        const { result } = this.state;
        const push = this.props.push;
        const { getFieldDecorator } = this.props.form;
        const beforeMonth=moment().subtract(1,'month').format('YYYY-MM');
        const dataFormat='YYYY-MM';
        return(
            <div>
               <Form layout="inline"
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSearch}>
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
                            {getFieldDecorator('bid', {
                            rules: [{message: 'bid' }],
                        })(
                            <Input placeholder="请输入作品ID"/>
                        )}
                    </FormItem>
                    <FormItem>
                            {getFieldDecorator('name', {
                            rules: [{message: 'name' }],
                        })(
                            <Input placeholder="请输入作品名称"/>
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
                            initialValue: moment(beforeMonth,dataFormat)
                        })(
                            <MonthPicker placeholder="请选择开始月份" format='YYYY-MM' />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('laster',{
                            initialValue: moment(beforeMonth,dataFormat)
                        })(
                            <MonthPicker placeholder="请选择结束月份"/>
                        )}
                    </FormItem>
                    <FormItem>
                        <Button style={{ marginLeft: 8 }} type="primary"  htmlType="submit">
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
                      rules: [{
                        required: true,
                        message: '折扣后订阅数量',
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
    this.columns = [{
      title: '月份',
      dataIndex: 'cmonth',
      align:'center'
    }, {
      title: '业务',
      dataIndex: 'type_name',
      align:'center'
    }, {
        title: '作品名称',
        dataIndex: 'title',
        align:'left'
      },
      {
        title: '作品ID',
        dataIndex: 'bid',
          align: 'center',
      },{
        title: '所属cp',
        dataIndex: 'cptitle',
        align:'center'
    },{
        title: '发布时间',
        dataIndex: 'ptime',
        align:'center'
    },{
        title: '原始订阅数量',
        dataIndex: 'rtotal',
        align:'center'
    },{
        title: '折扣后订阅数量',
        dataIndex: 'off_rtotal',
        align:'center'
    },{
        title: '原始订阅总额',
        dataIndex: 'rmoney',
        align:'center'
    },{
        title: '折扣后订阅总额',
        dataIndex: 'off_rmoney',
        align:'center'
    },{
        title: '原始包月数量',
        dataIndex: 'mtotal',
        align:'center'
    },{
        title: '折扣后包月数量',
        dataIndex: 'off_mtotal',
        align:'center'
    },{
        title: '折扣后包月收入',
        dataIndex: 'off_mmoney',
        align:'center',
        render: (text, record) => {
            return (
                <div style={{ color: '#52C41A' }}>
                    {record.off_mtotal}
                </div>
            )
        }
    },
    // {
    //     title: '原始阅读数量',
    //     dataIndex: 'atotal',
    //     align:'left'
    // },{
    //     title: '折扣后阅读数量',
    //     dataIndex: 'off_atotal',
    //     align:'left'
    // },{
    //     title: '原始广告收入',
    //     dataIndex: 'amoney',
    //     align:'left'
    // },{
    //     title: '折扣后广告收入',
    //     dataIndex: 'off_amoney',
    //     align:'left'
    // }
    ];

  }

  onChange =(pagination)=>{
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
    this.props.handSave({data:newData,rows:row});
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
          align:col.align,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Table
          scroll={{ x: 1200}}
          loading={this.props.loading}
          pagination={{total:this.props.total,pageSize:this.props.pagesize}}
          onChange={this.onChange}
          rowKey={record=> record.id}
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={this.props.data}
          columns={columns}
        />
      </div>
    );
  }
}


class everyDayCounts extends Component{
    constructor(props){
        super(props);
        this.state={
            data:[],
            saveData:{},
            total:'',
            pagesize:'',
            bid:0,
            cpid:0,
            type:0,
            name:'',
            page:1,
            sum: {},
            loading:true
        }
    };

    request(){
        countServer.monthlyList({
            bid:this.state.bid,
            cpid:this.state.cpid,
            type:this.state.type,
            name:this.state.name,
            mindate: this.state.mindate,
            maxdate: this.state.maxdate,
            page:this.state.page
        }).then(res=>{
            this.setState({
                data: res.data.list,
                total:res.data.total,
                pagesize:res.data.pagesize,
                sum: res.data.sum,
                loading:false
            })
        })
    }

    componentDidMount() {
        this.request();
     }

     handSave(val){
        this.setState({
            data: val.data,
            saveData:val.rows
        })
     }

     handState(val){
        this.setState({
            bid:val.bid,
            type:val.type,
            name:val.name,
            mindate:val.picker==undefined ? '':val.picker.format('YYYY-MM'),
            maxdate: val.laster==undefined ? '':val.laster.format('YYYY-MM'),
            cpid: val.Complete
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
        const sum = this.state.sum;
        return(
            <div>
                <WrappedSearchForm saveData={this.state.saveData} handState={val=>this.handState(val)}/>
                <Skeleton loading={this.state.loading}>
                    <div className={styles.baseRow}>
                        <Alert message={`原始：累计订阅数量${sum.sum_rtotal || 0}；累计订阅总额${sum.sum_rmoney || 0}；累计包月订阅数量${sum.sum_mtotal || 0}。`} type="success" />
                    </div>
                    <div className={styles.baseRow}>
                        <Alert message={`折扣后：累计订阅数量${sum.sum_off_rtotal || 0}；累计订阅总额${sum.sum_off_rmoney || 0}；累计包月订阅数量${sum.sum_off_mtotal || 0}。`} type="error" />
                    </div>
                </Skeleton>
                <EditableTable loading={this.state.loading} data={this.state.data} total={this.state.total} pagesize={this.state.pagesize} handSave={val=>this.handSave(val)} changePage={val=>this.changePage(val)}/>
            </div>
        )
    }
}

export default everyDayCounts;