const createIFrame = (item, triggerDelay, removeDelay) => {
    setTimeout(() => {
        const iFrame = document.createElement('iframe');
        iFrame.style.display = 'none';
        iFrame.src = item.downloadUrl;
        document.body.appendChild(iFrame);
        setTimeout(() => {
            document.body.removeChild(iFrame);
        }, removeDelay);
    }, triggerDelay);
};
const DownloadFile = (downloadUrl) => {
    console.log(downloadUrl)
    const triggerDelay = 100;
    const removeDelay = 3000;
    if (!downloadUrl) {
        return;
    }
    let item = {downloadUrl};
    createIFrame(item, triggerDelay, removeDelay);
};

export default DownloadFile;




