import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(here, "README.md")) as f:
    README = f.read()
with open(os.path.join(here, "CHANGES.txt")) as f:
    CHANGES = f.read()

requires = [
    "plaster_pastedeploy",
    "pyramid",
    "pyramid_jinja2",
    "pyramid_debugtoolbar",
    "waitress",
    "alembic",
    "pyramid_retry",
    "pyramid_tm",
    "SQLAlchemy",
    "transaction",
    "zope.sqlalchemy",
]

tests_require = [
    "WebTest >= 1.3.1",  # py3 compat
    "pytest >= 3.7.4",
    "pytest-cov",
]

setup(
    name="cropontology",
    version="1.0",
    description="Crop Ontology Website",
    long_description=README + "\n\n" + CHANGES,
    classifiers=[
        "Programming Language :: Python",
        "Framework :: Pyramid",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
    ],
    author="Alliance Bioversity-CIAT",
    author_email="helpdesk@cropontology-curationtool.org",
    url="https://www.cropontology.org/",
    keywords="web pyramid pylons",
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    extras_require={
        "testing": tests_require,
    },
    install_requires=requires,
    entry_points={
        "paste.app_factory": [
            "main = cropontology:main",
        ],
        "console_scripts": ["create_config = cropontology.scripts.create_config:main"],
    },
)
