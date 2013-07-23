importPackage(java.io);
importPackage(java.lang);
importPackage(java.net);

var httpget = function(u) {
    var url = new java.net.URL(u);

    // Get the response
    var answer = new StringBuffer();
    var reader = new BufferedReader(new InputStreamReader(url.openStream()));
    var line;
    while ((line = reader.readLine()) != null) {
        answer.append(line);
    }
    reader.close();

    return answer.toString();
};

exports = httpget;
