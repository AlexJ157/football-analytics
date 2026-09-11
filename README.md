# Football Analytics

A full-stack football analytics application that uses live and historical match data with machine learning to analyse team form and predict match outcomes. Built end-to-end — data pipeline, ML model, API, and frontend — as a portfolio project.

## Features

- Retrieve fixtures and results via the football-data.org API
- Analyse recent team form and head-to-head history
- Calculate and maintain team Elo ratings, with season-boundary regression
- Generate engineered match statistics (goals scored/conceded, home/away differentials)
- Predict match outcome (home win / draw / away win) with a probability for each
- Match detail pages with prediction probability bars, form chips, h2h history, and top scorers
- League filtering, fixture/results toggling, and date-grouped match cards

## Machine Learning

A Random Forest classifier predicts match outcome from Elo ratings, recent form, and goals-based features, with home/away statistical differentials. Predictions are currently scoped to the Premier League, where the historical dataset is richest — form and h2h data remain available for all competitions.

The model runs at **~53.6% accuracy** against a ~44.6% majority-class baseline (always predicting home win), validated with cross-validation and backtested log loss on the Elo regression.

**Notable fixes during development:**
- A `StandardScaler` data leak between training and inference
- An Elo tuple-unpacking bug that leaked post-match ratings into pre-match features
- A backwards label mapping in the prediction pipeline
- Cross-validation confirmed the accuracy ceiling sits in the feature set rather than model choice — informed where future work should focus (see below)

The free tier of the football-data.org API doesn't expose odds or shot data for upcoming fixtures, so the live model is deliberately restricted to Elo/form/goals features. An odds-inclusive variant was explored separately and is documented as a possible extension.

## Tech Stack

- **Backend:** Python, FastAPI
- **Data processing:** Pandas, NumPy
- **Machine learning:** Scikit-learn, Joblib (model persistence)
- **Frontend:** JavaScript, HTML, CSS
- **Data source:** football-data.org API

The backend handles all filtering, sorting, and pagination — the frontend stays a thin presentation layer over the API.

## Project Structure

```
football-analytics/
├── backend/       # FastAPI app and API request handling
├── frontend/      # Web interface (fixtures, results, match detail pages)
├── prediction/    # ML pipeline, feature engineering, and models/
└── requirements.txt
```

## Running the Project

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn backend.main:app --reload
```

API docs are then available at:

```
http://127.0.0.1:8000/docs
```

## Possible Extensions

- Incorporate odds and shot-based features once a paid API tier is available
- Predicted scorelines, not just outcome probabilities
- Broaden ML predictions beyond the Premier League as more historical data is gathered

The API documentation is then available at:

```text
http://127.0.0.1:8000/docs
```
