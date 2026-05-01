# Skill: research_business

Deep-research a specific business before building their demo site.
Collects: logo, brand colors, fonts, real photos, real reviews, menu/services, social links, owner name, story, tagline, hours, certifications, awards.

## Usage
python scripts/run.py "Business Name" "City, State"

## Output
JSON object with all research data ready to be injected into site build.

## What it does
1. Searches Google for the business + city
2. Visits their Google Maps listing
3. Scrapes Facebook page if found
4. Scrapes Instagram if found  
5. Checks Yelp listing
6. Checks any existing website
7. Extracts: logo URL, dominant colors, fonts used, photos, reviews, hours, services, owner info, taglines, awards
8. Returns structured JSON ready for site builder
