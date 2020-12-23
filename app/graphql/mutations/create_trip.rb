module Types
  class CreateTripInputType < Types::BaseInputObject

  end
end

# Need all the (optional) info for both departure and end points
# Also need all the (optional) departure and end date info
# I'm thinking you make adding people to the trip separate, both in the UI and in this mutation
