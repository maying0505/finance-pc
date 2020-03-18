import Loadable from 'react-loadable';
import Loading from '../components/Loading';

const AsyncError = Loadable({
        loader: () => import('../components/ErrorPage'),
        loading: Loading,
    }
);
const AsyncLoading = Loadable({
        loader: () => import('../components/Loading'),
        loading: Loading,
    }
);
const AsyncNotFound = Loadable({
        loader: () => import('../components/NotFound'),
        loading: Loading,
    }
);
const AsyncErrorBoundary = Loadable({
        loader: () => import('../components/ErrorBoundary'),
        loading: Loading,
    }
);

const Login = Loadable({
    loader: () => import('../pages/Login'),
    loading: Loading,
});
const Layout = Loadable({
    loader: () => import('../pages/Layout'),
    loading: Loading,
});


const UserList = Loadable({loader: () => import('../pages/UserList'), loading: Loading});
const LoanList = Loadable({loader: () => import('../pages/LoanList'), loading: Loading});
const AuditFirstTrialList = Loadable({loader: () => import('../pages/AuditFirst/TrialList'), loading: Loading});
const AuditFirstTrialRefuseList = Loadable({loader: () => import('../pages/AuditFirst/RefuseList'), loading: Loading});
const AuditFirstTrialDetail = Loadable({loader: () => import('../pages/AuditFirst/Detail'), loading: Loading});
const ReviewAuditList = Loadable({loader: () => import('../pages/Review/ReviewAuditList'), loading: Loading});
const ReviewAuditRejectList = Loadable({
    loader: () => import('../pages/Review/ReviewAuditRejectList'),
    loading: Loading
});
const ReviewDetail = Loadable({loader: () => import('../pages/Review/ReviewDetail'), loading: Loading});
const ArtificialAuditStateChange = Loadable({
    loader: () => import('../pages/Review/ArtificialAuditStateChange'),
    loading: Loading
});


// 消金
const PayRecordList = Loadable({loader: () => import('../pages/PayManager/PayRecordList'), loading: Loading});
const ThirdPartyPayRecordList = Loadable({
    loader: () => import('../pages/PayManager/ThirdPartyPayRecordList'),
    loading: Loading,
});
const OfflinePayRecordList = Loadable({
    loader: () => import('../pages/PayManager/OfflinePayRecordList'),
    loading: Loading
});
const RepaymentLoanList = Loadable({
    loader: () => import('../pages/RepaymentManager/RepaymentLoanList'),
    loading: Loading
});
const RepaymentList = Loadable({
    loader: () => import('../pages/RepaymentManager/RepaymentList'),
    loading: Loading
});
const RepaymentRecordList = Loadable({
    loader: () => import('../pages/RepaymentManager/RepaymentRecordList'),
    loading: Loading
});
const ThirdRepayRecordList = Loadable({
    loader: () => import('../pages/RepaymentManager/ThirdRepayRecordList'),
    loading: Loading
});
const RepayRecordAlipayList = Loadable({
    loader: () => import('../pages/RepaymentManager/RepayRecordAlipayList'),
    loading: Loading
});
const PaymentChannelManager = Loadable({
    loader: () => import('../pages/ConfigManager/PaymentChannelManager'),
    loading: Loading
});
const ReportRemaining = Loadable({
    loader: () => import('../pages/FinanceReport/ReportRemaining'),
    loading: Loading
});
const ReportOverdueData = Loadable({
    loader: () => import('../pages/FinanceReport/ReportOverdueData'),
    loading: Loading
});
const ReportPrincipalPayment = Loadable({
    loader: () => import('../pages/FinanceReport/ReportPrincipalPayment'),
    loading: Loading
});
const DailyReport = Loadable({
    loader: () => import('../pages/FinanceReport/DailyReport'),
    loading: Loading
});
const MonthlyReport = Loadable({
    loader: () => import('../pages/FinanceReport/MonthlyReport'),
    loading: Loading
});
const ChannelReportToday = Loadable({
    loader: () => import('../pages/OperationalData/ChannelReportToday'),
    loading: Loading
});
const ChannelList = Loadable({
    loader: () => import('../pages/ChannelManager/ChannelList'),
    loading: Loading
});
const ChannelRateList = Loadable({
    loader: () => import('../pages/ChannelManager/ChannelRateList'),
    loading: Loading
});
const ChannelView = Loadable({
    loader: () => import('../pages/ChannelManager/ChannelView'),
    loading: Loading
});
const ChannelRegiest = Loadable({
    loader: () => import('../pages/ChannelManager/ChannelRegiest'),
    loading: Loading
});
const ReportDailyRepayment = Loadable({
    loader: () => import('../pages/ChannelManager/ReportDailyRepayment'),
    loading: Loading
});
const ReportDailyLoanDetail = Loadable({
    loader: () => import('../pages/ChannelManager/ReportDailyLoanDetail'),
    loading: Loading
});
const ReportAfterOrder = Loadable({
    loader: () => import('../pages/OperationalData/ReportAfterOrder'),
    loading: Loading
});
const ReportDailyPeriod = Loadable({
    loader: () => import('../pages/OperationalData/ReportDailyPeriod'),
    loading: Loading
});
const ReportChumUser = Loadable({
    loader: () => import('../pages/OperationalData/ReportChumUser'),
    loading: Loading
});
const ReportChannelRepayment = Loadable({
    loader: () => import('../pages/OperationalData/ReportChannelRepayment'),
    loading: Loading
});
const ReportSummary = Loadable({
    loader: () => import('../pages/OperationalData/ReportSummary'),
    loading: Loading
});
const CallComplaints = Loadable({
    loader: () => import('../pages/CustomerServiceManager/CallComplaints'),
    loading: Loading
});
const Feedback = Loadable({
    loader: () => import('../pages/CustomerServiceManager/Feedback'),
    loading: Loading
});
const RollCall = Loadable({
    loader: () => import('../pages/CustomerServiceManager/RollCall'),
    loading: Loading
});
const ChannelReportDayRegister = Loadable({
    loader: () => import('../pages/ChannelManager/ChannelReportDayRegister'),
    loading: Loading
});

