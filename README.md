# Fambly

An app for storing and organizing information about friends, family, and other contacts. 

## Running the app locally

Webpacking JavaScript (in its own separate terminal tab or window): `bin/webpack` or `bin/webpack-dev-server` (if you want it to auto-compile whenever you save a JavaScript or TypeScript file)

Rails server (in its own separate terminal tab or window): `rails server` (or `rails s`)


## Testing

Backend (Ruby — RSpec): `bin/rspec`

Frontend (JavaScript — Jest + Enzyme): `yarn test`


## Things to do every time you add a new field to the person profile

* Add the relevant database table(s), if necessary
* Add the relevant mutations, if necessary
* Add the field to the `PersonFieldsInput` component
* Create a form to allow the user to add the new field(s) to a person profile 
* Add display components for the field and add the container component to the `PersonContainer` file
* Make sure the display component(s) have edit and delete functionality
* Write tests for all new components and add to existing test files as necessary
