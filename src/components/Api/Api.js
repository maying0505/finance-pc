// 贷前接口
const prefixFinancePrelend = ''; // api地址前缀
const ApiPrelend = (config => {
    Object.keys(config).forEach((item) => {
        config[item] = `${prefixFinancePrelend}${config[item]}`;
    });
    return config;
})({
    // login: '/sys-user/login',//登录
    login: '/sys-user/loginByCaptcha',//验证码登录
    loginCaptcha: '/sys-user/captcha',//获取登录验证码
    changePassword: '/sys-user/modify-password',//密码修改
    menuList: '/sys-menu/list',//菜单导航
    logout: '/sys-user/logout',//退出登陆
    userList: '/user/list',//用户列表
    changeUserStats: '/user/changeUserStats',//更改用户状态
    changeCanLoanTime: '/user/changeCanLoanTime',//更改可再借时间
    allChannel: '/channel/list',//获取所有渠道
    loanList: '/loan/list',//借款列表
    allStatus: '/loan/getAllStatus',//获取所有状态(订单状态+还款状态)
    auditFirstTrialList: '/first-aduit/list',//初审列表
    auditFirstTrialNote: '/first-aduit/notice',//初审列表-公告
    auditFirstTrialRefuseList: '/first-aduit/reject-list', //初审拒绝列表
    auditFirstTrialDetail: '/first-aduit/detail', //初审详情
    auditCheckAuditList: '/check-aduit/list',//复审审核列表
    checkAduitNotice: '/check-aduit/notice',//复审列表-公告
    allAduitPerson: '/check-aduit/getAllAduitPerson',//获取所有审核人员
    auditCheckAuditRejectList: '/check-aduit/reject-list',//复审审核拒绝列表
    reviewDetail: '/check-aduit/detail',//复审审核列表
    allCheckCode: '/check-aduit/getAllCheckCode',//复审-获取所有审核代码
    reviewAuditSubmit: '/check-aduit/aduit',//复审-审核
    reviewConfigQuery: '/review-config/query',//复审审核设置查看
    aduitDetail: '/check-aduit/getOutline',//复审审核草稿
    aduitSave: '/check-aduit/saveAudit',//复审审核保存
    auditSubmit: '/check-aduit/auditSubmit',//复审审核提交
    r360ReportGet: '/r360/report',//融360运营商报告
    phoneMailListGet: '/r360/phoneContancts',//手机通信录
    phoneMessageGet: '/r360/phoneMessage',//短信
    taobaoDetail: '/taobao/detail',//淘宝查询
    slcDetail: '/slc/detail',//多头查询
    blackFishReport: '/black-fish/report',//小黑鱼摩羯运营商报告
    allLoanProduct: '/product/list',//借款产品

});

