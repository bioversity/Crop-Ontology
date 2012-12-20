# Crop Ontology curation tool to help organize and share ontologies.

The system is built using the [ApeJS](https://github.com/lmatteis/apejs)
framework and is meant to be used with [Google App Engine](http://code.google.com/appengine/).

## Installation

**You need to have latest Java to run this**.

Simply clone the project:

    git clone git@github.com:lmatteis/Crop-Ontology.git

The generated `Crop-Ontology` directory acts as a `war` directory. Before you can deploy this to App Engine you must first copy `appengine-sdk/lib/users/appengine-api-1.0-sdk-x.y.z.jar` from the App Engine Java SDK into the `Crop-Ontology/WEB-INF/lib/` folder of the project.

Make sure all the settings inside `WEB-INF/appengine-web.xml` are correct (most specifically the application id of your app) and type this to deploy:

    sh appengine-sdk/bin/appcfg.sh update Crop-Ontology

That's it! File an issue if you need help, or just fork the project to improve it!

Thanks,
Luca
