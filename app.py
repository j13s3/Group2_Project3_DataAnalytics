""" Flask application that runs the API and renders the html page(s) """
import sqlalchemy

from flask import Flask, render_template, jsonify, request

from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, or_
from sqlalchemy.ext.automap import automap_base

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

from flask_cors import CORS

# Setup the database
engine = create_engine("sqlite:///Picnic_Database.db")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables

Base.prepare(autoload_with=engine)

# session = Session(engine)

print(Base.classes.keys())

picnic_places = Base.classes.Picnic_Spots

# Spin up flask app
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///Picnic_Database.sqlite"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

@app.route("/")
def home():
    return "index.html"

# You need this - this allows you to actually run the app
if __name__ == "__main__":
    app.run(debug=True)