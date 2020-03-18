import Apis from './Api';
import {MyFetch} from '../../utils';

// 贷前
export function login(params = {}) {
    return MyFetch.postForm(Apis.login, params);
}

export function loginCaptcha(params = {},url_a = '') {
    return MyFetch.get(Apis.loginCaptcha, params, url_a);
}


//菜单导航
export function menuList(params = {}) {
    return MyFetch.postForm(Apis.menuList, params);
}

//密码修改
export function changePassword(params = {}) {
    return MyFetch.postForm(Apis.changePassword, params);
}

export function logout(params = {}) {
    return MyFetch.get(Apis.logout, params);
}

export function userList(params = {}) {
    return MyFetch.post(Apis.userList, params);
}

export function allChannel(params = {}) {
    return MyFetch.get(Apis.allChannel, params);
}

export function loanList(params = {}) {
    return MyFetch.post(Apis.loanList, params);
}

export function auditFirstTrialList(params = {}) {
    return MyFetch.post(Apis.auditFirstTrialList, params);
}

export function auditFirstTrialNote(params = {}) {
    return MyFetch.get(Apis.auditFirstTrialNote, params);
}

export function auditFirstTrialRefuseList(params = {}) {
    return MyFetch.post(Apis.auditFirstTrialRefuseList, params);
}

export function auditFirstTrialDetail(params = {}) {
    return MyFetch.get(Apis.auditFirstTrialDetail, params);
}

export function auditCheckAuditList(params = {}) {
    return MyFetch.post(Apis.auditCheckAuditList, params);
}

export function allAduitPerson(params = {}) {
    return MyFetch.get(Apis.allAduitPerson, params);
}

export function auditCheckAuditRejectList(params = {}) {
    return MyFetch.post(Apis.auditCheckAuditRejectList, params);
}

export function allStatus(params = {}) {
    return MyFetch.get(Apis.allStatus, params);
}

export function reviewDetail(params = {}) {
    return MyFetch.get(Apis.reviewDetail, params);
}

export function allCheckCode(params = {}) {
    return MyFetch.get(Apis.allCheckCode, params);
}

export function checkAduitNotice(params = {}) {
    return MyFetch.get(Apis.checkAduitNotice, params);
}

export function reviewAuditSubmit(params = {}) {
    return MyFetch.post(Apis.reviewAuditSubmit, params);
}

export function reviewConfigQuery(params = {}) {
    return MyFetch.get(Apis.reviewConfigQuery, params);
}

export function aduitDetail(params = {}) {
    return MyFetch.postForm(Apis.aduitDetail, params);
}

export function aduitSave(params = {}) {
    return MyFetch.postForm(Apis.aduitSave, params);
}

export function auditSubmit(params = {}) {
    return MyFetch.postForm(Apis.auditSubmit, params);
}

export function r360ReportGet(params = {}) {
    return MyFetch.get(Apis.r360ReportGet, params);
}

export function phoneMailListGet(params = {}) {
    return MyFetch.get(Apis.phoneMailListGet, params);
}

export function phoneMessageGet(params = {}) {
    return MyFetch.get(Apis.phoneMessageGet, params);
}


// 消金
export function alipayImport(params = {}) {
    return MyFetch.postForm(Apis.alipayImport, params);
}

export function changeCanLoanTime(params = {}) {
    return MyFetch.post(Apis.changeCanLoanTime, params);
}

export function changeUserStats(params = {}) {
    return MyFetch.post(Apis.changeUserStats, params);
}

export function blackFishReport(params = {}) {
    return MyFetch.get(Apis.blackFishReport, params);
}

export function channelReportDayRegister(params = {}) {
    return MyFetch.post(Apis.channelReportDayRegister, params);
}

export function rollCallSave(params = {}) {
    return MyFetch.postForm(Apis.rollCallSave, params);
}

export function rollCallList(params = {}) {
    return MyFetch.postForm(Apis.rollCallList, params);
}

export function personalIgnore(params = {}) {
    return MyFetch.postForm(Apis.personalIgnore, params);
}

export function personalProcess(params = {}) {
    return MyFetch.postForm(Apis.personalProcess, params);
}

export function personalSearchOpinion(params = {}) {
    return MyFetch.postForm(Apis.personalSearchOpinion, params);
}

export function allLoanProduct(params = {}) {
    return MyFetch.get(Apis.allLoanProduct, params);
}

export function slcDetail(params = {}) {
    return MyFetch.get(Apis.slcDetail, params);
}

export function taobaoDetail(params = {}) {
    return MyFetch.get(Apis.taobaoDetail, params);
}

export function reportSummaryList(params = {}) {
    return MyFetch.post(Apis.reportSummaryList, params);
}

export function allProduct(params = {}) {
    return MyFetch.post(Apis.allProduct, params);
}

export function reportDailyLoanDetail(params = {}) {
    return MyFetch.post(Apis.reportDailyLoanDetail, params);
}

export function reportDailyRepayment(params = {}) {
    return MyFetch.post(Apis.reportDailyRepayment, params);
}

export function payRequestLoanInfo(params = {}) {
    return MyFetch.postForm(Apis.payRequestLoanInfo, params);
}

export function channelRegiestList(params = {}) {
    return MyFetch.post(Apis.channelRegiestList, params);
}

export function channelViewUserChannels(params = {}) {
    return MyFetch.get(Apis.channelViewUserChannels, params);
}

export function channelView(params = {}) {
    return MyFetch.post(Apis.channelView, params);
}

