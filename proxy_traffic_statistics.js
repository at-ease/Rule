// 统计代理流量的脚本
let traffic = $persistentStore.read("proxy_traffic");
let currentDate = new Date();
let dateStr = currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getDate();

if (!traffic) {
    traffic = {};
}

let dailyUsage = {
    upload: $network.proxy.uplinkBytes,    // 只统计代理上传流量
    download: $network.proxy.downlinkBytes // 只统计代理下载流量
};

traffic[dateStr] = dailyUsage;
$persistentStore.write(JSON.stringify(traffic));

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

let message = "今日代理流量统计\n";
message += "上传：" + formatBytes(dailyUsage.upload) + "\n";
message += "下载：" + formatBytes(dailyUsage.download) + "\n";
message += "总计：" + formatBytes(dailyUsage.upload + dailyUsage.download);

$notify("代理流量统计", dateStr, message);
