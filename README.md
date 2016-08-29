# About
This site implements basic banking functionality.
It allows managers, tellers and customers to log on to the site.

## Live
[Live](https://serene-beach-16856.herokuapp.com/)

## Live Admin
[Live Admin](https://serene-beach-16856.herokuapp.com/admin/login/)
Accounts and Users can be managed through Admin in addition to the site.
Currently editing users must be done through adim.

## Travis Builds
[Travis Builds](https://travis-ci.org/jasminenoack/test-site/branches)

## Files

- setup.sh:
-- This file can be run to set up the app locally.
-- It requires that you have node and pip installed.
-- The app runs on Python3.

- assets/bundles
-- These files are version controlled because heroku is using them to manage the static assets.

- assets/js
-- This directory contains the react-redux files

- bank_management
-- This contains the base django app

- accounts
-- This contains the account model and views

- auth
-- This contains views that are used to manage users and permissions

- home
-- This contains the base view that renders the site's React

- transaction
-- This contains the transaction models and views

- .codeclimate.yml
-- This contains the setting for codeclimate
-- I am using it to track testing and do static code analysis

- Procfile / runtime.txt
-- Contains the settings for the Heroku deployment

- requirements.txt
-- Contains the apps python requirements

- package.json
-- Contains the javaScript configuration for the app

## Roles

### Customers
These represent bank customers.
They are able to go onto the site and check their balance.
They also can transfer money between their own accounts.

### Tellers
Tellers are able to complete any of the above actions.
Tellers are able to add withdrawals, deposits, and transfers.
Tellers can make new accounts.
Tellers are able to create customers

### Managers
Managers are able to complete any of the above actions.
Managers can also create tellers and managers

## Testing

### Libraires
- python: nose
- javascript: jest, chai, enzyme

#### Measuring Coverage
- python: Coverage
- javaScript: Istanbul

# Users:
## Superuser:
    username: roger
    password: 4iport12

## Teller:
    username: jack
    password: password123

## Customers:
    username: frederick
    password: grandpa1

## Work Flows

## User Creation
![alt text](https://d3vv6lp55qjaqc.cloudfront.net/items/1V2B1W2v0t1g35342r3n/Screen%20Recording%202016-08-29%20at%2001.59%20AM.gif "User Creation")

## Account Creation
![alt text](https://d3vv6lp55qjaqc.cloudfront.net/items/0e0y2B3e1X0G0v462B1v/Screen%20Recording%202016-08-29%20at%2002.05%20AM.gif "Account Creation")

## Transaction Creation
### Withdrawal
![alt text](https://d3vv6lp55qjaqc.cloudfront.net/items/0p0U3o1B1v3h1q3F2l3F/Screen%20Recording%202016-08-29%20at%2002.06%20AM.gif "Withdrawal Creation")
### Deposit
![alt text](https://d3vv6lp55qjaqc.cloudfront.net/items/373R3e2K1O2H253k3J3v/Screen%20Recording%202016-08-29%20at%2002.07%20AM.gif "Deposit Creation")
### Transfer
![alt text](https://d3vv6lp55qjaqc.cloudfront.net/items/3t0E201B2h0J2i3e0s2U/Screen%20Recording%202016-08-29%20at%2002.08%20AM.gif "Transfer Creation")

## Account Detail
![alt text](https://d3vv6lp55qjaqc.cloudfront.net/items/1F1m150t2G3h0E3i2E1k/Screen%20Shot%202016-08-29%20at%204.44.39%20AM.png "Account Detail")


## Customer Experience

![alt text](https://d3vv6lp55qjaqc.cloudfront.net/items/1l091g0h3E0A2S2M0L3T/Screen%20Recording%202016-08-29%20at%2002.46%20AM.gif "Customer Experience")

# More Information

## Trello Board:
[Board](https://trello.com/b/FJbGahi9/banking-app)
Lists the user stories that I was implmenting as well as additional features I am working on.

## Style
The styling is done with picnic css