// 消金接口
const prefixFinanceTrans = ''; // api地址前缀
const ApiTrans = (config => {
    Object.keys(config).forEach((item) => {
        config[item] = `${prefixFinanceTrans}${config[item]}`;
    });
    return config;
})({
    thirdPartyPayRecord: '/pay-request/b2c-online-list',//第三方打款列表
    offlinePayRecord: '/pay-request/b2c-offline-list',//线下打款列表
    payRecordList: '/pay-request/b2c-list',//打款记录列表
    thirdPartyRecordExport: '/pay-request/b2c-online-list-export',//第三方打款记录导出
    offlineRecordExport: '/pay-request/b2c-offline-list-export',//线下打款记录导出
    payRecordExport: '/pay-request/b2c-list-export',//打款记录列表导出
    financeTransChannel: '/pay-channel/list',//支付通道管理
    AddOfflinePayment: '/pay-request/offline-b2c-add',//新增线下打款凭证
    fileUpload: '/file/upload',//文件长传接口
    repayRecordList: '/pay-request/c2b-list',//还款记录列表
    repayRecordListExport: '/pay-request/c2b-list-export',//还款记录列表导出
    thirdRepayRecordList: '/pay-request/c2b-online-list',//第三方还款记录列表
    thirdRepayRecordListExport: '/pay-request/c2b-online-list-export',//第三方还款记录列表导出
    repayRecordAlipayList: '/pay-request/alipay-list',//支付宝还款记录列表
    repayRecordAlipayListExport: '/pay-request/alipay-list-export',//支付宝还款记录列表导出
    alipayImport: '/alipay/import',//支付宝还款记录列表导入
    payLoanList: '/loan-order-ex/list',//借款列表
    payLoanListExport: '/loan-order-ex/export',//借款列表导出
    repayLoanList: '/order-repayment/list',//还款列表
    repayLoanListExport: '/order-repayment/list-export',//还款列表
    partialRepayment: '/order-repayment/partial',//部分还款
    finishRepayment: '/order-repayment/finish',//置为已还款
    modifyRemark: '/alipay/modify',//修改备注
    alipayFinish: '/alipay/be-done',//置为已处理
    alipayAgain: '/alipay/be-do',//重新处理
    payChannelEnable: '/pay-channel/enable',//支付通道启用/停用
    payChannelSave: '/pay-channel/save',//支付通道保存
    discountDo: '/order-repayment/discount',//设置减免金额
    payRequestLoanInfo: '/pay-request/loan-info',//新增线下打款-识别

    //财务报表
    reportRemainingList: '/data/finance/duein',//贷款余额统计
    reportOverdDataList: '/data/finance/overdue',//逾期数据分布
    reportPrincipalPaymentList: '/data/finance/repay',//每日未还本金
    dailyReport: '/data/finance/in-out/1',//日表
    monthReport: '/data/finance/in-out/2',//月表
    loanDetailGet: '/report/loanDetail',//收付款明细

    //运营数据分析
    channelReportTodayList: '/channelReport/todayList',//渠道今日事实数据
    afterOrderList: '/report/after-order/list',//每日复借数据分析
    afterPeoplePayment: '/report/after-people-payment/list',//复借次数人数分布
    afterUserList: '/report/after-user/list',//复借间隔天数人数占比统计
    dailyPeriodList: '/report/daily-period/list',//每日各时段数据对比
    dailyPeriodExcel: '/report/daily-period/excel',//导出每日各时段数据对比
    chumUserList: '/report/chum-user/list',//每日流失数据统计
    channelRepaymentList: '/data/channel-repay',//渠道还款数据列表
    channelRepaymentListExcel: '/report/channel-repayment/excel',//渠道还款数据列表导出
    channelRegiestList: '/channel-view/regiestList',//渠道每日注册列表
    reportSummaryList: '/report/summary',//渠道数据汇总列表
    channelReportDayRegister: '/report/channel/adminLook',//渠道每日注册列表（新）
    reportDailyRepayment: '/data/platform-repay',//平台还款数据
    reportDailyLoanDetail: '/data/platform-pay',//平台放款数据
    

    // 渠道管理
    channelList: '/channel/channelList',//获取渠道列表
    ratelist: '/channel/ratelist',//渠道流量列表
    allSettleType: '/channel/allSettleType',//获取所有的结算类型
    allProvider: '/channel/allProvider',//获取所有渠道组
    allProduct: '/channel/allProduct',//获取所有产品
    allMerch: '/channel/allMerch',//获取所有商户
    saveChannel: '/channel/saveChannel',//保存渠道编辑
    getChannelDetail: '/channel/getChannel',//渠道详情
    channelRateSave: '/channel/edit',//渠道流量管理新增
    channelView: '/report/channel/look',//合作机构渠道观测
    channelViewUserChannels: '/channel-view/userChannels',//合作机构渠道观测-获取所有渠道

    //客服管理
    personalSearchOpinion: '/personal/searchOpinion',//意见反馈、催收投诉
    personalProcess: '/personal/process',//催收投诉处理
    personalIgnore: '/personal/ignore',//催收投诉-忽略
    rollCallList: '/roll-call/list',//来电登记问题反馈-列表
    rollCallSave: '/roll-call/saveRollCall',//来电登记问题反馈-提交
});

const Api = Object.assign({}, ApiPrelend, ApiTrans);

export default Api;