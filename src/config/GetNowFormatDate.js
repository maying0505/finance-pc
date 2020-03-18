function GetNowFormatDate(type,num) {
    let curDate = new Date();
    let showTime = undefined;
    if (type === '0') {
        showTime = curDate.getTime() - (24*num)*60*60*1000;
    } else if (type === '1') {
        showTime = curDate.getTime() + (24*num)*60*60*1000;
    }

    let date = new Date(showTime); 
    let seperator1 = "-";
    let month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
};

export default GetNowFormatDate;