export function channelRepaymentList(params = {}) {
    return MyFetch.post(Apis.channelRepaymentList, params);
}

export function channelRepaymentListExcel(params = {}) {
    return MyFetch.post(Apis.channelRepaymentListExcel, params);
}

export function chumUserList(params = {}) {
    return MyFetch.postForm(Apis.chumUserList, params);
}

export function dailyPeriodExcel(params = {}) {
    return MyFetch.postForm(Apis.dailyPeriodExcel, params);
}

export function dailyPeriodList(params = {}) {
    return MyFetch.postForm(Apis.dailyPeriodList, params);
}

export function channelRateSave(params = {}) {
    return MyFetch.postForm(Apis.channelRateSave, params);
}

export function getChannelDetail(params = {}) {
    return MyFetch.postForm(Apis.getChannelDetail, params);
}

export function saveChannel(params = {}) {
    return MyFetch.post(Apis.saveChannel, params);
}

export function allMerch(params = {}) {
    return MyFetch.post(Apis.allMerch, params);
}

export function channelList(params = {}) {
    return MyFetch.post(Apis.channelList, params);
}

export function ratelist(params = {}) {
    return MyFetch.post(Apis.ratelist, params);
}

export function allProvider(params = {}) {
    return MyFetch.post(Apis.allProvider, params);
}

export function allSettleType(params = {}) {
    return MyFetch.get(Apis.allSettleType, params);
}

export function afterUserList(params = {}) {
    return MyFetch.post(Apis.afterUserList, params);
}

export function afterPeoplePayment(params = {}) {
    return MyFetch.post(Apis.afterPeoplePayment, params);
}

export function afterOrderList(params = {}) {
    return MyFetch.post(Apis.afterOrderList, params);
}

export function channelReportTodayList(params = {}) {
    return MyFetch.post(Apis.channelReportTodayList, params);
}

export function loanDetailGet(params = {}) {
    return MyFetch.get(Apis.loanDetailGet, params);
}

export function dailyReport(params = {}) {
    return MyFetch.post(Apis.dailyReport, params);
}

export function monthReport(params = {}) {
    return MyFetch.post(Apis.monthReport, params);
}

export function reportPrincipalPaymentList(params = {}) {
    return MyFetch.post(Apis.reportPrincipalPaymentList, params);
}

export function reportOverdDataList(params = {}) {
    return MyFetch.post(Apis.reportOverdDataList, params);
}

export function reportRemainingList(params = {}) {
    return MyFetch.post(Apis.reportRemainingList, params);
}

export function discountDo(params = {}) {
    return MyFetch.post(Apis.discountDo, params);
}

export function repayRecordAlipayList(params = {}) {
    return MyFetch.post(Apis.repayRecordAlipayList, params);
}

export function thirdRepayRecordList(params = {}) {
    return MyFetch.post(Apis.thirdRepayRecordList, params);
}

export function repayLoanList(params = {}) {
    return MyFetch.post(Apis.repayLoanList, params);
}

export function payLoanList(params = {}) {
    return MyFetch.post(Apis.payLoanList, params);
}

export function repayRecordList(params = {}) {
    return MyFetch.post(Apis.repayRecordList, params);
}

export function thirdPartyPayRecord(params = {}) {
    return MyFetch.post(Apis.thirdPartyPayRecord, params);
}

export function offlinePayRecord(params = {}) {
    return MyFetch.post(Apis.offlinePayRecord, params);
}

export function payRecordList(params = {}) {
    return MyFetch.post(Apis.payRecordList, params);
}

export function thirdPartyRecordExport(params = {}) {
    return MyFetch.post(Apis.thirdPartyRecordExport, params);
}

export function offlineRecordExport(params = {}) {
    return MyFetch.post(Apis.offlineRecordExport, params);
}

export function payRecordExport(params = {}) {
    return MyFetch.post(Apis.payRecordExport, params);
}

export function repayRecordListExport(params = {}) {
    return MyFetch.post(Apis.repayRecordListExport, params);
}

export function thirdRepayRecordListExport(params = {}) {
    return MyFetch.post(Apis.thirdRepayRecordListExport, params);
}

export function repayRecordAlipayListExport(params = {}) {
    return MyFetch.post(Apis.repayRecordAlipayListExport, params);
}

export function payLoanListExport(params = {}) {
    return MyFetch.post(Apis.payLoanListExport, params);
}

export function repayLoanListExport(params = {}) {
    return MyFetch.post(Apis.repayLoanListExport, params);
}

export function partialRepayment(params = {}) {
    return MyFetch.post(Apis.partialRepayment, params);
}

export function finishRepayment(params = {}) {
    return MyFetch.post(Apis.finishRepayment, params);
}

export function modifyRemark(params = {}) {
    return MyFetch.postForm(Apis.modifyRemark, params);
}

export function alipayFinish(params = {}) {
    return MyFetch.postForm(Apis.alipayFinish, params);
}

export function alipayAgain(params = {}) {
    return MyFetch.postForm(Apis.alipayAgain, params);
}

export function financeTransChannel(params = {}) {
    return MyFetch.post(Apis.financeTransChannel, params);
}

export function AddOfflinePayment(params = {}) {
    return MyFetch.post(Apis.AddOfflinePayment, params);
}

export function payChannelEnable(params = {}) {
    return MyFetch.post(Apis.payChannelEnable, params);
}

export function payChannelSave(params = {}) {
    return MyFetch.post(Apis.payChannelSave, params);
}
