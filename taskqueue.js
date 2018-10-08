importPackage(com.google.appengine.api.taskqueue);

var taskqueue = (function() {
	var tasks = 0;
	// memcache.put("tasks", 0);

    function createTask(url, jsonTerm) {
		tasks++;
		memcache.put("tasks", tasks);

        var queue = QueueFactory.getDefaultQueue();
        queue.add(TaskOptions.Builder.withUrl(url).param("jsonTerm", jsonTerm));
		// log(jsonTerm);

    }

    function getTasks() {
		// return memcache.get("tasks");
		// return tasks;
		return QueueFactory.getDefaultQueue().fetchStatistics().getNumTasks();
    }

    return {
        createTask: createTask,
		getTasks: getTasks
    };
})();
exports = taskqueue;
