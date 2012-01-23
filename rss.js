importPackage(java.text);
importPackage(java.util);

function rss(title, arr) {
    var rfc822 = new SimpleDateFormat("EEE', 'dd' 'MMM' 'yyyy' 'HH:mm:ss' 'Z", Locale.US);
    
    var str = '<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">';
    str += '<channel>';
    str += '<title>'+title+'</title>\
        <link xmlns="http://www.w3.org/2005/Atom" rel="http://api.friendfeed.com/2008/03#sup" href="http://disqus.com/sup/all.sup#forumcomments-dca68d04" type="application/json"/>\
        <link>http://www.cropontology.org</link>\
        <description/>\
        <language>en</language>\
        <lastBuildDate>'+(arr.length ? rfc822.format(arr[0].created) : "")+'</lastBuildDate>';

    for(var i=0,len=arr.length; i<len; i++) {
        str += '<item>\
            <title>'+title+'</title>\
            <link>http://www.cropontology.org/terms/'+arr[i].termId+'/comments</link>\
            <description>'+arr[i].comment+'</description>\
            <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">'+arr[i].author+'</dc:creator>\
            <pubDate>'+rfc822.format(arr[i].created)+'</pubDate>\
        </item>';
    }
    str += '</channel></rss>';

    return str;
}
exports = rss;
