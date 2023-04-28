from pymongo import MongoClient
from bson import ObjectId

TIME_OUT_MS = 10 * 1000


class MongoDBClient:
    def __init__(self, host_name='localhost', port_name=27017):
        self.mongo_host = host_name
        self.mongo_port = port_name
        self.mongo_client = None

    def connect(self):
        server_info = None
        try:
            self.mongo_client = MongoClient(self.mongo_host, self.mongo_port, timeoutMS=TIME_OUT_MS)
            server_info = self.mongo_client.server_info()
        except Exception as e:
            print(e)
        return server_info is not None

    def disconnect(self):
        self.mongo_client.close()

    def list_databases(self):
        return self.mongo_client.list_database_names()

    def list_collections(self, database_name):
        my_database = self.mongo_client[database_name]
        return my_database.list_collection_names()

    def search_all_documents(self, database_name, collection_name, condition=None, return_fields=None):
        my_database = self.mongo_client[database_name]
        collection = my_database.get_collection(collection_name)
        cursor = collection.find(condition, return_fields)
        result = dict()
        list_curser = list(cursor)
        for item in list_curser:
            item['_id'] = str(item['_id'])
        result['documents'] = list_curser
        result['length'] = len(list(cursor.clone()))
        return result

    def insert_documents(self, database_name, collection_name, documents):
        my_database = self.mongo_client[database_name]
        collection = my_database.get_collection(collection_name)
        cursor = collection.find()
        old_len = len(list(cursor.clone()))
        # for d in documents:
        #     collection.insert_one(d)
        collection.insert_many(documents)
        current_len = len(list(cursor.clone()))
        return {'inserted_count': current_len - old_len}

    def update_document(self, database_name, collection_name, document_id, documents):
        my_database = self.mongo_client[database_name]
        collection = my_database.get_collection(collection_name)
        update_document = {'_id': ObjectId(document_id)}
        new_values = {"$set": documents}
        try:
            update = collection.update_many(update_document, new_values, upsert=True)
            if update.matched_count == 1:
                return {'result': True}
            else:
                return {'result': False}
        except Exception as e:
            print(e)
            return {'error': e}

    def drop_collection(self, database_name, collection_name):
        my_database = self.mongo_client[database_name]
        initial_count = len(my_database.list_collection_names())
        collection = my_database.get_collection(collection_name)
        collection.drop()
        recent_count = len(my_database.list_collection_names())
        return {'result': initial_count != recent_count}

    def delete_document(self, database_name, collection_name, _id):
        my_database = self.mongo_client[database_name]
        collection = my_database.get_collection(collection_name)
        result = False
        try:
            result = collection.delete_one({'_id': ObjectId(_id)}).deleted_count == 1
        except Exception as e:
            print(e)
        return result
