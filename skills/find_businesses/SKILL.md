---
name: find_businesses
description: Search Google Maps for local businesses near Augusta, GA with no websites
argument-hint: [category] [location] [limit]
---

Searches Google Places API for businesses in a given category and location.
Only returns businesses WITHOUT an existing website.
Outputs a JSON array of business leads ready to save to the BusinessLead entity.

Arguments:
1. category - e.g. "contractor", "plumber", "restaurant"
2. location - e.g. "Augusta, Georgia"
3. limit - max results (default: 10)
