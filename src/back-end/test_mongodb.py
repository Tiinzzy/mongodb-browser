import unittest
from mongodb_client import MongoDBClient
import json


class TestMongoDB(unittest.TestCase):

    def test_mongo_db_client_connection(self):
        mongo_db_client = MongoDBClient('localhost', 27017)
        self.assertTrue(mongo_db_client.connect())

        mongo_db_client.disconnect()

    def test_mongo_db_get_databases(self):
        mongo_db_client = MongoDBClient('localhost', 27017)
        self.assertTrue(mongo_db_client.connect())

        database_cursor = mongo_db_client.list_databases()
        database_list = list(database_cursor)
        self.assertTrue(len(database_list) > 0)

        mongo_db_client.disconnect()

    def test_mongo_db_get_collections(self):
        mongo_db_client = MongoDBClient('localhost', 27017)
        self.assertTrue(mongo_db_client.connect())

        database_cursor = mongo_db_client.list_databases()
        database_list = list(database_cursor)
        self.assertTrue(len(database_list) > 0)

        collections = mongo_db_client.list_collections('tina_db')
        self.assertTrue(len(collections) >= 0)

        mongo_db_client.disconnect()

    def test_mongo_db_search_documents(self):
        mongo_db_client = MongoDBClient('localhost', 27017)
        self.assertTrue(mongo_db_client.connect())

        database_cursor = mongo_db_client.list_databases()
        database_list = list(database_cursor)
        self.assertTrue(len(database_list) > 0)

        collections = mongo_db_client.list_collections('tina_db')
        self.assertTrue(len(collections) >= 0)

        all_documents = mongo_db_client.search_all_documents('tina_db', 'movies')
        self.assertTrue(len(all_documents['documents']) == all_documents['length'])

        mongo_db_client.disconnect()

    def test_mongo_db_insert_document(self):
        mongo_db_client = MongoDBClient('localhost', 27017)
        self.assertTrue(mongo_db_client.connect())

        database_cursor = mongo_db_client.list_databases()
        database_list = list(database_cursor)
        self.assertTrue(len(database_list) > 0)

        collections = mongo_db_client.list_collections('tina_db')
        self.assertTrue(len(collections) >= 0)

        f = open('data.json')
        data = json.load(f)
        insertion = mongo_db_client.insert_documents('tina_db', 'test', data)
        f.close()
        self.assertTrue(insertion['old_length'] >= 0)
        self.assertTrue(insertion['current_length'] > 0)

    def test_mongo_db_drop_collection(self):
        mongo_db_client = MongoDBClient('localhost', 27017)
        self.assertTrue(mongo_db_client.connect())

        database_cursor = mongo_db_client.list_databases()
        database_list = list(database_cursor)
        self.assertTrue(len(database_list) > 0)

        collections = mongo_db_client.list_collections('tina_db')
        self.assertTrue(len(collections) >= 0)

        dropping_result = mongo_db_client.drop_collection('tina_db', 'test')
        self.assertTrue(len(dropping_result) >= 0)
        mongo_db_client.disconnect()

    def test_mongo_db_documents(self):
        mongo_db_client = MongoDBClient('localhost', 27017)
        self.assertTrue(mongo_db_client.connect())

        database_cursor = mongo_db_client.list_databases()
        database_list = list(database_cursor)
        self.assertTrue(len(database_list) > 0)

        collections = mongo_db_client.list_collections('tina_db')
        self.assertTrue(len(collections) >= 0)

        all_documents = mongo_db_client.search_all_documents('tina_db', 'mahi-poopy')
        document_id = all_documents['documents'][0]['_id']

        update = mongo_db_client.update_document('tina_db', 'mahi-poopy', document_id, {'type': 'fishy-fishy-90'})
        print(update['result'].matched_count)
