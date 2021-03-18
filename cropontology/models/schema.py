import json

from sqlalchemy import inspect

from .meta import metadata

__all__ = [
    "initialize_schema",
    "add_column_to_schema",
    "map_to_schema",
    "map_from_schema",
]

_SCHEMA = []


def initialize_schema():
    for table in metadata.sorted_tables:
        fields = []
        for column in table.c:
            fields.append(
                {"name": column.name, "storage": "db", "comment": column.comment}
            )
        _SCHEMA.append({"name": table.name, "fields": fields})


def add_column_to_schema(table_name, field_name, field_comment):
    """
    This function add new columns to the schema in the extra field
    :param table_name: Name of the table
    :param field_name: Name of the field
    :param field_comment: Comments on the field
    """
    for pos in range(len(_SCHEMA)):
        if _SCHEMA[pos]["name"] == table_name:
            found = False
            for field in _SCHEMA[pos]["fields"]:
                if field["name"] == field_name:
                    found = True
            if not found:
                _SCHEMA[pos]["fields"].append(
                    {"name": field_name, "storage": "extra", "comment": field_comment}
                )
            else:
                raise Exception(
                    "Field {} is already defined in table {}".format(
                        table_name, field_name
                    )
                )


def get_storage_type(table_name, field_name):
    """
    Retreives the storate type of a field in a table.
    :param table_name: Table name
    :param field_name: Field name
    :return: Storage type
    """
    storage_type = None
    for table in _SCHEMA:
        if table["name"] == table_name:
            for field in table["fields"]:
                if field["name"] == field_name:
                    storage_type = field["storage"]
    return storage_type


def map_to_schema(model_class, data):
    """
    This function maps a data dict to the schema
    Data fields that are mapped to the extra storage are converted to JSON and stored in _extra
    Data fields that are not present in the schema are discarded
    :param model_class: SQLAlchemy model class
    :param data:
    :return: Mapped dict that can be used to add or update data
    """
    mapped_data = {}
    extra_data = {}
    for key, value in data.items():
        storage_type = get_storage_type(model_class.__table__.name, key)
        if storage_type is not None:
            if storage_type == "db":
                mapped_data[key] = value
            else:
                extra_data[key] = value
    if bool(extra_data):
        mapped_data["extras"] = json.dumps(extra_data)
    if not bool(mapped_data):
        raise Exception(
            "The mapping for table {} is empty!".format(model_class.__table__.name)
        )
    return mapped_data


def map_from_schema(data):
    """
    This function maps a row/list of raw data from de database to the schema
    Data fields that resided in the extra storage are separated into independent fields
    :param data: Data as stored in the database
    :return: The data in a dict form or an array of dict
    """
    if type(data) is not list:
        mapped_data = {}
        if data is not None:
            if data.__class__.__name__ != "result":
                for c in inspect(data).mapper.column_attrs:
                    if c.key != "extras":
                        mapped_data[c.key] = getattr(data, c.key)
                    else:
                        if getattr(data, c.key) is not None:
                            jsondata = json.loads(getattr(data, c.key))
                            if bool(jsondata):
                                for key, value in jsondata.items():
                                    mapped_data[key] = value
            else:
                # noinspection PyProtectedMember
                dict_result = data._asdict()  # This is not private
                for key, value in dict_result.items():
                    if value.__class__.__module__ == "cropontology.models.cropontology":
                        for c in inspect(value).mapper.column_attrs:
                            if c.key != "extras":
                                mapped_data[c.key] = getattr(value, c.key)
                            else:
                                if getattr(value, c.key) is not None:
                                    jsondata = json.loads(getattr(value, c.key))
                                    if bool(jsondata):
                                        for key2, value2 in jsondata.items():
                                            mapped_data[key2] = value2
                    else:
                        if key != "extras":
                            mapped_data[key] = value
                        else:
                            if value is not None:
                                jsondata = json.loads(value)
                                if bool(jsondata):
                                    for key2, value2 in jsondata.items():
                                        mapped_data[key2] = value2

        return mapped_data
    else:
        mapped_data = []
        for row in data:
            temp = {}
            if row.__class__.__name__ != "result":
                for c in inspect(row).mapper.column_attrs:
                    if c.key != "extras":
                        temp[c.key] = getattr(row, c.key)
                    else:
                        if getattr(row, c.key) is not None:
                            jsondata = json.loads(getattr(row, c.key))
                            if bool(jsondata):
                                for key, value in jsondata.items():
                                    temp[key] = value
            else:
                # noinspection PyProtectedMember
                dict_result = row._asdict()  # This is not private
                for key, value in dict_result.items():
                    if value.__class__.__module__ == "cropontology.models.cropontology":
                        for c in inspect(value).mapper.column_attrs:
                            if c.key != "extras":
                                temp[c.key] = getattr(value, c.key)
                            else:
                                if getattr(value, c.key) is not None:
                                    jsondata = json.loads(getattr(value, c.key))
                                    if bool(jsondata):
                                        for key2, value2 in jsondata.items():
                                            temp[key2] = value2
                    else:
                        if key != "extras":
                            temp[key] = value
                        else:
                            if value is not None:
                                jsondata = json.loads(value)
                                if bool(jsondata):
                                    for key2, value2 in jsondata.items():
                                        temp[key2] = value2

            mapped_data.append(temp)
        return mapped_data
