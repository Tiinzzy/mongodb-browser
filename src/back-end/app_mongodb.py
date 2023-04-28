from mongodb_client import MongoDBClient
from bson import ObjectId


def connect(parameters):
    host_name = parameters.get('host_name')
    port_name = parameters.get('port_name')

    client = MongoDBClient(host_name, port_name)
    connection_ok = client.connect()
    client.disconnect()
    return {'result': connection_ok}


def get_databases(parameters):
    host_name = parameters.get('host_name')
    port_name = parameters.get('port_name')

    client = MongoDBClient(host_name, port_name)
    connection = client.connect()
    if connection:
        database_cursor = client.list_databases()
        database_list = list(database_cursor)
        client.disconnect()
        return {'available_databases': database_list}
    else:
        return {'result': False}


def get_collections(parameters):
    host_name = parameters.get('host_name')
    port_name = parameters.get('port_name')
    database_name = parameters.get('database_name')

    client = MongoDBClient(host_name, port_name)
    connection = client.connect()
    if connection:
        collections = client.list_collections(database_name)
        client.disconnect()
        return {'collections': collections}
    else:
        return {'result': False}


def get_documents(parameters):
    host_name = parameters.get('host_name')
    port_name = parameters.get('port_name')
    database_name = parameters.get('database_name')
    collection_name = parameters.get('collection_name')
    search_condition = parameters.get('search_condition')
    return_fields = parameters.get('return_fields')

    if search_condition is not None and '_id' in search_condition:
        if search_condition['_id'][0].isdigit():
            search_condition['_id'] = ObjectId(search_condition['_id'])
        else:
            return search_condition

    client = MongoDBClient(host_name, port_name)
    connection = client.connect()
    if connection:
        documents = client.search_all_documents(database_name, collection_name, search_condition, return_fields)
        client.disconnect()
        return documents
    else:
        return {'result': False}


def insert_documents(parameters):
    host_name = parameters.get('host_name')
    port_name = parameters.get('port_name')
    database_name = parameters.get('database_name')
    collection_name = parameters.get('collection_name')
    documents = parameters.get('documents')

    client = MongoDBClient(host_name, port_name)
    connection = client.connect()
    if connection:
        result = client.insert_documents(database_name, collection_name, documents)
        client.disconnect()
        return result
    else:
        return {'result': False}


def drop_collection(parameters):
    host_name = parameters.get('host_name')
    port_name = parameters.get('port_name')
    database_name = parameters.get('database_name')
    collection_name = parameters.get('collection_name')

    client = MongoDBClient(host_name, port_name)
    connection = client.connect()
    if connection:
        result = client.drop_collection(database_name, collection_name)
        client.disconnect()
        return result
    else:
        return {'result': False}


def delete_document(parameters):
    host_name = parameters.get('host_name')
    port_name = parameters.get('port_name')
    database_name = parameters.get('database_name')
    collection_name = parameters.get('collection_name')
    _id = parameters.get('_id')

    client = MongoDBClient(host_name, port_name)
    connection = client.connect()
    if connection:
        result = client.delete_document(database_name, collection_name, _id)
        client.disconnect()
        return {'result': result}
    else:
        return {'result': False}


def update_document(parameters):
    host_name = parameters.get('host_name')
    port_name = parameters.get('port_name')
    database_name = parameters.get('database_name')
    collection_name = parameters.get('collection_name')
    document_id = parameters.get('document_id')
    documents = parameters.get('documents')

    client = MongoDBClient(host_name, port_name)
    connection = client.connect()
    if connection:
        result = client.update_document(database_name, collection_name, document_id, documents)
        client.disconnect()
        return result
    else:
        return {'result': False}
