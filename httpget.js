importPackage(java.io);
importPackage(java.lang);
importPackage(java.net);

var httpget = function(url) {
    try {
        var url = new URL(url);
        var connection = url.openConnection();

        // Get the response
        var answer = new StringBuffer();
        var reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        var line;
        while ((line = reader.readLine()) != null) {
            answer.append(line);
        }
        reader.close();
    } catch(e) {
        return e.javaException.getMessage();
    }
    return answer.toString();
}
