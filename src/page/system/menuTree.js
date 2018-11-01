import React from 'react';
import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;

export default class MenuTree extends React.Component {
    state = {
        checkIds: []
    }
    componentWillMount() {
        const data = this.props.data;
        let checkIds = this.state.checkIds;
        data.forEach(item => {
            if (item.checked == 1) {
                checkIds.push(item.id.toString())
            }
            if (item.children && item.children.length > 0) {
                item.children.forEach(i => {
                    if (i.checked == 1) {
                        checkIds.push(i.id.toString())
                    }
                })
            }
        });
        this.setState({
            checkIds: checkIds
        })
    }
    onSelect = (selectedKeys, info) => {
        // console.log('selected', selectedKeys, info);
    }

    onCheck = (checkedKeys, info) => {
        // console.log('onCheck', checkedKeys, info);
        this.setState({
            checkIds: checkedKeys
        })
        this.props.handleCheck(checkedKeys);
    }
    mergeArray=(arr1, arr2)=>{
        for (var i = 0; i < arr1.length; i++) {
            for (var j = 0; j < arr2.length; j++) {
                if (arr1[i] === arr2[j]) {
                    arr1.splice(i, 1); //利用splice函数删除元素，从第i个位置，截取长度为1的元素
                }
            }
        }
        //alert(arr1.length)
        for (var i = 0; i < arr2.length; i++) {
            arr1.push(arr2[i]);
        }
        return arr1;
    }
    checkIds(data){
        // console.log("chekc的值",this.props.data);
        let checkIds = [];
        let stateCheckIds = this.state.checkIds;
        data.forEach(item => {
            if (item.checked == 1) {
                checkIds.push(item.id.toString())
            }
            if (item.children && item.children.length > 0) {
                item.children.forEach(i => {
                    if (i.checked == 1) {
                        checkIds.push(i.id.toString())
                    }
                })
            }
        });
        return this.mergeArray(checkIds, stateCheckIds);
    }
    render() {
        // console.log(this.props.data)
        const data = this.props.data;
        return (
            <Tree
            checkable
            checkedKeys={this.checkIds(data)}
            onSelect={this.onSelect}
            onCheck={this.onCheck}
            >
                {
                    data.map((item,index)=>{
                        return (
                            <TreeNode title={item.menu_name} key={item.id}>
                                {
                                    item.children&&item.children.map((child,i)=>{
                                        return (
                                            <TreeNode title={child.menu_name} key={child.id} checkable={item.checked == 1?true:false} ></TreeNode>
                                        )
                                    })
                                }
                            </TreeNode>
                        )
                    })
                }
            </Tree>
        );
    }
}
