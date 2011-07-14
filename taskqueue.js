importPackage(com.google.appengine.api.taskqueue);

var taskqueue = (function() {

    function createTask(url, jsonTerm) {
        var queue = QueueFactory.getDefaultQueue();
        queue.add(TaskOptions.Builder.withUrl("/create-term").param("jsonTerm", jsonTerm));
    }

    return {
        createTask: createTask
    };
})();
