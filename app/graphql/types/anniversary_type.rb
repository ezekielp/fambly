module Types
  class AnniversaryType < Types::BaseObject
    field :partner_one_name, String, null: false
    field :partner_one_id, ID, null: false
    field :partner_two_name, String, null: false
    field :partner_two_id, ID, null: false
    field :wedding_year, Int, null: true
    field :wedding_month, Int, null: true
    field :wedding_day, Int, null: true
  end
end
