module Types
  class EmailType < Types::BaseObject
    field :id, ID, null: false
    field :person, Types::PersonType, null: false
    field :email_address, String, null: false
    field :email_type, String, null: true
  end
end