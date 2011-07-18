# Crop Ontology curation tool to help organize and share ontologies

The system is built using the [ApeJS](https://github.com/lmatteis/apejs)
framework and is meant to be used with [Google App Engine](http://code.google.com/appengine/).

## Installation

**You need to have latest Java to run this**.

The **first** thing you want to do is download the framework which this program is written with, ApeJS. To do that
just type this in you terminal

    git clone git@github.com:lmatteis/apejs.git

This will download the ApeJS framework and it will create an `apejs` directory. This directory is structured
as a standard Java web project, [war](http://en.wikipedia.org/wiki/Java_War), so you should probably read about that
before going on.

Once you familiarize with how WAR packages work, navigate to this folder: `apejs/war/WEB-INF`. Inside you'll find a 
sample `app` folder which is a basic example of a program written using the framework.

Now you want to actually download the Crop Ontology app. To do this simply clone the project from inside the `apejs/war/WEB-INF` directory:

    git clone git@github.com:lmatteis/Crop-Ontology.git

You'll see a `Crop-Ontology` directory appearing in there once you clone the project. This is the entire Crop-Ontology application code.

Next, you need to download the last dependency, which is **Google App Engine**'s Software Development Kit. Don't worry, this is the last dependency
after which you can start coding and it'll be really nice and easy. If you think about it it's just 2 dependencies, so not much at all.

So just google for Java's version App Engine's SDK and download that. Unzip it or whatever and you'll want to familiarize also with this
folder since it's basically a set of API's you'll be using for local development. One last thing you need to do before getting the a
Crop-Ontology app running is that you need to copy this jar file `appengine-sdk/lib/users/appengine-api-1.0-sdk-x.y.z.jar` from the AppEngine sdk you 
just downloaded into your `apejs` folder framework under `apejs/war/WEB-INF/lib`.

Great now start the app! To do this run App Engine's development server to point to your `war` directory:

   sh appengine-sdk/bin/dev_appserver.sh apejs/war

That's it! Email me if you need help: lmatteis@gmail.com