const LoginComponentProps = {
    path: '/',
    link: '/',
    component: Login,
    exact: true,
};

const LayoutRoute = [
    {
        id: 0,
        path: '/main/user/list',
        link: '/main/user/list',
        exact: true,
        component: UserList,
    },
    {
        id: 1,
        path: '/main/loan/list',
        link: '/main/loan/list',
        exact: true,
        component: LoanList,
    },
    {
        id: 2,
        path: '/main/first-aduit/list',
        link: '/main/first-aduit/list',
        exact: true,
        component: AuditFirstTrialList,
    },
    {
        id: 3,
        path: '/main/first-aduit/reject-list',
        link: '/main/first-aduit/reject-list',
        exact: true,
        component: AuditFirstTrialRefuseList,
    },
    {
        id: 4,
        path: '/main/check-aduit/list',
        link: '/main/check-aduit/list',
        exact: true,
        component: ReviewAuditList,
    },
    {
        id: 5,
        path: '/main/first-aduit/reject-list/detail/:userId/:orderId',
        link: '/main/first-aduit/reject-list/detail/:userId/:orderId',
        exact: true,
        component: AuditFirstTrialDetail,
    },
    {
        id: 6,
        path: '/main/pay-finance/list',
        link: '/main/pay-finance/list',
        exact: true,
        component: PayRecordList,
    },
    {
        id: 7,
        path: '/main/pay-finance/online-list',
        link: '/main/pay-finance/online-list',
        exact: true,
        component: ThirdPartyPayRecordList,
    },
    {
        id: 8,
        path: '/main/pay-finance/offline-list',
        link: '/main/pay-finance/offline-list',
        exact: true,
        component: OfflinePayRecordList,
    },
    {
        id: 9,
        path: '/main/check-aduit/reject-list',
        link: '/main/check-aduit/reject-list',
        exact: true,
        component: ReviewAuditRejectList,
    },
    {
        id: 10,
        path: '/main/loan-order/list',
        link: '/main/loan-order/list',
        exact: true,
        component: RepaymentLoanList,
    },
    {
        id: 11,
        path: '/main/repay/list',
        link: '/main/repay/list',
        exact: true,
        component: RepaymentList,
    },
    {
        id: 12,
        path: '/main/check-aduit/list/reviewDetail/:userId/:orderId/:type',
        link: '/main/check-aduit/list/reviewDetail/:userId/:orderId/:type',
        exact: true,
        component: ReviewDetail,
    },
    {
        id: 13,
        path: '/main/repay-record/list',
        link: '/main/repay-record/list',
        exact: true,
        component: RepaymentRecordList,
    },
    {
        id: 14,
        path: '/main/check-aduit/setting',
        link: '/main/check-aduit/setting',
        exact: true,
        component: ArtificialAuditStateChange,
    },
    {
        id: 15,
        path: '/main/repay-record/online-list',
        link: '/main/repay-record/online-list',
        exact: true,
        component: ThirdRepayRecordList,
    },
    {
        id: 16,
        path: '/main/repay-record/offline-list',
        link: '/main/repay-record/offline-list',
        exact: true,
        component: RepayRecordAlipayList,
    },
    {
        id: 17,
        path: '/main/pay-channel/list',
        link: '/main/pay-channel/list',
        exact: true,
        component: PaymentChannelManager,
    },
    {
        id: 18,
        path: '/main/report/remaining/list',
        link: '/main/report/remaining/list',
        exact: true,
        component: ReportRemaining,
    },
    {
        id: 19,
        path: '/main/report/overdue-data/list',
        link: '/main/report/overdue-data/list',
        exact: true,
        component: ReportOverdueData,
    },
    {
        id: 20,
        path: '/main/report/principal-payment/list',
        link: '/main/report/principal-payment/list',
        exact: true,
        component: ReportPrincipalPayment,
    },
    {
        id: 21,
        path: '/main/report/dailyReport',
        link: '/main/report/dailyReport',
        exact: true,
        component: DailyReport,
    },
    {
        id: 22,
        path: '/main/report/monthlyReport',
        link: '/main/report/monthlyReport',
        exact: true,
        component: MonthlyReport,
    },
    {
        id: 23,
        path: '/main/channelReport/todayList',
        link: '/main/channelReport/todayList',
        exact: true,
        component: ChannelReportToday,
    },
    {
        id: 24,
        path: '/main/channel/list',
        link: '/main/channel/list',
        exact: true,
        component: ChannelList,
    },
    {
        id: 25,
        path: '/main/channelRate/list',
        link: '/main/channelRate/list',
        exact: true,
        component: ChannelRateList,
    },
    {
        id: 26,
        path: '/main/report/after-order/list',
        link: '/main/report/after-order/list',
        exact: true,
        component: ReportAfterOrder,
    },
    {
        id: 27,
        path: '/main/report/daily-period/list',
        link: '/main/report/daily-period/list',
        exact: true,
        component: ReportDailyPeriod,
    },
    {
        id: 28,
        path: '/main/report/chum-user/list',
        link: '/main/report/chum-user/list',
        exact: true,
        component: ReportChumUser,
    },
    {
        id: 29,
        path: '/main/report/channel-repayment/list',
        link: '/main/report/channel-repayment/list',
        exact: true,
        component: ReportChannelRepayment,
    },
    {
        id: 30,
        path: '/main/channel-view/channelView',
        link: '/main/channel-view/channelView',
        exact: true,
        component: ChannelView,
    },
    {
        id: 31,
        path: '/main/channel-view/regiestList',
        link: '/main/channel-view/regiestList',
        exact: true,
        component: ChannelRegiest,
    },
    {
        id: 32,
        path: '/main/data/platform-repay',
        link: '/main/data/platform-repay',
        exact: true,
        component: ReportDailyRepayment,
    },
    {
        id: 33,
        path: '/main/data/platform-pay',
        link: '/main/data/platform-pay',
        exact: true,
        component: ReportDailyLoanDetail,
    },
    {
        id: 34,
        path: '/main/report/summary',
        link: '/main/report/summary',
        exact: true,
        component: ReportSummary,
    },
    {
        id: 35,
        path: '/main/check-aduit/reject-list/reviewDetail/:userId/:orderId',
        link: '/main/check-aduit/reject-list/reviewDetail/:userId/:orderId',
        exact: true,
        component: ReviewDetail,
    },
    {
        id: 36,
        path: '/main/loan/list/reviewDetail/:userId/:orderId',
        link: '/main/loan/list/reviewDetail/:userId/:orderId',
        exact: true,
        component: ReviewDetail,
    },
    {
        id: 37,
        path: '/main/customerServiceManager/feedback',
        link: '/main/customerServiceManager/feedback',
        exact: true,
        component: Feedback,
    },
    {
        id: 38,
        path: '/main/customerServiceManager/callComplaints',
        link: '/main/customerServiceManager/callComplaints',
        exact: true,
        component: CallComplaints,
    },
    {
        id: 39,
        path: '/main/customerServiceManager/roll-call',
        link: '/main/customerServiceManager/roll-call',
        exact: true,
        component: RollCall,
    },
    {
        id: 40,
        path: '/main/channelReport/dayRegister',
        link: '/main/channelReport/dayRegister',
        exact: true,
        component: ChannelReportDayRegister,
    },
    {
        component: AsyncNotFound,
    },
];

const mainRoute = [
    {
        path: '/main',
        link: '/main',
        exact: false,
        component: Layout,
    },
    ...LayoutRoute,
];

export {
    mainRoute,
    AsyncError,
    AsyncLoading,
    LayoutRoute,
    AsyncErrorBoundary,
    LoginComponentProps,
}