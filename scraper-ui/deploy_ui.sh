#!/bin/bash
npm run build && aws s3 sync build/ s3://scraper-ui --profile ross-aws