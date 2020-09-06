module Types
  class PlaceType < Types::BaseObject
    field :id, ID, null: false
    field :country, String, null: false
    field :state_or_region, String, null: true
    field :town, String, null: true
    field :street, String, null: true
    field :zip_code, String, null: true
  end
end