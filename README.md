# Crop Ontology curation tool to help organize and share ontologies.

The system is built using the [ApeJS](https://github.com/lmatteis/apejs)
framework.

## Installation

**You need to have latest Java to run this**.

Simply clone the project:

    git clone git@github.com:bioversity/Crop-Ontology.git

The generated `Crop-Ontology` directory acts as a standard `war` directory that you can deploy in any servlet container. 

Make sure all the settings inside `WEB-INF/web.xml` are correct (most specifically the URLs of your SPARQL endpoint). You could use `jetty-runner` to serve Crop Ontology:

    java -jar jetty-runner.jar Crop-Ontology/
    
For SPARQL we suggest using Fuseki, however other standard HTTP-based endpoints, such as 4store, will work.

That's it! File an issue if you need help, or just fork the project to improve it!

Thanks,
Luca
