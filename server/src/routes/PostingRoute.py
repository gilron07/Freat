from flask import request, json, Response, Blueprint, jsonify
from ..models.PostingModel import PostingModel, PostingSchema
from flask_cors import CORS,cross_origin


posting_schema = PostingSchema()

posting_api = Blueprint('posting', __name__)
CORS(posting_api, support_credentials=True)

@posting_api.route('/', methods=['GET'])
@cross_origin(supports_credentials=True)
def getPostings():
    """
    Get all the available postings
    """
    posts = PostingModel.get_all_postings()
    data = posting_schema.dump(posts, many=True)
    print(data)
    return custom_response(data, 200)

def custom_response(res, status_code):
  """
  Custom Response Function
  """
  return Response(
    mimetype="application/json",
    response=json.dumps(res),
    status=status_code
  )