""" Flask application that runs the API and renders the html page(s) """

# Import Dependencies
import json
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
print(Base.classes.keys())
picnic_places = Base.classes.Picnic_Spots

# Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///Picnic_Database.sqlite"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

# Webpages
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ward_bar_chart")
def ward_bar_chart():
    return render_template(".html")

@app.route("/bar_chart")
def bar_chart():
    return render_template("bar_chart.html")

@app.route("/GeoJSON")
def GeoJSON():
    return render_template("GeoJSON.html")

# Flask
session = Session(engine)

@app.route("/api/json_data", methods= ['GET'])
def get_data():
    picnic_data = session.query(picnic_places).all()
    json_data = []
    for row in picnic_data:
        json_data.append({"id": row.id, "Amenity": row.Amenity, "Suburb": row.Suburb, "Reserve": row.Reserve, "Longitude": row.Longitude, "Latitude": row.Latitude, "Ward": row.Ward, "Google": row.Google})
    session.close()
    return jsonify(json_data)

# Required to run the app
if __name__ == "__main__":
    app.run(debug=True)