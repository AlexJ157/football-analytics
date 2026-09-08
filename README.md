# Football Analytics

A full-stack football analytics application that uses live football data, historical match data, and machine learning to analyse teams and predict football match outcomes.

## Features

* Retrieve fixtures and results using the football-data.org API
* Analyse recent team performance and form
* Calculate and use team Elo ratings
* Generate match statistics and engineered features
* Predict **home win, draw, or away win**
* Provide probabilities for each predicted outcome
* Display predictions and statistics through a web interface

## Machine Learning

The prediction model is trained using historical football match data and currently uses features including:

* Team Elo ratings
* Recent form
* Goals scored and conceded
* Differences between home and away team statistics

A Random Forest classifier is used to predict the three possible match outcomes.

## Tech Stack

* **Python**
* **FastAPI** — backend API
* **Pandas & NumPy** — data processing
* **Scikit-learn** — machine learning
* **Joblib** — model persistence
* **JavaScript, HTML & CSS** — frontend
* **football-data.org** — football data API

## Project Structure

```text
football-analytics/
├── backend/       # FastAPI backend and API requests
├── frontend/      # Web interface
├── prediction/    # Machine learning and feature engineering
└── requirements.txt
```

## Current Progress

* [x] Football data API integration
* [x] Fixtures and results
* [x] Historical match dataset
* [x] Machine learning prediction model
* [x] Feature engineering
* [x] Elo ratings
* [x] Win/draw/away-win probabilities
* [x] Backend prediction endpoint
* [ ] Frontend prediction page
* [ ] Predicted scorelines
* [ ] Further model improvements

## Running the Project

Install the dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn backend.main:app --reload
```

The API documentation is then available at:

```text
http://127.0.0.1:8000/docs
```
