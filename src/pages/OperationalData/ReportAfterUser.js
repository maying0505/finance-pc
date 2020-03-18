/**
 * @desc 复借间隔天数人数占比统计
 * */
import React from 'react';
import {Http} from '../../components';
import { message, Table} from 'antd';
import {PageSize} from '../../config';
import PropTypes from 'prop-types';
import './index.less';

export default class ReviewDetail extends React.PureComponent {
    static propTypes = {
        queryObj: PropTypes.object,
        isF: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        queryObj: {},
    };

    state = {
        pagination: {pageSize: PageSize, showTotal: total => `共${total}条`},
        loading: false,
        data: [],
        queryObj: {},
        isF: false
    };

    componentWillMount(){ //预加载数据
        this.propsGet(this.props);
        
    }
    componentWillReceiveProps(nextProps){ //组件接收到新的props时调用
        this.propsGet(nextProps);
    }

    propsGet(nextProps) {
        console.log('propsGet:',nextProps.isF,this.state.isF)
        if ((nextProps.isF !== this.state.isF) && nextProps.isF) {
            this.setState({
                queryObj: nextProps.queryObj,
                isF: nextProps.isF
            },function(){
                this._fetchData(1,nextProps.queryObj);
            })
        }
    }

    columns = [
        {
            title: '日期',
            dataIndex: 'createDate',
        },
        {
            title: '当天借款成功人数',
            dataIndex: 'userCount',
        },
        {
            title: '当天复借人数占比',
            dataIndex: 'userAfterCount',
        },
        {
            title: '1-5天内复借人数占比',
            dataIndex: 'userAfterCount1to5Rate',
        },
        {
            title: '6-10天内复借人数占比',
            dataIndex: 'userAfterCount6to10Rate',
        },
        {
            title: '11-15天复借人数占比',
            dataIndex: 'userAfterCount11to15Rate',
        },
        {
            title: '15天以上复借人数占比',
            dataIndex: 'userAfterCount15Rate',
        },
    ];

    _handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        }, () => {
            this._fetchData(pagination.current);
        });
    };

    _fetchData = async (pageNum, queryObj = this.state.queryObj) => {
        try {
            this.setState({loading: true});
            const {pagination} = this.state;
            const params = {
                current: pageNum,
                size: PageSize,
                ...queryObj,
            };
            const {code, message: msg, data} = await Http.afterUserList(params);
            
            let dataArr = [];
            if (code === 200) {
                const {total, records} = data;
                pagination.total = total;
                pagination.current = pageNum;
                if (Array.isArray(records)) {
                    dataArr = records;
                }
            } else {
                const msg1 = msg ? msg : '服务异常';
                message.warn(msg1);
            }
            console.log('11111',dataArr)
            this.setState({
                pagination,
                data: dataArr,
                loading: false,
                isF: false
            });
        } catch (e) {
            this.setState({loading: false, isF: false});
            const msg1 = e && e.message ? e.message : '服务异常';
            message.warn(msg1);
        }
    };



    render() {
        const {pagination, loading, data} = this.state;
        return (
            <Table
                bordered
                title={()=>{return <span>复借间隔天数人数占比统计</span>}}
                size='small'
                columns={this.columns}
                rowKey='channelId'
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={this._handleTableChange}
            />
                  
        )
    }
}

