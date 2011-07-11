importPackage(com.google.appengine.api.blobstore);
importPackage(com.google.appengine.api.files);

var blobstore = {

    blobstoreService: BlobstoreServiceFactory.getBlobstoreService(),

    createUploadUrl: function(successPath) {
        return this.blobstoreService.createUploadUrl(successPath);
    },

    /**
     * this reads a blob into a string without the 1mb limit
     */
    read: function(blobKey) {
        var blobIs = new BlobstoreInputStream(blobKey);
        var reader = new BufferedReader(new InputStreamReader(blobIs));
        var sb = new StringBuilder();
        var line = null;
        while ((line = reader.readLine()) != null) {
            sb.append(line + "\n");
        }
        blobIs.close();
        var str = sb.toString();
        return str;
    },

    /**
     * writes a string to the blobstore
     * and returns the key reference of it
     */
    writeString: function(str) {
        // Get a file service
        var fileService = FileServiceFactory.getFileService();

        // Create a new Blob file with mime-type "text/plain"
        var file = fileService.createNewBlobFile("text/plain");

        // Open a channel to write to it
        var lock = true;
        var writeChannel = fileService.openWriteChannel(file, lock);

        // Different standard Java ways of writing to the channel
        // are possible. Here we use a PrintWriter:
        var out = new PrintWriter(java.nio.channels.Channels.newWriter(writeChannel, "UTF8"));
        out.print(str);

        // Close without finalizing and save the file path for writing later
        out.close();
        /*
        var path = file.getFullPath();

        // Write more to the file in a separate request:
        file = new AppEngineFile(path);

        // This time lock because we intend to finalize
        lock = true;
        writeChannel = fileService.openWriteChannel(file, lock);

        // This time we write to the channel using standard Java
        writeChannel.write(java.nio.ByteBuffer.wrap
                (new java.lang.String("And miles to go before I sleep.").getBytes()));

        */
        // Now finalize
        writeChannel.closeFinally();

        // Later, read from the file using the file API
        /*
        lock = false; // Let other people read at the same time
        var readChannel = fileService.openReadChannel(file, false);

        // Again, different standard Java ways of reading from the channel.
        var reader =
              new BufferedReader(java.nio.channels.Channels.newReader(readChannel, "UTF8"));  
           var line = reader.readLine();
        // line = "The woods are lovely dark and deep."

        readChannel.close();

        // Now read from the file using the Blobstore API
        var blobKey = fileService.getBlobKey(file);
        var segment = new java.lang.String(this.blobstoreService.fetchData(blobKey, 30, 40));
        */

        var blobKey = fileService.getBlobKey(file);
        return blobKey;
    }
};
