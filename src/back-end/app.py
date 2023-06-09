from flask import Flask, request, jsonify
import json

import app_mongodb

app = Flask(__name__)


def get_parameters(req):
    return json.loads(req.data.decode('utf8').replace("'", '"'))


@app.route('/mongodb/connect', methods=["POST"])
def connect_mongo_db():
    parameters = get_parameters(request)
    result = app_mongodb.connect(parameters)
    return jsonify(result)


@app.route('/mongodb/delete_document', methods=["POST"])
def delete_document_mongo_db():
    parameters = get_parameters(request)
    result = app_mongodb.delete_document(parameters)
    return jsonify(result)


@app.route('/mongodb/databases', methods=["POST"])
def databases_mongo_db():
    parameters = get_parameters(request)
    result = app_mongodb.get_databases(parameters)
    return jsonify(result)


@app.route('/mongodb/collections', methods=["POST"])
def collections_mongo_db():
    parameters = get_parameters(request)
    result = app_mongodb.get_collections(parameters)
    return result


@app.route('/mongodb/documents', methods=["POST"])
def documents_mongo_db():
    parameters = get_parameters(request)
    result = app_mongodb.get_documents(parameters)
    return jsonify(result)


@app.route('/mongodb/insert_documents', methods=["POST"])
def insert_documents_mongo_db():
    parameters = get_parameters(request)
    result = app_mongodb.insert_documents(parameters)
    return jsonify(result)


@app.route('/mongodb/drop_collection', methods=["POST"])
def drop_collection_mongo_db():
    parameters = get_parameters(request)
    result = app_mongodb.drop_collection(parameters)
    return jsonify(result)


@app.route('/mongodb/update_document', methods=["POST"])
def update_document_mongo_db():
    parameters = get_parameters(request)
    result = app_mongodb.update_document(parameters)
    return jsonify(result)
