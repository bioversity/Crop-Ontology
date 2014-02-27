# Crop Ontology curation tool to help organize and share ontologies.

The system is built using the [ApeJS](https://github.com/lmatteis/apejs)
framework.

## Installation

**You need to have latest Java to run this**.

Simply clone the project:

    git clone git@github.com:bioversity/Crop-Ontology.git

The generated `Crop-Ontology` directory acts as a standard `war` directory that you can deploy in any servlet container. 

Make sure all the settings inside `WEB-INF/web.xml` are correct. Most specifically the `development` init parameter and the `rdf-path` location which is where all your data is going to be stored. 

## Running

To run Crop Ontology you could use `jetty-runner`:

    java -jar jetty-runner.jar Crop-Ontology/

That's it! File an issue if you need help, or just fork the project to improve it!

Thanks,
Luca
